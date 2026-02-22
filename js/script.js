// ======================================
// Nav active highlight (click-first + robust scroll detection)
// ======================================
(() => {
  const header = document.querySelector("header");
  const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));

  if (!navLinks.length) return;

  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const getHeaderH = () => (header ? header.offsetHeight : 0);

  function setActive(id) {
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
    });
  }

  // 헤더 바로 아래(기준선)에 가장 가까운 section을 active로
  function computeActive() {
    const h = getHeaderH();
    const threshold = 8; // 헤더 아래 몇 px까지 "붙었다"고 볼지
    let best = null;

    for (const s of sections) {
      const rect = s.getBoundingClientRect();
      const t = rect.top - h; // 헤더 아래 기준선 기준 top

      // 기준선 위(<=threshold)에 있는 섹션 중, 기준선에 가장 가까운(가장 큰 t) 섹션 선택
      if (t <= threshold) {
        if (!best || t > best.t) best = { id: s.id, t };
      }
    }

    // 아직 아무 섹션도 기준선 위로 올라오지 않았다면 첫 섹션
    return best ? best.id : sections[0].id;
  }

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      setActive(computeActive());
    });
  }

  // 1) 클릭하면 즉시 밑줄 (사용자 기대 충족)
  // 2) 앵커 스크롤이 끝난 후 다시 계산해 보정
  navLinks.forEach(a => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href").slice(1);
      setActive(id);
      setTimeout(onScroll, 50);
      setTimeout(onScroll, 200);
      setTimeout(onScroll, 500);
    });
  });

  // 해시가 바뀌는 경우(뒤로가기 등)도 반영
  window.addEventListener("hashchange", () => {
    const id = (location.hash || "#").slice(1);
    if (id) setActive(id);
    setTimeout(onScroll, 50);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", () => {
    // 초기 상태: 해시가 있으면 그걸, 없으면 스크롤 기반으로
    const id = (location.hash || "").slice(1);
    if (id) setActive(id);
    onScroll();
  });
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
