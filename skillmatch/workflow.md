# SkillMatcher Workflow

This document outlines the complete workflow of the SkillMatcher application, from user authentication to detailed analysis and history management.

## 1. User Authentication

The user journey begins with a secure authentication process.

-   **Sign Up:** New users can create an account by providing a username, email, and password. The password is required for future actions like deleting analysis history.
-   **Login:** Existing users can log in with their email and password.

The authentication form is designed to be user-friendly, with a clean and spacious layout.

## 2. The Analysis Engine

Once authenticated, the user can start analyzing resumes against job descriptions.

### 2.1. Input

-   **Resume and Job Description:** Users can upload `.txt`, `.pdf`, or `.docx` files, or paste the text directly into the provided text areas. DOCX parsing preserves paragraph structure so resumes authored in Word, Google Docs, or similar tools analyze correctly.
-   **Job Title:** A field is provided to enter the job title for the position being analyzed. This helps in organizing the analysis history.
-   **Content Preview:** After uploading a file, users can click on a dropdown to view the extracted text, ensuring the content has been parsed correctly.

### 2.2. The AI-Powered Core

The heart of SkillMatcher is its custom-built analysis engine, which provides a deep, semantic understanding of the provided texts.

-   **Skill Database:** The engine is powered by a comprehensive, hierarchical database of skills covering programming languages, frameworks, cloud technologies, data science, product, design, marketing, content, customer success, project coordination, and other non-technical domains.
-   **Semantic Understanding:** The system understands the relationships between skills. For example, it knows that "Artificial Intelligence" is a parent field to "Machine Learning," and that "PyTorch" is a framework used for "Deep Learning." This prevents related skills from being incorrectly flagged as "extra" or "missing."
-   **Fuzzy Matching:** Instead of a simple word-for-word match, the engine uses fuzzy string matching to identify skills even if they are not written exactly as they appear in the database.
-   **Confidence Scoring:** Each extracted skill is assigned a confidence score based on its frequency and the context in which it appears (e.g., "experience with Python" vs. just "Python").

### 2.3. The Analysis Process

When the user clicks "Analyze Match," the following happens:

1.  The resume and job description text are sent to a Supabase function.
2.  The `CustomJobMatcher` class is instantiated, which in turn uses the `CustomSkillExtractor` and `SkillDatabase`.
3.  Skills are extracted from both the resume and the job description, complete with confidence scores and categories.
4.  The engine calculates a weighted match score, considering the importance of each skill in the job description.
5.  A detailed comparison is generated, categorizing each skill as an "Exact Match," "Weak Match," or "Missing."

## 3. The Results Display

The analysis results are presented in a clear and actionable format.

-   **Overall Match Score:** A prominent score from 0-100% gives a quick overview of the match quality.
-   **Skills Comparison Table:** A detailed table provides a side-by-side comparison of skills from the resume and job description, showing the match type, category, and priority.
-   **Skills Breakdown:** Matched, missing, and extra skills are displayed in separate cards for easy review.
-   **Personalized Recommendations:** The system generates a list of actionable recommendations, such as which skills to focus on developing and how to tailor the resume.

## 4. History Management

All analyses are saved to the user's history for future reference.

-   **History View:** The "History" tab displays a list of all past analyses, including the job title, resume file name, and match score.
-   **Individual Deletion:** Each analysis in the history can be deleted individually.
-   **Delete All:** A "Delete All" button allows the user to clear their entire analysis history.
-   **Password Confirmation:** To prevent accidental data loss, the user is required to enter their password to confirm any deletion, whether it's a single entry or the entire history.

This comprehensive workflow ensures a secure, insightful, and user-friendly experience for anyone looking to optimize their job applications.
