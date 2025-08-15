import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
const key = process.env.AZURE_FORM_RECOGNIZER_KEY;

/**
 * Analyze a PDF using Azure OCR (Form Recognizer)
 * - Limits processing time to avoid timeouts
 * - Optionally skips OCR for large PDFs
 * @param {Buffer} buffer - PDF file buffer
 * @param {Object} options
 * @param {number} options.maxWaitMs - Maximum time to wait for OCR result
 * @param {number} options.maxFileSizeMB - Skip OCR if file is bigger than this
 * @returns {Promise<string|null>} - Extracted text or null if skipped/timeout
 */
export async function analyzePdfWithAzure(
  buffer,
  { maxWaitMs = 30000, maxFileSizeMB = 10 } = {}
) {
  // Skip OCR for large PDFs to avoid huge delays
  const fileSizeMB = buffer.length / (1024 * 1024);
  if (fileSizeMB > maxFileSizeMB) {
    console.warn(`⚠ Skipping OCR (file size ${fileSizeMB.toFixed(2)} MB exceeds ${maxFileSizeMB} MB)`);
    return null;
  }

  const url = `${endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2023-07-31`;

  // Step 1: Start OCR
  const response = await axios.post(url, buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Ocp-Apim-Subscription-Key": key
    },
    timeout: maxWaitMs // also ensure initial request doesn't hang forever
  });

  const operationLocation = response.headers["operation-location"];
  if (!operationLocation) {
    throw new Error("Azure OCR did not return an operation-location");
  }

  // Step 2: Poll for result with timeout
  let result = null;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const poll = await axios.get(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key }
    });

    if (poll.data.status === "succeeded") {
      result = poll.data;
      break;
    } else if (poll.data.status === "failed") {
      console.error("❌ Azure Vision OCR failed:", poll.data);
      throw new Error("Azure Vision OCR failed");
    }

    await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
  }

  if (!result) {
    console.warn("⚠ OCR timed out — returning null text.");
    return null; // Let Gemini rely on PDF link instead
  }

  // Step 3: Extract text
  return result.analyzeResult?.content || null;
}
