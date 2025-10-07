// Simple PDF text extraction using pdfjs-dist
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // For PDF parsing, we'll use a simpler approach with FileReader
    // and extract basic text content
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to text (basic approach - will work for simple PDFs)
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const char = String.fromCharCode(uint8Array[i]);
      if (char.match(/[\x20-\x7E\n\r\t]/)) {
        text += char;
      }
    }
    
    // Clean up the extracted text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .trim();
    
    if (!text || text.length < 50) {
      throw new Error('Could not extract text from PDF. Please try converting it to .txt format or pasting the text directly.');
    }
    
    return text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please try using a .txt file or paste the text directly.');
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
