import { PHASE_GROUPS, getPhaseById } from "./phases-config.js";
import { COMPREHENSIVE_TESTS, getTestById } from "./tests-config.js";

const STORAGE_KEY = "l1-mcq-progress";
const TEST_DURATION_SEC = 60 * 60;

const views = {
  home: document.getElementById("home-view"),
  testIntro: document.getElementById("test-intro-view"),
  quiz: document.getElementById("quiz-view"),
  results: document.getElementById("results-view"),
};

const els = {
  phaseGroups: document.getElementById("phase-groups"),
  testCards: document.getElementById("test-cards"),
  testIntroContent: document.getElementById("test-intro-content"),
  quizTitle: document.getElementById("quiz-title"),
  quizTopics: document.getElementById("quiz-topics"),
  quizForm: document.getElementById("quiz-form"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  timerWrap: document.getElementById("timer-wrap"),
  timerDisplay: document.getElementById("timer-display"),
  btnSubmit: document.getElementById("btn-submit"),
  submitHint: document.getElementById("submit-hint"),
  btnBack: document.getElementById("btn-back"),
  btnIntroBack: document.getElementById("btn-intro-back"),
  btnStartTest: document.getElementById("btn-start-test"),
  btnRetry: document.getElementById("btn-retry"),
  btnHome: document.getElementById("btn-home"),
  scoreSummary: document.getElementById("score-summary"),
  reviewContainer: document.getElementById("review-container"),
};

let mode = "phase"; // "phase" | "test"
let currentMeta = null;
let currentQuestions = [];
let pendingTest = null;
let timerInterval = null;
let timeRemainingSec = TEST_DURATION_SEC;
let progress = loadProgress();

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function showView(name) {
  Object.values(views).forEach((v) => v.classList.remove("active"));
  views[name].classList.add("active");
  window.scrollTo(0, 0);
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function difficultyBadge(diff) {
  const cls = `diff-badge diff-${diff}`;
  return `<span class="${cls}">${escapeHtml(diff)}</span>`;
}

function toughnessClass(level) {
  if (level === "easy-medium-hard") return "tough-mixed";
  if (level === "medium-hard") return "tough-intermediate";
  return "tough-advanced";
}

function renderHome() {
  els.testCards.innerHTML = COMPREHENSIVE_TESTS.map((test) => {
    const done = progress[test.id]?.submitted;
    const score = progress[test.id]?.score;
    const total = progress[test.id]?.total;
    const extra =
      done && score != null
        ? ` · Last: ${score}/${total} (${Math.round((score / total) * 100)}%)`
        : "";
    const mix =
      test.difficultyMix.easy > 0
        ? `Easy ${test.difficultyMix.easy} · Med ${test.difficultyMix.medium} · Hard ${test.difficultyMix.hard}`
        : `Med ${test.difficultyMix.medium} · Hard ${test.difficultyMix.hard}`;
    return `
      <button type="button" class="test-card ${toughnessClass(test.toughnessLevel)}" data-test="${test.id}">
        <span class="test-toughness">${escapeHtml(test.toughness)}</span>
        <h3>${escapeHtml(test.title)}</h3>
        <p class="test-meta">60 MCQs · 1 hour · ${escapeHtml(mix)}</p>
        <p class="test-topics">${escapeHtml(test.topics)}</p>
        ${done ? `<span class="test-last-score">Completed${escapeHtml(extra)}</span>` : `<span class="test-cta">View details & start →</span>`}
      </button>`;
  }).join("");

  els.testCards.querySelectorAll(".test-card").forEach((btn) => {
    btn.addEventListener("click", () => showTestIntro(btn.dataset.test));
  });

  els.phaseGroups.innerHTML = PHASE_GROUPS.map((group) => {
    const cards = group.phases
      .map((phase) => {
        const done = progress[phase.id]?.submitted;
        const score = progress[phase.id]?.score;
        const total = progress[phase.id]?.total;
        const extra =
          done && score != null
            ? ` · Last: ${score}/${total} (${Math.round((score / total) * 100)}%)`
            : "";
        return `
          <button type="button" class="phase-card${done ? " done" : ""}" data-phase="${phase.id}">
            <h3>${escapeHtml(phase.title)}</h3>
            <p>${escapeHtml(phase.topics)}</p>
            <span class="count">42 MCQs${escapeHtml(extra)}</span>
          </button>`;
      })
      .join("");
    return `
      <section class="phase-group">
        <h3 class="phase-group-title">${escapeHtml(group.title)}</h3>
        <div class="phase-grid">${cards}</div>
      </section>`;
  }).join("");

  els.phaseGroups.querySelectorAll(".phase-card").forEach((btn) => {
    btn.addEventListener("click", () => startPhase(btn.dataset.phase));
  });
}

function showTestIntro(testId) {
  const test = getTestById(testId);
  if (!test) return;
  pendingTest = test;

  const mix = test.difficultyMix;
  const mixHtml =
    mix.easy > 0
      ? `<li><strong>Easy:</strong> ${mix.easy} questions</li>
         <li><strong>Medium:</strong> ${mix.medium} questions</li>
         <li><strong>Hard:</strong> ${mix.hard} questions</li>`
      : `<li><strong>Medium:</strong> ${mix.medium} questions</li>
         <li><strong>Hard:</strong> ${mix.hard} questions</li>
         <li><em>No easy questions in this test.</em></li>`;

  els.testIntroContent.innerHTML = `
    <div class="intro-toughness ${toughnessClass(test.toughnessLevel)}">
      <span class="intro-label">Test toughness</span>
      <h2>${escapeHtml(test.toughness)}</h2>
    </div>
    <p class="intro-detail">${escapeHtml(test.toughnessDetail)}</p>
    <div class="intro-grid">
      <div class="intro-box">
        <h4>Format</h4>
        <ul>
          <li><strong>${test.questionCount}</strong> multiple-choice questions</li>
          <li><strong>${test.durationMinutes} minutes</strong> time limit (auto-submit when time ends)</li>
          <li>Answers revealed only after submit</li>
        </ul>
      </div>
      <div class="intro-box">
        <h4>Difficulty mix</h4>
        <ul>${mixHtml}</ul>
      </div>
      <div class="intro-box intro-box-wide">
        <h4>Subject areas (10 questions each)</h4>
        <div class="subject-tags">
          <span>Core Java</span><span>DBMS</span><span>Java Backend</span>
          <span>Docker & DevOps</span><span>Angular / Frontend</span><span>Software Development</span>
        </div>
        <p class="intro-topics">${escapeHtml(test.topics)}</p>
      </div>
    </div>
    <p class="intro-warning">Once you start, the 1-hour timer runs continuously until you submit or time expires.</p>
  `;

  showView("testIntro");
}

async function loadData(file) {
  const res = await fetch(`data/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  const data = await res.json();
  return data.questions;
}

async function startPhase(phaseId) {
  const meta = getPhaseById(phaseId);
  if (!meta) return;
  mode = "phase";
  currentMeta = meta;
  stopTimer();
  try {
    currentQuestions = await loadData(meta.file);
  } catch (e) {
    alert("Could not load questions. Serve this folder with a local server (see README).");
    console.error(e);
    return;
  }
  setupQuizUI();
  showView("quiz");
}

async function startTest() {
  if (!pendingTest) return;
  mode = "test";
  currentMeta = pendingTest;
  try {
    currentQuestions = await loadData(pendingTest.file);
  } catch (e) {
    alert("Could not load test. Serve this folder with a local server (see README).");
    console.error(e);
    return;
  }
  setupQuizUI();
  startTimer(TEST_DURATION_SEC);
  showView("quiz");
}

function setupQuizUI() {
  els.quizTitle.textContent = currentMeta.title;
  els.quizTopics.textContent =
    mode === "test"
      ? `${currentMeta.topics} · ${currentMeta.toughness}`
      : currentMeta.topics;

  els.btnSubmit.textContent = mode === "test" ? "Submit Test" : "Submit Phase";
  els.submitHint.textContent =
    mode === "test"
      ? "Answer all 60 questions. Timer auto-submits at 0:00."
      : "All questions must be answered before submit.";

  els.timerWrap.classList.toggle("hidden", mode !== "test");
  els.btnBack.textContent = mode === "test" ? "← Exit Test" : "← All Phases";

  renderQuiz();
}

function renderQuiz() {
  els.quizForm.innerHTML = currentQuestions
    .map((q, i) => {
      const code = q.code
        ? `<pre class="code-block">${escapeHtml(q.code)}</pre>`
        : "";
      const diffBadge = q.difficulty ? difficultyBadge(q.difficulty) : "";
      const opts = q.options
        .map(
          (opt, oi) => `
        <label class="option-label">
          <input type="radio" name="q-${i}" value="${oi}" required />
          <span>${escapeHtml(opt)}</span>
        </label>`
        )
        .join("");
      return `
      <article class="question-card" data-index="${i}">
        <div class="question-header">
          <span class="q-num">Q${i + 1}</span>
          <span class="q-badge">${escapeHtml(q.type || "theory")}</span>
          ${diffBadge}
          <span class="q-topic">${escapeHtml(q.topic || "")}</span>
        </div>
        <p class="question-text">${escapeHtml(q.question)}</p>
        ${code}
        <div class="options">${opts}</div>
      </article>`;
    })
    .join("");

  els.quizForm.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", updateProgress);
  });

  els.btnSubmit.disabled = true;
  updateProgress();
}

function updateProgress() {
  const total = currentQuestions.length;
  let answered = 0;
  for (let i = 0; i < total; i++) {
    if (els.quizForm.querySelector(`input[name="q-${i}"]:checked`)) answered++;
  }
  els.progressText.textContent = `${answered} / ${total} answered`;
  els.progressFill.style.width = total ? `${(answered / total) * 100}%` : "0%";
  els.btnSubmit.disabled = answered < total;
}

function getAnswers() {
  return currentQuestions.map((_, i) => {
    const checked = els.quizForm.querySelector(`input[name="q-${i}"]:checked`);
    return checked ? parseInt(checked.value, 10) : -1;
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer(seconds) {
  stopTimer();
  timeRemainingSec = seconds;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemainingSec -= 1;
    updateTimerDisplay();
    if (timeRemainingSec <= 300) {
      els.timerDisplay.classList.add("timer-warning");
    }
    if (timeRemainingSec <= 0) {
      stopTimer();
      autoSubmitExpired();
    }
  }, 1000);
}

function updateTimerDisplay() {
  els.timerDisplay.textContent = formatTime(Math.max(0, timeRemainingSec));
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  els.timerDisplay.classList.remove("timer-warning", "timer-critical");
}

function autoSubmitExpired() {
  alert("Time is up! Your test will be submitted automatically.");
  submitQuiz(true);
}

function submitQuiz(fromTimer = false) {
  const answers = getAnswers();
  const unanswered = answers.filter((a) => a < 0).length;

  if (!fromTimer && unanswered > 0) {
    alert(`Please answer all questions. ${unanswered} remaining.`);
    return;
  }

  stopTimer();

  let score = 0;
  currentQuestions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  const timeUsedSec = TEST_DURATION_SEC - timeRemainingSec;

  progress[currentMeta.id] = {
    submitted: true,
    score,
    total: currentQuestions.length,
    at: Date.now(),
    mode,
    ...(mode === "test" && {
      timeUsedSec,
      timedOut: fromTimer && unanswered > 0,
    }),
  };
  saveProgress();
  renderResults(answers, score, fromTimer);
  showView("results");
}

function renderResults(answers, score, timedOut = false) {
  const total = currentQuestions.length;
  const pct = Math.round((score / total) * 100);
  const timeNote =
    mode === "test"
      ? `<p class="score-time">Time used: ${formatTime(TEST_DURATION_SEC - timeRemainingSec)}${timedOut ? " (auto-submitted)" : ""}</p>`
      : "";

  const breakdown =
    mode === "test" ? buildDifficultyBreakdown(answers) : "";

  els.scoreSummary.innerHTML = `
    <h2>${escapeHtml(currentMeta.title)}</h2>
    <p class="score-big">${score} / ${total}</p>
    <p class="score-pct">${pct}% correct</p>
    ${timeNote}
    ${breakdown}
  `;

  els.reviewContainer.innerHTML = currentQuestions
    .map((q, i) => {
      const selected = answers[i];
      const correct = q.answer;
      const isOk = selected === correct;
      const letters = ["A", "B", "C", "D"];
      const unanswered = selected < 0;

      const rows = q.options
        .map((opt, oi) => {
          let cls = "option-row";
          const markers = [];
          if (oi === selected && !unanswered) {
            cls += isOk ? " selected-correct" : " selected-wrong";
            markers.push("Your answer");
          }
          if (oi === correct) {
            if (oi !== selected || unanswered) cls += " correct-answer";
            markers.push("Correct");
          }
          const marker = markers.length ? ` (${markers.join(", ")})` : "";
          return `<div class="${cls}"><span class="marker">${letters[oi]}.</span>${escapeHtml(opt)}${escapeHtml(marker)}</div>`;
        })
        .join("");

      const code = q.code
        ? `<pre class="code-block">${escapeHtml(q.code)}</pre>`
        : "";

      const diffBadge = q.difficulty ? difficultyBadge(q.difficulty) : "";

      return `
      <article class="review-card ${unanswered ? "wrong" : isOk ? "correct" : "wrong"}">
        <div class="review-status ${isOk && !unanswered ? "ok" : "bad"}">
          Q${i + 1} — ${unanswered ? "Unanswered" : isOk ? "Correct" : "Incorrect"}
          · ${escapeHtml(q.topic || "")} ${diffBadge}
        </div>
        <p class="question-text">${escapeHtml(q.question)}</p>
        ${code}
        <div class="review-options">${rows}</div>
        <div class="explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>
      </article>`;
    })
    .join("");
}

function buildDifficultyBreakdown(answers) {
  const stats = { easy: { c: 0, t: 0 }, medium: { c: 0, t: 0 }, hard: { c: 0, t: 0 } };
  currentQuestions.forEach((q, i) => {
    const d = q.difficulty;
    if (!stats[d]) return;
    stats[d].t++;
    if (answers[i] === q.answer) stats[d].c++;
  });
  const rows = ["easy", "medium", "hard"]
    .filter((d) => stats[d].t > 0)
    .map(
      (d) =>
        `<span class="breakdown-item">${d}: ${stats[d].c}/${stats[d].t}</span>`
    )
    .join("");
  return rows ? `<div class="score-breakdown">${rows}</div>` : "";
}

function confirmExitQuiz() {
  if (mode === "test" && timerInterval) {
    return confirm(
      "Exit test? Your progress will be lost and the timer will stop."
    );
  }
  return true;
}

els.btnSubmit.addEventListener("click", () => submitQuiz(false));
els.btnBack.addEventListener("click", () => {
  if (!confirmExitQuiz()) return;
  stopTimer();
  showView("home");
  renderHome();
});
els.btnIntroBack.addEventListener("click", () => {
  pendingTest = null;
  showView("home");
});
els.btnStartTest.addEventListener("click", startTest);
els.btnHome.addEventListener("click", () => {
  stopTimer();
  showView("home");
  renderHome();
});
els.btnRetry.addEventListener("click", () => {
  if (mode === "test" && currentMeta) {
    showTestIntro(currentMeta.id);
  } else if (currentMeta) {
    startPhase(currentMeta.id);
  }
});

renderHome();
