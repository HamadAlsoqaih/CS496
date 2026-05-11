const DATA = window.COURSE_DATA;
const STORAGE_KEY = "cs496-study-progress-v1";
const THEME_KEY = "cs496-study-theme";

let state = {
  activeModule: DATA.modules[0]?.id,
  activeTopic: null,
  query: "",
  progress: loadProgress(),
  collapsed: false,
};

const els = {
  hero: document.getElementById("hero"),
  moduleTabs: document.getElementById("moduleTabs"),
  topicNav: document.getElementById("topicNav"),
  content: document.getElementById("content"),
  search: document.getElementById("searchInput"),
  overallPercent: document.getElementById("overallPercent"),
  overallBar: document.getElementById("overallBar"),
  overallCount: document.getElementById("overallCount"),
  reset: document.getElementById("resetProgressBtn"),
  collapse: document.getElementById("collapseAllBtn"),
  theme: document.getElementById("themeToggle"),
  modal: document.getElementById("imageModal"),
  modalImage: document.getElementById("modalImage"),
  closeModal: document.getElementById("closeModal"),
};

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); }
function allConcepts() { return DATA.modules.flatMap(m => m.topics.flatMap(t => t.concepts)); }
function moduleById(id) { return DATA.modules.find(m => m.id === id); }
function topicById(id) { return DATA.modules.flatMap(m => m.topics.map(t => ({ ...t, moduleId: m.id }))).find(t => t.id === id); }
function moduleForTopic(topicId) { return DATA.modules.find(m => m.topics.some(t => t.id === topicId)); }
function completedCount(concepts) { return concepts.filter(c => state.progress[c.id]).length; }
function pct(done, total) { return total ? Math.round((done / total) * 100) : 0; }
function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch]));
}
function highlight(str = "") {
  const q = state.query.trim();
  const safe = escapeHTML(str);
  if (!q) return safe;
  const words = q.split(/\s+/).filter(Boolean).slice(0, 5).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return safe;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return safe.replace(re, "<mark>$1</mark>");
}

function cleanTitle(title = "") {
  let s = String(title).trim();
  s = s.replace(/^Page\s+\d+\s*/i, "");
  s = s.replace(/^\d+(?:\.\d+)*\.?\s*/, "");
  s = s.replace(/^_?\d{3}\s*[-–—]?\s*/, "");
  s = s.replace(/\s+/g, " ").trim();
  return s || "Study notes";
}

function cleanStudyText(text = "") {
  let s = String(text);
  s = s.replace(/Source diagram\s*[-–—]\s*Slide\s*\d+\s*:/gi, "Source diagram:");
  s = s.replace(/Source code slide\s*[-–—]\s*Slide\s*\d+\s*:/gi, "Source code:");
  s = s.replace(/Slide image\s*:/gi, "Visual:");
  s = s.replace(/Important diagram\s*:/gi, "Important visual:");
  s = s.replace(/\s*\(_\d{3}[^)]*slide\s*\d+\)\.?/gi, "");
  s = s.replace(/\s*\(slide\s*\d+\)\.?/gi, "");
  const lines = s.split("\n").filter(line => {
    const t = line.trim();
    if (!t) return true;
    if (/^Page\s+\d+$/i.test(t)) return false;
    if (/^CS496\b.*Page\s+\d+$/i.test(t)) return false;
    if (/^CS496 Quantum Computing Inline Diagrams$/i.test(t)) return false;
    if (/^CS496 Blockchain Module\s*-\s*Exam-Ready Inline Diagram Guide$/i.test(t)) return false;
    return true;
  });
  return lines.join("\n").trim();
}

function cleanInline(value = "") {
  return cleanStudyText(value).replace(/\s+/g, " ").trim();
}

function visualWorthShowing(concept) {
  if (!concept.image) return false;
  const hay = `${concept.title}\n${concept.text}\n${(concept.keyPoints || []).join("\n")}`.toLowerCase();
  const visualSignals = [
    "diagram", "visual:", "source code", "code example", "screenshot", "table",
    "formula", "matrix", "circuit", "truth table", "architecture", "workflow",
    "flow", "pipeline", "graph", "chart", "figure", "block structure",
    "network structure", "transaction", "hash", "sha-256", "bloch sphere",
    "gate", "operator", "merkle", "proof-of-work", "proof of work"
  ];
  return visualSignals.some(signal => hay.includes(signal));
}

function countVisuals(module) {
  return module.topics.flatMap(t => t.concepts).filter(visualWorthShowing).length;
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  document.documentElement.dataset.theme = saved;
  els.theme.textContent = saved === "dark" ? "Light mode" : "Dark mode";
}

