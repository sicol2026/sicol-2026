// ===============================
// Active menu highlight (robust: works with sticky header + scroll-margin)
// ===============================
(function () {
  const header = document.querySelector("header");
  const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) return;

  function headerHeight() {
    return header ? header.offsetHeight : 0;
  }

  function setActiveById(id) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  function computeActiveSection() {
    const y = window.scrollY + 1; // current scroll
    const h = headerHeight();

    let currentId = sections[0].id;

    for (const s of sections) {
      // 핵심: 섹션의 "유효 시작점"을 (섹션 top - header 높이)로 잡는다
      if (y >= (s.offsetTop - h - 2)) {
        currentId = s.id;
      }
    }
    return currentId;
  }

  function onScroll() {
    setActiveById(computeActiveSection());
  }

  // 클릭 시 즉시 밑줄 → 스크롤 후에도 정정
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("href").slice(1);
      setActiveById(target);

      // 앵커 스크롤이 끝난 뒤 상태 재계산 (브라우저마다 타이밍 차이 보정)
      setTimeout(onScroll, 50);
      setTimeout(onScroll, 200);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
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
