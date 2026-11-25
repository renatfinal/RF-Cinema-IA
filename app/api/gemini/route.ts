import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, prompt, script, style, duration, language } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (action === "generateScript") {
      const systemPrompt = `Você é um roteirista profissional de cinema e curtas-metragens. Crie um roteiro cinematográfico emocionante, bem estruturado e cativante baseado na ideia do usuário.
Estilo visual: ${style || "Cinematográfico"}
Duração alvo: ${duration || "4 minutos"}
Idioma: ${language || "Português brasileiro"}
Ideia do usuário: ${prompt}

Retorne um texto de roteiro limpo e profissional, incluindo título, sinopse curta, e descrição das cenas e diálogos.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });

      return NextResponse.json({ result: response.text });
    }

    if (action === "breakdown") {
      const systemPrompt = `Você é um diretor de cinema e especialista em storyboard. Analise o seguinte roteiro e divida-o em uma lista detalhada de cenas (entre 4 e 10 cenas).
Estilo visual: ${style || "Filme realista"}
Duração total desejada: ${duration || "4 minutos"}
Idioma: ${language || "Português brasileiro"}

Roteiro:
${script}

Retorne estritamente um objeto JSON válido (sem markdown extra fora do JSON, ou dentro de bloco json) com a seguinte estrutura:
{
  "scenes": [
    {
      "number": 1,
      "title": "Título da Cena",
      "duration": 30,
      "visual": "Descrição visual detalhada para IA (iluminação, enquadramento, atmosfera, cor)",
      "action": "Ação principal e narrativa da cena",
      "dialogue": "Falas ou narração da cena",
      "soundDesign": "Efeitos sonoros e trilha sonora sugerida"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });

      let text = response.text || "";
      // Clean up markdown code blocks if present
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let jsonResult;
      try {
        jsonResult = JSON.parse(text);
      } catch (err) {
        // Fallback or attempt regex extraction
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          jsonResult = JSON.parse(match[0]);
        } else {
          throw new Error("Falha ao analisar JSON retornado pela IA: " + text);
        }
      }

      return NextResponse.json(jsonResult);
    }

    if (action === "chat") {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Você é um co-piloto especialista em direção de curtas-metragens e roteiros. Responda à dúvida do usuário de forma criativa, técnica e útil em português:\n\n${prompt}`,
      });

      return NextResponse.json({ result: response.text });
    }

    return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar requisição com IA." },
      { status: 500 }
    );
  }
}
