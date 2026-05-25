export async function POST(req) {
  try {
    // ✅ Get data from frontend request
    const body = await req.json();
    const { role, duration } = body;

    if (!role || !duration) {
      return new Response(
        JSON.stringify({ error: "Missing role or duration" }),
        { status: 400 }
      );
    }

    // ✅ Your prompt (NOW role & duration are defined)
    const prompt = `
You are an expert curriculum designer for FAANG-level training.

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

OUTPUT STRICT JSON ONLY:
[
  {
    "week": 1,
    "topic": "...",
    "notes": "...",
    "youtubeSearchQuery": "...",
    "project": "..."
  }
]
`;

    // 👉 return prompt (or your AI response later)
    return new Response(JSON.stringify({ prompt }), {
      status: 200,
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
