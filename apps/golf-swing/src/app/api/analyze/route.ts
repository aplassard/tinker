import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { GOLF_ANALYSIS_PROMPT } from "@/lib/prompt";
import type { SwingAnalysis, AnalyzeErrorResponse } from "@/lib/types";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message } satisfies AnalyzeErrorResponse, {
    status,
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse("Server misconfigured: missing GEMINI_API_KEY", 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Invalid request: expected multipart form data", 400);
  }

  const file = formData.get("video");
  if (!file || !(file instanceof Blob)) {
    return errorResponse("Missing video file", 400);
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return errorResponse(
      `Invalid video format: ${file.type}. Accepted: MP4, MOV, WebM.`,
      400
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return errorResponse(
      `File too large: ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum is 30 MB.`,
      413
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  let uploadedFileName: string | undefined;

  try {
    // Upload to Google File API
    const uploaded = await ai.files.upload({
      file,
      config: { mimeType: file.type },
    });

    uploadedFileName = uploaded.name;

    if (!uploaded.uri) {
      return errorResponse("File upload failed: no URI returned", 502);
    }

    // Call Gemini with the uploaded file
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: uploaded.uri, mimeType: file.type } },
            { text: GOLF_ANALYSIS_PROMPT },
          ],
        },
      ],
    });

    const text = result.text;
    if (!text) {
      return errorResponse("Gemini returned an empty response", 502);
    }

    // Parse the JSON response
    let analysis: SwingAnalysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      return errorResponse("Failed to parse Gemini response as JSON", 502);
    }

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error during analysis";

    // Check for rate limiting
    if (message.includes("429") || message.toLowerCase().includes("rate")) {
      return errorResponse(
        "Gemini API rate limit exceeded. Please try again later.",
        429
      );
    }

    return errorResponse(message, 502);
  } finally {
    // Clean up uploaded file
    if (uploadedFileName) {
      try {
        await ai.files.delete({ name: uploadedFileName });
      } catch {
        // Best-effort cleanup — don't fail the request
      }
    }
  }
}
