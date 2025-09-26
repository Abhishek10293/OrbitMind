import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { provider, messages } = await req.json();

    // 🛡️ Clean invalid/empty messages
    const cleanedMessages = (messages || []).filter(
      (m: any) =>
        m?.role &&
        ["system", "user", "assistant"].includes(m.role) &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
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
    const reply = data?.choices?.[0]?.message?.content || "⚠️ No response generated.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}
