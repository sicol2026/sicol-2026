// ===============================
// Active menu highlight (precise version)
// ===============================
(function () {
  const navLinks = Array.from(document.querySelectorAll("header nav a[href^='#']"));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  function onScroll() {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    const scrollPosition = window.scrollY + headerHeight + 5;

    let currentSectionId = sections[0].id;

    for (let section of sections) {
      if (section.offsetTop <= scrollPosition) {
        currentSectionId = section.id;
      }
    }

    setActive(currentSectionId);
  }

  window.addEventListener("scroll", onScroll);
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
