import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

const WHITESPACE_PATTERN = /\s+/g;
const MINIMUM_TEXT_LENGTH = 50;
let pdfWorkerInitialized = false;
const { getDocument, GlobalWorkerOptions } = pdfjsLib;

function stripControlCharacters(raw: string): string {
  const buffer: string[] = [];

  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    const code = raw.charCodeAt(index);

    if (code >= 32 || code === 9 || code === 10 || code === 13) {
      buffer.push(char);
    }
  }

  return buffer.join("");
}

function cleanExtractedText(raw: string): string {
  return stripControlCharacters(raw).replace(WHITESPACE_PATTERN, " ").trim();
}

function ensurePdfWorker() {
  if (pdfWorkerInitialized) {
    return;
  }

  if (typeof window !== "undefined") {
    GlobalWorkerOptions.workerSrc = workerSrc;
    pdfWorkerInitialized = true;
  }
}

async function extractTextWithPdfjs(file: File): Promise<string> {
  ensurePdfWorker();

  const arrayBuffer = await file.arrayBuffer();
  const pdfData = new Uint8Array(arrayBuffer);
  const pdf = await getDocument({ data: pdfData }).promise;

  try {
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const textItems = content.items as TextItem[];
      const pageText = textItems
        .map((item) => item.str ?? "")
        .join(" ");

      pageTexts.push(pageText);
    }

    return cleanExtractedText(pageTexts.join(" \n "));
  } finally {
    await pdf.cleanup();
    await pdf.destroy();
  }
}

async function extractTextWithByteScan(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  let text = "";
  for (let i = 0; i < uint8Array.length; i++) {
    const char = String.fromCharCode(uint8Array[i]);
    if (/[\x20-\x7E\n\r\t]/.test(char)) {
      text += char;
    }
  }

  return cleanExtractedText(text);
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfJsText = await extractTextWithPdfjs(file);

    if (pdfJsText && pdfJsText.length >= MINIMUM_TEXT_LENGTH) {
      return pdfJsText;
    }

    throw new Error("PDF text extraction produced insufficient content.");
  } catch (pdfJsError) {
    console.warn("Falling back to byte-scan PDF extraction due to:", pdfJsError);

    try {
      const fallbackText = await extractTextWithByteScan(file);

      if (fallbackText && fallbackText.length >= MINIMUM_TEXT_LENGTH) {
        return fallbackText;
      }

      throw new Error("Fallback PDF extraction produced insufficient content.");
    } catch (fallbackError) {
      console.error("PDF parsing error:", fallbackError);
      throw new Error("Failed to parse PDF file. Please try using a .txt file or paste the text directly.");
    }
  }
}

export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentFile = zip.file("word/document.xml");

    if (!documentFile) {
      throw new Error("DOCX file is missing document content.");
    }

    const documentXml = await documentFile.async("string");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, "application/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Unable to parse DOCX XML content.");
    }

    const namespaceUri = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
    const paragraphNodes = Array.from(xmlDoc.getElementsByTagNameNS(namespaceUri, "p"));

    const paragraphTexts = paragraphNodes
      .map((paragraph) => {
        const textRuns = Array.from(paragraph.getElementsByTagNameNS(namespaceUri, "t"));
        const tabs = Array.from(paragraph.getElementsByTagNameNS(namespaceUri, "tab")).map(() => "\t");
        const breaks = Array.from(paragraph.getElementsByTagNameNS(namespaceUri, "br")).map(() => "\n");
        const runText = textRuns.map((node) => node.textContent ?? "").join("");
        return [runText, ...tabs, ...breaks].join(" ").trim();
      })
      .filter((paragraphText) => paragraphText.length > 0);

    let rawText = paragraphTexts.join("\n");

    if (!rawText) {
      const textElements = Array.from(xmlDoc.getElementsByTagName("w:t"));
      rawText = textElements.map((node) => node.textContent ?? "").join(" ");
    }

    const cleaned = cleanExtractedText(rawText);

    if (!cleaned || cleaned.length < 20) {
      console.warn("DOCX extraction produced limited content; returning raw fallback.");
      return rawText.trim();
    }

    return cleaned;
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error("Failed to parse DOCX file. Please try using a .txt file or paste the text directly.");
  }
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
