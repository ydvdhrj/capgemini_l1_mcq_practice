/** Comprehensive timed tests — 60 MCQs, 1 hour each */
export const COMPREHENSIVE_TESTS = [
  {
    id: "test-01",
    file: "test-01.json",
    title: "Comprehensive Test 1",
    toughness: "Mixed Difficulty",
    toughnessLevel: "easy-medium-hard",
    toughnessDetail:
      "Includes Easy (20), Medium (25), and Hard (15) questions. Best for first full-length assessment.",
    difficultyMix: { easy: 20, medium: 25, hard: 15 },
    durationMinutes: 60,
    questionCount: 60,
    topics:
      "Core Java · DBMS · Java Backend · Docker · Angular · Software Development",
  },
  {
    id: "test-02",
    file: "test-02.json",
    title: "Comprehensive Test 2",
    toughness: "Intermediate to Advanced",
    toughnessLevel: "medium-hard",
    toughnessDetail:
      "Medium (28) and Hard (32) only — no easy questions. For learners who completed basics.",
    difficultyMix: { easy: 0, medium: 28, hard: 32 },
    durationMinutes: 60,
    questionCount: 60,
    topics:
      "Core Java · DBMS · Java Backend · Docker · Angular · Software Development",
  },
  {
    id: "test-03",
    file: "test-03.json",
    title: "Comprehensive Test 3",
    toughness: "Advanced / Challenge",
    toughnessLevel: "hard-focus",
    toughnessDetail:
      "Medium (12) and Hard (48) — toughest set. Simulates interview-grade pressure.",
    difficultyMix: { easy: 0, medium: 12, hard: 48 },
    durationMinutes: 60,
    questionCount: 60,
    topics:
      "Core Java · DBMS · Java Backend · Docker · Angular · Software Development",
  },
];

export function getTestById(id) {
  return COMPREHENSIVE_TESTS.find((t) => t.id === id);
}
