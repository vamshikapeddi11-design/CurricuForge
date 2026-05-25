import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(req) {
  const body = await req.json();
  const { role, duration } = body;

  if (!role) {
    return Response.json({ error: "role is required" }, { status: 400 });
  }
  if (!duration) {
    return Response.json({ error: "duration is required" }, { status: 400 });
  }

  const prompt = `You are an expert curriculum designer for FAANG-level training.

Create a WEEK-WISE structured learning plan.

ROLE: ${role}
DURATION: ${duration}

RULES:
- Must be realistic for job preparation
- Must include real technologies and tools
- No generic words like "basics" or "concepts"
- Every week must have:
  1. topic
  2. notes (short learning explanation)
  3. youtubeSearchQuery (for videos)
  4. project

OUTPUT STRICT JSON ONLY (no markdown, no extra text):
[
  {
    "week": 1,
    "topic": "...",
    "notes": "...",
    "youtubeSearchQuery": "...",
    "project": "..."
  }
]`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text;

  let weeks;
  try {
    weeks = JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      return Response.json({ error: "Failed to parse curriculum" }, { status: 500 });
    }
    weeks = JSON.parse(match[0]);
  }

  return Response.json({ role, duration, weeks });
}
