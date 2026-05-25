export async function POST(req) {
  try {
    const { role, duration } = await req.json();

    const prompt = `
You are an expert curriculum designer.

Create a WEEK-WISE roadmap.

ROLE: ${role}
DURATION: ${duration}

Rules:
- Return ONLY JSON
- No explanation
- Max 8 weeks

Format:
[
  {
    "week": 1,
    "topic": "",
    "notes": "",
    "youtubeSearchQuery": "",
    "project": ""
  }
]
`;

    // 🔥 TEMP MOCK (no OpenAI yet)
    const fakeResponse = [
      {
        week: 1,
        topic: `${role} Fundamentals`,
        notes: `Learn basics of ${role}`,
        youtubeSearchQuery: `${role} beginner tutorial`,
        project: `Build basic ${role} project`,
      },
      {
        week: 2,
        topic: `${role} Intermediate`,
        notes: `Deep dive into ${role}`,
        youtubeSearchQuery: `${role} intermediate`,
        project: `Build advanced feature`,
      },
    ];

    return Response.json(fakeResponse);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