function renderHero() {
  const activeModule = moduleById(state.activeModule) || DATA.modules[0];
  const activeTopic = state.activeTopic ? activeModule.topics.find(t => t.id === state.activeTopic) : null;

  if (activeTopic) {
    const done = completedCount(activeTopic.concepts);
    const percentage = pct(done, activeTopic.concepts.length);
    els.hero.innerHTML = `
      <h2>${highlight(cleanTitle(activeTopic.title))}</h2>
      <p>${highlight(cleanInline(activeTopic.summary || "Study this topic carefully and mark each concept when finished."))}</p>
      <div class="stat-row">
        <span class="stat-pill">${escapeHTML(activeModule.title)}</span>
        <span class="stat-pill">${activeTopic.concepts.length} concepts</span>
        <span class="stat-pill">${percentage}% complete</span>
      </div>`;
    return;
  }

  const topics = activeModule.topics.length;
  const concepts = activeModule.topics.flatMap(t => t.concepts).length;
  const visuals = countVisuals(activeModule);
  els.hero.innerHTML = `
    <h2>${escapeHTML(activeModule.title)}</h2>
    <p>${escapeHTML(activeModule.description)} Choose one topic below. The top navigation only switches modules; topic cards open the actual topic page.</p>
    <div class="stat-row">
      <span class="stat-pill">${topics} topics</span>
      <span class="stat-pill">${concepts} study concepts</span>
      <span class="stat-pill">${visuals} useful visuals</span>
      <span class="stat-pill">saved progress</span>
    </div>`;
}

function renderNav() {
  els.topicNav.innerHTML = DATA.modules.map(m => {
    const concepts = m.topics.flatMap(t => t.concepts);
    const done = completedCount(concepts);
    const percentage = pct(done, concepts.length);
    return `<button class="module-nav-btn ${m.id === state.activeModule ? "active" : ""}" data-module="${m.id}" type="button">
      <strong>${escapeHTML(m.title)}</strong>
      <span>${percentage}%</span>
    </button>`;
  }).join("");

  els.topicNav.querySelectorAll(".module-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeModule = btn.dataset.module;
      state.activeTopic = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderProgress() {
  const concepts = allConcepts();
  const done = completedCount(concepts);
  const percentage = pct(done, concepts.length);
  els.overallPercent.textContent = `${percentage}%`;
  els.overallBar.style.width = `${percentage}%`;
  els.overallCount.textContent = `${done} / ${concepts.length} concepts completed`;
}

function topicMatches(t) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    t.title,
    t.summary,
    ...(t.subheadings || []),
    ...(t.keyPoints || []),
    ...t.concepts.map(c => `${c.title}\n${c.text}`)
  ].join("\n").toLowerCase();
  return q.split(/\s+/).every(token => hay.includes(token));
}

