import { GoogleGenAI, Modality, Type } from "@google/genai";
import { uploadToImageKit } from "./imageKit.js";

interface GenerateSocialDraftInput {
  prompt: string;
  tone: string;
  brandVoice: string;
  generateImage: boolean;
  userId: string;
}

interface SocialDraft {
  content: string;
  imagePrompt: string;
  mediaUrl?: string;
}

interface HashtagSuggestionResponse {
  hashtags: string[];
}

const ai = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing. Add it to server/.env to enable AI Composer.");
  }

  return new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
};

const buildContentPrompt = (prompt: string, tone: string, brandVoice: string) => `
You are Sociora's AI social media composer.

Create a ready-to-schedule social media post and a production-quality image prompt from the user's brief.

Brand voice:
${brandVoice}

Required tone:
${tone}

User brief:
${prompt}

Rules:
- Write one finished social caption, not instructions.
- Keep it under 140 words unless the user asks for a long-form post.
- Start with a clear hook.
- Include practical value and a natural call to action.
- Use line breaks for readability.
- Use no more than 2 emojis.
- Do not mention that you are an AI.
- The image prompt must describe a clean, brand-safe visual for social media, with no text, logos, watermarks, UI screenshots, or distorted hands/faces.
`;

const extractJson = (text: string) => {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch?.[1] ?? trimmed;
  return JSON.parse(jsonText);
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const imageExtension = (mimeType: string) => {
  if (mimeType.includes("webp")) {
    return "webp";
  }

  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    return "jpg";
  }

  return "png";
};

const uploadGeneratedImage = async (imageBytes: string, mimeType: string, userId: string, source: string) => {
  const upload = await uploadToImageKit({
    buffer: Buffer.from(imageBytes, "base64"),
    fileName: `sociora-${source}-${Date.now()}.${imageExtension(mimeType)}`,
    folder: `/sociora/ai-generations/${userId}`,
    mimeType,
  });

  return upload.url;
};

const generateImageWithGemini = async (imagePrompt: string) => {
  const response = await ai().models.generateContent({
    model: process.env.GOOGLE_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation",
    contents: imagePrompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const imagePart = response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => part.inlineData?.data);
  const imageBytes = imagePart?.inlineData?.data ?? response.data;

  if (!imageBytes) {
    throw new Error(response.promptFeedback?.blockReasonMessage ?? "Google did not return an image.");
  }

  return {
    imageBytes,
    mimeType: imagePart?.inlineData?.mimeType ?? "image/png",
  };
};

const generateImageWithFreeFallback = async (imagePrompt: string) => {
  const prompt = encodeURIComponent(imagePrompt);
  const response = await fetch(`https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&nologo=true&safe=true`);

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Free image fallback failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();

  return {
    imageBytes: Buffer.from(arrayBuffer).toString("base64"),
    mimeType: contentType,
  };
};

const generateImage = async (imagePrompt: string, userId: string) => {
  try {
    const { imageBytes, mimeType } = await generateImageWithGemini(imagePrompt);
    return uploadGeneratedImage(imageBytes, mimeType, userId, "gemini-image");
  } catch (googleError) {
    console.warn(`[AI Image] Google image generation failed: ${errorMessage(googleError)}. Trying free fallback.`);

    try {
      const { imageBytes, mimeType } = await generateImageWithFreeFallback(imagePrompt);
      return uploadGeneratedImage(imageBytes, mimeType, userId, "free-image");
    } catch (fallbackError) {
      throw new Error(`Image generation failed. Google: ${errorMessage(googleError)}. Free fallback: ${errorMessage(fallbackError)}`);
    }
  }
};

export const generateSocialDraft = async ({
  prompt,
  tone,
  brandVoice,
  generateImage: shouldGenerateImage,
  userId,
}: GenerateSocialDraftInput): Promise<SocialDraft> => {
  const response = await ai().models.generateContent({
    model: process.env.GOOGLE_TEXT_MODEL || "gemini-2.5-flash",
    contents: buildContentPrompt(prompt, tone, brandVoice),
    config: {
      temperature: 0.75,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["content", "imagePrompt"],
        properties: {
          content: {
            type: Type.STRING,
            description: "The finished social media caption.",
          },
          imagePrompt: {
            type: Type.STRING,
            description: "A detailed prompt for a social media image generator.",
          },
        },
      },
    },
  });

  const draft = extractJson(response.text ?? "") as SocialDraft;

  if (!draft.content?.trim() || !draft.imagePrompt?.trim()) {
    throw new Error("Google returned an incomplete AI draft.");
  }

  if (!shouldGenerateImage) {
    return draft;
  }

  return {
    ...draft,
    mediaUrl: await generateImage(draft.imagePrompt, userId),
  };
};

const sanitizeHashtags = (hashtags: string[]) =>
  Array.from(new Set(
    hashtags
      .map((hashtag) => hashtag.trim().replace(/^#+/, "").replace(/[^A-Za-z0-9_]/g, ""))
      .filter((hashtag) => hashtag.length >= 2 && hashtag.length <= 40)
      .map((hashtag) => `#${hashtag}`),
  )).slice(0, 12);

const fallbackHashtags = (content: string, platforms: string[]) => {
  const stopWords = new Set([
    "about", "after", "again", "also", "and", "are", "for", "from", "have", "into", "our", "that", "the", "this", "with", "your",
  ]);
  const words = content
    .toLowerCase()
    .match(/[a-z0-9]{4,}/g) ?? [];
  const keywordTags = words
    .filter((word) => !stopWords.has(word))
    .slice(0, 8)
    .map((word) => `#${word.charAt(0).toUpperCase()}${word.slice(1)}`);
  const platformTags = platforms.map((platform) => `#${platform.charAt(0).toUpperCase()}${platform.slice(1)}`);

  return sanitizeHashtags([...keywordTags, ...platformTags, "#SocialMedia", "#Marketing"]);
};

export const generateHashtagSuggestions = async ({
  content,
  platforms,
  brandVoice,
}: {
  content: string;
  platforms: string[];
  brandVoice: string;
}) => {
  const baseFallback = fallbackHashtags(content, platforms);

  try {
    const response = await ai().models.generateContent({
      model: process.env.GOOGLE_TEXT_MODEL || "gemini-2.5-flash",
      contents: `
You are Sociora's hashtag strategist.

Suggest concise, relevant hashtags for this social post.

Brand voice:
${brandVoice}

Platforms:
${platforms.length > 0 ? platforms.join(", ") : "general social media"}

Post content:
${content}

Rules:
- Return 8 to 12 hashtags.
- Each hashtag must start with #.
- Use platform-aware tags where useful.
- Avoid spammy, vague, or unrelated tags.
- No explanations.
`,
      config: {
        temperature: 0.55,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["hashtags"],
          properties: {
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const result = extractJson(response.text ?? "") as HashtagSuggestionResponse;
    const suggestions = sanitizeHashtags(result.hashtags ?? []);
    return suggestions.length > 0 ? suggestions : baseFallback;
  } catch (error) {
    console.warn(`[AI Hashtags] Falling back to keyword hashtags: ${errorMessage(error)}`);
    return baseFallback;
  }
};
