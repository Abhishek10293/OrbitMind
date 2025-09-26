import { NextRequest, NextResponse } from "next/server";

// Define proper type for a chat message
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { provider, messages } = await req.json();

    // 🛡️ Clean invalid/empty messages
    const cleanedMessages: ChatMessage[] = (messages || []).filter(
      (m: unknown): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        ["system", "user", "assistant"].includes((m as any).role) &&
        "content" in m &&
        typeof (m as any).content === "string" &&
        (m as any).content.trim() !== ""
    );

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: provider,
        messages: cleanedMessages,
      }),
    });

    const data = await response.json();
    console.log("🔍 OpenRouter raw:", JSON.stringify(data, null, 2));

    // Extract assistant reply safely
    const reply: string = data?.choices?.[0]?.message?.content || "⚠️ No response generated.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("❌ Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}