function renderTopicDirectory() {
  const activeModule = moduleById(state.activeModule) || DATA.modules[0];

  if (state.activeTopic) {
    els.moduleTabs.className = "topic-toolbar";
    els.moduleTabs.innerHTML = `
      <button class="back-btn" id="backToTopics" type="button">← Back to topics</button>
      <span class="topic-meta">Use the top navigation to switch modules.</span>`;
    document.getElementById("backToTopics").addEventListener("click", () => {
      state.activeTopic = null;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return;
  }

  const topics = activeModule.topics.filter(topicMatches);
  els.moduleTabs.className = "topic-directory";

  if (!topics.length) {
    els.moduleTabs.innerHTML = `<div class="no-results"><h3>No matching topics found</h3><p>Try a different keyword, formula name, diagram name, framework, or algorithm.</p></div>`;
    return;
  }

  els.moduleTabs.innerHTML = topics.map(t => {
    const done = completedCount(t.concepts);
    const percentage = pct(done, t.concepts.length);
    const visuals = t.concepts.filter(visualWorthShowing).length;
    return `<button class="topic-card-link" data-topic="${t.id}" type="button">
      <h3>${highlight(cleanTitle(t.title))}</h3>
      <p>${highlight(cleanInline(t.summary || "Open this topic to study its concepts."))}</p>
      <div class="progress-bar"><span style="width:${percentage}%"></span></div>
      <div class="topic-card-footer">
        <span>${t.concepts.length} concepts • ${visuals} visuals • ${percentage}% complete</span>
        <span class="open-topic-btn">Open</span>
      </div>
    </button>`;
  }).join("");

  els.moduleTabs.querySelectorAll(".topic-card-link").forEach(card => {
    card.addEventListener("click", () => {
      state.activeTopic = card.dataset.topic;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderTopic(t, module) {
  const tDone = completedCount(t.concepts);
  const tPct = pct(tDone, t.concepts.length);
  const subheadings = t.subheadings?.length
    ? `<div class="subheading-box"><h4>Inside this topic</h4><div class="chip-list">${t.subheadings.map(s => `<span class="chip">${highlight(cleanInline(s))}</span>`).join("")}</div></div>`
    : "";
  const keypoints = t.keyPoints?.length
    ? `<div class="keypoint-box"><h4>Key points to memorize</h4><ul>${t.keyPoints.map(k => `<li>${highlight(cleanInline(k))}</li>`).join("")}</ul></div>`
    : "";
  const quiz = t.reviewQuestions?.length
    ? `<div class="quiz-box"><h4>Review questions</h4><ol>${t.reviewQuestions.map(q => `<li>${highlight(cleanInline(q))}</li>`).join("")}</ol></div>`
    : "";

  const concepts = t.concepts.map(c => {
    const checked = state.progress[c.id] ? "checked" : "";
    const hasVisual = visualWorthShowing(c);
    const cleanConceptTitle = cleanTitle(c.title);
    const key = c.keyPoints?.length
      ? `<div class="inline-keypoints"><strong>Important</strong><ul>${c.keyPoints.map(k => `<li>${highlight(cleanInline(k))}</li>`).join("")}</ul></div>`
      : "";
    const visual = hasVisual
      ? `<figure class="visual-card">
          <img loading="lazy" src="${c.image}" alt="Course visual for ${escapeHTML(cleanConceptTitle)}" data-full-image="${c.image}" />
          <small>Diagram, table, formula, code, or visual note from the course. Click to zoom.</small>
        </figure>`
      : "";
    return `<article class="concept-card" id="${c.id}">
      <div class="concept-head">
        <h3>${highlight(cleanConceptTitle)}</h3>
        <div class="concept-actions">
          <label class="check-label"><input type="checkbox" data-concept="${c.id}" ${checked}/> Mark completed</label>
        </div>
      </div>
      <div class="concept-body ${hasVisual ? "with-visual" : ""}">
        <div class="study-text">${highlight(cleanStudyText(c.text))}${key}</div>
        ${visual}
      </div>
    </article>`;
  }).join("");

  return `<section class="topic-card" id="${t.id}" style="--primary:${module.accent}">
    <div class="topic-card-header">
      <div class="topic-title-row">
        <div>
          <div class="topic-meta">${escapeHTML(module.title)} • ${t.concepts.length} concepts</div>
          <h2>${highlight(cleanTitle(t.title))}</h2>
        </div>
        <div class="topic-progress-box">
          <div class="progress-head"><span>Topic progress</span><strong>${tPct}%</strong></div>
          <div class="progress-bar"><span style="width:${tPct}%"></span></div>
          <div class="topic-meta">${tDone} / ${t.concepts.length} completed</div>
        </div>
      </div>
      <p class="topic-summary">${highlight(cleanInline(t.summary || "Full extracted study notes are included below."))}</p>
      ${subheadings}
      ${keypoints}
      ${quiz}
    </div>
    <div class="concepts" ${state.collapsed ? "hidden" : ""}>${concepts}</div>
  </section>`;
}

function renderContent() {
  const activeModule = moduleById(state.activeModule) || DATA.modules[0];
  if (!state.activeTopic) {
    els.content.innerHTML = "";
    return;
  }

  const topic = activeModule.topics.find(t => t.id === state.activeTopic);
  if (!topic) {
    state.activeTopic = null;
    render();
    return;
  }

  els.content.innerHTML = renderTopic(topic, activeModule);

  els.content.querySelectorAll("input[type='checkbox'][data-concept]").forEach(cb => {
    cb.addEventListener("change", () => {
      state.progress[cb.dataset.concept] = cb.checked;
      if (!cb.checked) delete state.progress[cb.dataset.concept];
      saveProgress();
      renderProgress();
      renderNav();
      renderHero();
      renderTopicDirectory();
      renderContent();
    });
  });

  els.content.querySelectorAll("img[data-full-image]").forEach(img => {
    img.addEventListener("click", () => {
      els.modalImage.src = img.dataset.fullImage;
      els.modal.classList.add("show");
      els.modal.setAttribute("aria-hidden", "false");
    });
  });
}

function render() {
  renderProgress();
  renderNav();
  renderHero();
  renderTopicDirectory();
  renderContent();
}

els.search.addEventListener("input", e => {
  state.query = e.target.value;
  state.activeTopic = null;
  renderHero();
  renderTopicDirectory();
  renderContent();
});

els.reset.addEventListener("click", () => {
  if (confirm("Reset all saved progress for this course website?")) {
    state.progress = {};
    saveProgress();
    render();
  }
});

els.collapse.addEventListener("click", () => {
  state.collapsed = !state.collapsed;
  els.collapse.textContent = state.collapsed ? "Expand concepts" : "Collapse concepts";
  renderContent();
});

els.theme.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  els.theme.textContent = next === "dark" ? "Light mode" : "Dark mode";
});

els.closeModal.addEventListener("click", () => {
  els.modal.classList.remove("show");
  els.modal.setAttribute("aria-hidden", "true");
  els.modalImage.removeAttribute("src");
});
els.modal.addEventListener("click", e => {
  if (e.target === els.modal) els.closeModal.click();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && els.modal.classList.contains("show")) els.closeModal.click();
});

initTheme();
render();
