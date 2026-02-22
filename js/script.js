// ========== Active nav highlight ==========
(function () {
  const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) return;

  function setActiveById(id) {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  }

  // IntersectionObserver로 현재 섹션 추적
  const io = new IntersectionObserver((entries) => {
    // 화면에 들어온 섹션들 중 가장 많이 보이는 것 선택
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) setActiveById(visible.target.id);
  }, {
    root: null,
    // sticky header가 있다면 위쪽 여백을 좀 크게 잡아야 정확합니다
    rootMargin: "-25% 0px -65% 0px",
    threshold: [0.15, 0.25, 0.35, 0.5, 0.65]
  });

  sections.forEach(s => io.observe(s));

  // 초기값
  setActiveById(sections[0].id);
})();

// ========== Deadline countdown ==========
(function () {
  const el = document.getElementById("countdown");
  if (!el) return;

  // 마감: May 31, 2026 23:59:59 (AoE)
  const deadline = new Date("2026-06-01T11:59:59Z");

  function pad(n) { return String(n).padStart(2, "0"); }

  function render() {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (Number.isNaN(deadline.getTime())) {
      el.textContent = "Invalid deadline date.";
      return;
    }

    if (diff <= 0) {
      el.textContent = "The abstract submission deadline has passed.";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    el.textContent = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s remaining`;
  }

  render();
  setInterval(render, 1000);
})();
