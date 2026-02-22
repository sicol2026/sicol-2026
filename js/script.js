// ======================================================
// 1) Sticky header offset handling + nav active highlight
// ======================================================
(() => {
  const header = document.querySelector("header");
  const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
  if (!header || navLinks.length === 0) return;

  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const root = document.documentElement;

  function headerOffset() {
    // 헤더 높이 + 약간의 여유(8px)
    return (header?.offsetHeight || 0) + 8;
  }

  function setHeaderCssVar() {
    root.style.setProperty("--header-offset", `${headerOffset()}px`);
  }

  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  }

  // 헤더 아래 기준선에 "걸린" 섹션을 찾는 방식 (짧은 섹션에도 강함)
  function computeActiveSectionId() {
    const h = headerOffset();
    const threshold = 2; // 헤더 아래 2px 지점 기준
    let best = null;

    for (const s of sections) {
      const rect = s.getBoundingClientRect();
      const t = rect.top - h; // 헤더 아래 기준선으로부터의 거리

      // 기준선 위(<=threshold)에 있는 섹션 중 가장 가까운 것 선택
      if (t <= threshold) {
        if (!best || t > best.t) best = { id: s.id, t };
      }
    }
    return best ? best.id : sections[0].id;
  }

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      setHeaderCssVar();
      setActive(computeActiveSectionId());
    });
  }

  // 브라우저 기본 앵커 점프를 막고, 우리가 직접 "헤더 오프셋" 반영해서 이동
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const y = window.scrollY + target.getBoundingClientRect().top - headerOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // 클릭하면: 즉시 active + 정확한 위치로 스크롤
  navLinks.forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);

      setHeaderCssVar();
      setActive(id);
      history.replaceState(null, "", `#${id}`);
      scrollToSection(id);

      // 스크롤 애니메이션 중/후 보정
      setTimeout(onScroll, 50);
      setTimeout(onScroll, 200);
      setTimeout(onScroll, 500);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { setHeaderCssVar(); onScroll(); });
  window.addEventListener("load", () => {
    setHeaderCssVar();

    // 새로고침 시 해시가 있으면 그 섹션으로(오프셋 반영)
    const id = (location.hash || "").slice(1);
    if (id) {
      setActive(id);
      // load 직후에는 레이아웃이 안정되기 전일 수 있어 딜레이
      setTimeout(() => scrollToSection(id), 0);
    }
    onScroll();
  });
})();

// ======================================================
// 2) AoE Countdown (May 31, 2026 AoE)
//    AoE = UTC-12, so May 31 23:59:59 (UTC-12)
//        = June 1 11:59:59 (UTC)
// ======================================================
(() => {
  const el = document.getElementById("countdown");
  if (!el) return;

  // May 31, 2026 23:59:59 AoE  ==>  2026-06-01 11:59:59Z
  const deadlineUTC = new Date("2026-06-01T11:59:59Z");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = new Date();
    const diff = deadlineUTC.getTime() - now.getTime();

    if (diff <= 0) {
      el.textContent = "The abstract submission deadline has passed.";
      return;
    }

    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    el.textContent = `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s remaining`;
  }

  tick();
  setInterval(tick, 1000);
})();
