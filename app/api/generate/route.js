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
