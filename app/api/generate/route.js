export async function POST(request) {
  try {
    // ✅ Get data from frontend
    const body = await request.json();

    const role = body.role || "Software Engineer";
    const duration = body.duration || "4 weeks";

    // ✅ Your prompt
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

    // ✅ TEMP RESPONSE (since no API)
    const dummyData = [
      {
        week: 1,
        topic: `${role} Fundamentals`,
        notes: `Learn core tools and setup for ${role}`,
        youtubeSearchQuery: `${role} beginner tutorial`,
        project: `Build a simple ${role} project`,
      },
    ];

    return Response.json(dummyData);

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
