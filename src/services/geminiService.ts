import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeneratedPost {
  headline: string;
  body: string;
  hashtags: string[];
  cta: string;
}

export async function generateFacebookPost(carDetails: {
  brand: string;
  model: string;
  year: string;
  condition: string;
  location: string;
}): Promise<GeneratedPost> {
  const prompt = `
    Genereer een pakkende Facebook post voor een sloopauto inkoop bedrijf.
    De post moet in het Nederlands zijn en gericht zijn op mensen die snel van hun oude of kapotte auto af willen.
    
    Details van de auto:
    - Merk: ${carDetails.brand}
    - Model: ${carDetails.model}
    - Bouwjaar: ${carDetails.year}
    - Staat: ${carDetails.condition}
    - Locatie: ${carDetails.location}

    De stijl moet modern, betrouwbaar en direct zijn. Focus op:
    - Direct geld (contant of bank)
    - Gratis ophaalservice in heel Nederland
    - RDW-vrijwaring direct geregeld
    - Geen gedoe

    Retourneer een JSON object met de volgende velden:
    - headline: Een korte, krachtige titel.
    - body: De hoofdtekst van de post (ongeveer 2-3 alinea's).
    - hashtags: Een lijst met 5-7 relevante hashtags.
    - cta: Een sterke call to action.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cta: { type: Type.STRING }
          },
          required: ["headline", "body", "hashtags", "cta"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as GeneratedPost;
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
}
