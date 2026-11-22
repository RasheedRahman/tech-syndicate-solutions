/* =========================================================
   Tech Syndicate Solutions — interactions
   ========================================================= */

(function () {
  const D = window.TD;

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ownerName = (id) => {
    const m = D.team.find((t) => t.id === id);
    return m ? m.short : id;
  };
  const ownerPhoto = (id) => {
    const m = D.team.find((t) => t.id === id);
    return m ? m.photo : "";
  };

  /* ---------- theme ---------- */
  function initTheme() {
    const btn = $("#themeBtn");
    const root = document.documentElement;
    const saved = localStorage.getItem("td-theme");
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(initial);

    function apply(mode) {
      root.setAttribute("data-theme", mode);
      if (btn) {
        btn.innerHTML =
          mode === "dark"
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"/></svg>';
        btn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
      }
    }

    btn?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("td-theme", next);
      apply(next);
    });
  }

  /* ---------- nav ---------- */
  function initNav() {
    const nav = $("#nav");
    const burger = $("#burger");
    const links = $("#navLinks");

    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    burger?.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });

    $$("a", links).forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        burger?.classList.remove("open");
        burger?.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- marquee ---------- */
  function renderMarquee() {
    const track = $("#marquee");
    if (!track) return;
    const items = [...D.marquee, ...D.marquee];
    track.innerHTML = items.map((t) => `<div class="marquee__item">${esc(t)}</div>`).join("");
  }

  /* ---------- services ---------- */
  function renderServices() {
    const wrap = $("#servicesGrid");
    if (!wrap) return;
    wrap.innerHTML = D.services
      .map(
        (s, i) => `
      <article class="svc rv" style="transition-delay:${(i % 3) * 70}ms">
        <div class="svc__ic">${esc(s.icon)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="svc__tags">${s.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      </article>`
      )
      .join("");
  }

  /* ---------- work ---------- */
  function renderFilters() {
    const wrap = $("#filters");
    if (!wrap) return;
    wrap.innerHTML = D.filters
      .map(
        (f, i) =>
          `<button class="filter${i === 0 ? " active" : ""}" data-filter="${f.id}" type="button">${esc(f.label)}</button>`
      )
      .join("");

      wrap.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        $$(".filter", wrap).forEach((b) => b.classList.toggle("active", b === btn));
        const f = btn.dataset.filter;
        $$(".proj").forEach((card) => {
          card.dataset.filteredOut = f === "all" || card.dataset.category === f ? "" : "1";
          card.hidden = card.dataset.filteredOut === "1";
        });
        const more = $("#workMore");
        if (more) more.dataset.expanded = "0";
        applyWorkLimit();
      });
  }

  function slidesMarkup(p, idx) {
    if (!p.images || !p.images.length) {
      return `<div class="shot shot--empty"><span>${esc(p.name)}</span></div>`;
    }
    return `
      <div class="shot" data-shot tabindex="0" aria-label="${esc(p.name)} screenshots">
        <div class="shot__track">
          ${p.images
            .map(
              (src, i) =>
                `<div class="shot__slide"><img src="${src}" alt="${esc(p.name)} — screenshot ${i + 1}" loading="${
                  idx < 2 && i === 0 ? "eager" : "lazy"
                }" decoding="async" /></div>`
            )
            .join("")}
        </div>
        ${
          p.images.length > 1
            ? `<button class="shot__nav shot__nav--prev" type="button" aria-label="Previous screenshot">‹</button>
               <button class="shot__nav shot__nav--next" type="button" aria-label="Next screenshot">›</button>
               <span class="shot__count">1 / ${p.images.length}</span>
               <div class="shot__dots"></div>`
            : ""
        }
      </div>`;
  }

  function renderProjects() {
    const grid = $("#workGrid");
    if (!grid) return;

    grid.innerHTML = D.projects
      .map(
        (p, i) => `
      <article class="proj rv${p.featured ? " proj--wide" : ""}" data-category="${esc(p.category)}">
        ${slidesMarkup(p, i)}
        <div class="proj__body">
          <div class="proj__top">
            <div>
              <div class="proj__name">${esc(p.name)}</div>
              <div class="proj__sub">${esc(p.subtitle)}</div>
            </div>
            <span class="proj__tag">${esc(p.tag)}</span>
          </div>
          <p class="proj__desc">${esc(p.desc)}</p>
          <div class="proj__stack">${p.stack.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
          <div class="proj__foot">
            <span class="proj__owner">
              <img src="${ownerPhoto(p.owner)}" alt="" loading="lazy" />
              ${esc(ownerName(p.owner))}
            </span>
            ${
              p.link
                ? `<a class="proj__link" href="${p.link}" target="_blank" rel="noopener noreferrer">Visit site <span aria-hidden="true">↗</span></a>`
                : `<span class="proj__link" style="color:var(--muted)">${esc(p.tag === "Personal build" ? "Side project" : "Client work")}</span>`
            }
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  /* mobile work paging: keep the section short */
  const MOBILE_LIMIT = 3;

  function visibleCards() {
    return $$(".proj").filter((c) => !c.dataset.filteredOut);
  }

  function applyWorkLimit() {
    const more = $("#workMore");
    const isMobile = window.matchMedia("(max-width: 880px)").matches;
    const cards = visibleCards();

    if (!isMobile) {
      cards.forEach((c) => c.classList.remove("show"));
      if (more) more.style.display = "none";
      return;
    }

    const expanded = more?.dataset.expanded === "1";
    cards.forEach((c, i) => c.classList.toggle("show", expanded || i < MOBILE_LIMIT));

    if (more) {
      if (cards.length <= MOBILE_LIMIT) {
        more.style.display = "none";
      } else {
        more.style.display = "";
        more.textContent = expanded ? "Show fewer" : `Show all ${cards.length} projects`;
      }
    }
  }

  function initWorkMore() {
    const more = $("#workMore");
    if (!more) return;
    more.addEventListener("click", () => {
      more.dataset.expanded = more.dataset.expanded === "1" ? "0" : "1";
      applyWorkLimit();
      if (more.dataset.expanded === "0") {
        $("#work")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    window.addEventListener("resize", () => {
      if (more.dataset.expanded === "1" && !window.matchMedia("(max-width: 880px)").matches) {
        more.dataset.expanded = "0";
      }
      applyWorkLimit();
    });
    applyWorkLimit();
  }

  function initCarousels() {
    $$("[data-shot]").forEach((shot) => {
      const track = $(".shot__track", shot);
      const slides = $$(".shot__slide", shot);
      const dotsWrap = $(".shot__dots", shot);
      const count = $(".shot__count", shot);
      const n = slides.length;
      if (!track || n < 2) return;

      let idx = 0;
      const dots = slides.map((_, i) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "shot__dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", `Go to screenshot ${i + 1}`);
        d.addEventListener("click", () => go(i));
        dotsWrap?.appendChild(d);
        return d;
      });

      function go(i) {
        idx = (i + n) % n;
        track.style.transform = `translateX(-${idx * 100}%)`;
        dots.forEach((d, j) => d.classList.toggle("active", j === idx));
        if (count) count.textContent = `${idx + 1} / ${n}`;
      }

      $(".shot__nav--prev", shot)?.addEventListener("click", () => go(idx - 1));
      $(".shot__nav--next", shot)?.addEventListener("click", () => go(idx + 1));

      shot.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
      });

      let sx = null;
      shot.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
      shot.addEventListener("touchend", (e) => {
        if (sx === null) return;
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        sx = null;
      }, { passive: true });
    });
  }

  /* ---------- team ---------- */
  function renderTeam() {
    const wrap = $("#teamGrid");
    if (!wrap) return;
    wrap.innerHTML = D.team
      .map(
        (m, i) => `
      <article class="member rv ${i % 2 ? "rv--r" : "rv--l"}">
        <div class="member__head">
          <div class="member__photo"><img src="${m.photo}" alt="${esc(m.name)}" loading="lazy" /></div>
          <div>
            <div class="member__name">${esc(m.name)}</div>
            <div class="member__role">${esc(m.role)}</div>
            <div class="member__loc">${esc(m.location)}</div>
          </div>
        </div>
        <p class="member__bio">${esc(m.bio)}</p>
        <div class="member__stats">
          ${m.stats.map((s) => `<div><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join("")}
        </div>
        <div class="member__skills">${m.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        <div class="member__links">
          ${m.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join("")}
        </div>
      </article>`
      )
      .join("");
  }

  /* ---------- process + faq ---------- */
  function renderProcess() {
    const wrap = $("#steps");
    if (!wrap) return;
    wrap.innerHTML = D.process
      .map(
        (s, i) => `
      <div class="step rv" style="transition-delay:${i * 70}ms">
        <div class="step__n">${esc(s.n)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
      </div>`
      )
      .join("");
  }

  function renderFaq() {
    const wrap = $("#faqList");
    if (!wrap) return;
    wrap.innerHTML = D.faqs
      .map(
        (f, i) => `
      <details${i === 0 ? " open" : ""}>
        <summary>${esc(f.q)}</summary>
        <p>${esc(f.a)}</p>
      </details>`
      )
      .join("");
  }

  /* ---------- contact ---------- */
  function initContact() {
    const form = $("#contactForm");
    if (!form) return;
    const note = $("#formNote");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const email = (fd.get("email") || "").toString().trim();
      const budget = (fd.get("budget") || "").toString();
      const need = (fd.get("need") || "").toString();
      const msg = (fd.get("message") || "").toString().trim();

      const body =
        `Hi Tech Syndicate Solutions, I'm ${name || "…"}.\n` +
        `Project type: ${need}\n` +
        `Budget: ${budget}\n` +
        (msg ? `\n${msg}\n` : "") +
        (email ? `\nReach me at: ${email}` : "");

      window.open(`https://wa.me/919790241289?text=${encodeURIComponent(body)}`, "_blank", "noopener");
      if (note) note.textContent = "Opening WhatsApp — if nothing happened, email rasheedrah6@gmail.com.";
    });
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    const els = $$(".rv");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Failsafe: never leave content invisible if the observer misses
    setTimeout(() => {
      els.forEach((el) => {
        if (!el.classList.contains("in")) {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add("in");
        }
      });
    }, 2500);

    window.addEventListener("load", () => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in");
      });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    if (!D) return;
    initTheme();
    initNav();
    renderMarquee();
    renderServices();
    renderFilters();
    renderProjects();
    renderTeam();
    renderProcess();
    renderFaq();
    initContact();
    initWorkMore();
    initCarousels();
    initReveal();

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
