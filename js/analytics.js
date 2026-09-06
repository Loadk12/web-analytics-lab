(function () {
  "use strict";

  const layerName = "webAnalyticsLayer";
  window[layerName] = window[layerName] || [];

  function normalizePage() {
    const last = window.location.pathname.split("/").filter(Boolean).pop();
    return last && last.includes(".") ? last : "index.html";
  }

  function labelFor(element) {
    return (
      element.getAttribute("data-analytics-label") ||
      element.getAttribute("aria-label") ||
      element.textContent.trim().replace(/\s+/g, " ").slice(0, 120)
    );
  }

  function trackAnalyticsEvent(eventName, detail) {
    const payload = Object.assign(
      {
        event: eventName,
        page: normalizePage(),
        path: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
      },
      detail || {}
    );

    window[layerName].push(payload);
    console.info("[analytics]", eventName, payload);

    // Future Yandex Metrica connection point:
    // if (typeof window.ym === "function") {
    //   window.ym(YOUR_COUNTER_ID, "reachGoal", eventName, payload);
    // }
  }

  window.trackAnalyticsEvent = trackAnalyticsEvent;

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("#siteNav");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.matchMedia("(max-width: 760px)").matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Открыть меню");
      }
    });
  }

  function initClicks() {
    document.addEventListener("click", function (event) {
      const explicit = event.target.closest("[data-analytics-event]");

      if (explicit) {
        trackAnalyticsEvent(explicit.getAttribute("data-analytics-event"), {
          element_id: explicit.id || null,
          label: labelFor(explicit),
          href: explicit.getAttribute("href") || null,
          service_id: explicit.getAttribute("data-service-id") || null,
          project_id: explicit.getAttribute("data-project-id") || null,
          cta_id: explicit.getAttribute("data-cta-id") || null
        });
        return;
      }

      const link = event.target.closest("a[href]");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      const absolute = new URL(href, window.location.href);
      const isExternal = absolute.origin !== window.location.origin;
      const isPdf = absolute.pathname.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        trackAnalyticsEvent("download_brief", {
          element_id: link.id || null,
          label: labelFor(link),
          href: href
        });
      } else if (isExternal) {
        trackAnalyticsEvent("external_link", {
          element_id: link.id || null,
          label: labelFor(link),
          href: href,
          destination_host: absolute.host
        });
      }
    });
  }

  function initForms() {
    document.querySelectorAll("form[data-analytics-form]").forEach(function (form) {
      let started = false;

      function markStarted() {
        if (started) {
          return;
        }

        started = true;
        trackAnalyticsEvent("form_start", {
          form_id: form.id || null,
          form_name: form.getAttribute("data-form-name") || null
        });
      }

      form.addEventListener("focusin", markStarted);
      form.addEventListener("input", markStarted);

      form.addEventListener("submit", function () {
        trackAnalyticsEvent("form_submit", {
          form_id: form.id || null,
          form_name: form.getAttribute("data-form-name") || null,
          action: form.getAttribute("action") || null,
          method: form.getAttribute("method") || "get",
          field_count: form.querySelectorAll("input, textarea, select").length
        });
      });
    });
  }

  function initScrollDepth() {
    const fired = {
      scroll_50: false,
      scroll_90: false
    };

    let ticking = false;

    function check() {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;

      if (scrollable <= 0) {
        return;
      }

      const depth = Math.round((window.scrollY / scrollable) * 100);

      if (depth >= 50 && !fired.scroll_50) {
        fired.scroll_50 = true;
        trackAnalyticsEvent("scroll_50", { depth_percent: depth });
      }

      if (depth >= 90 && !fired.scroll_90) {
        fired.scroll_90 = true;
        trackAnalyticsEvent("scroll_90", { depth_percent: depth });
      }
    }

    function requestCheck() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(check);
      }
    }

    window.addEventListener("scroll", requestCheck, { passive: true });
    window.addEventListener("resize", requestCheck);
    check();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initClicks();
    initForms();
    initScrollDepth();
  });
})();
