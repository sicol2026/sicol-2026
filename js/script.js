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
