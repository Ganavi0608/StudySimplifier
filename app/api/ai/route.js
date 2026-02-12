
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, type, messages } = body;


    if (text && type) {
      let prompt = "";

      if (type === "summary") {
        prompt = `Summarize the following content clearly and concisely:\n\n${text}`;
      } else if (type === "insights") {
        prompt = `Extract key insights and important points from the following content:\n\n${text}`;
      }

      const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo", 
        messages: [
          { role: "system", content: "You are a helpful academic assistant." },
          { role: "user", content: prompt }
        ],
      });

      return Response.json({
        result: completion.choices[0].message.content,
      });
    }

    
    if (messages && Array.isArray(messages)) {
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages,
      });

      return Response.json({
        result: completion.choices[0].message.content,
      });
    }

    return Response.json(
      { error: "Invalid request format" },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}
