/* ============================================
   Spoiler Toggle System
   ============================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "dcc-spoiler-state";

  // Book state: { "1": false, "2": false, ... }
  let bookState = {};

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        bookState = JSON.parse(saved);
      }
    } catch (e) {
      // localStorage unavailable or corrupted — start fresh
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookState));
    } catch (e) {
      // Ignore storage errors
    }
  }

  function initializeState() {
    // Find all unique book numbers from spoiler elements
    document.querySelectorAll(".spoiler[data-level]").forEach(function (el) {
      var books = el.getAttribute("data-level").split(",");
      books.forEach(function (b) {
        b = b.trim();
        if (b && !(b in bookState)) {
          bookState[b] = false;
        }
      });
    });
  }

  function updateSpoilers() {
    document.querySelectorAll(".spoiler[data-level]").forEach(function (el) {
      var books = el.getAttribute("data-level").split(",");
      // Reveal if ANY referenced book is toggled on
      var shouldReveal = books.some(function (b) {
        return bookState[b.trim()];
      });
      el.classList.toggle("revealed", shouldReveal);
      // Screen readers: hide spoiler text when concealed, show when revealed
      el.setAttribute("aria-hidden", !shouldReveal);
    });
  }

  function updateControlButtons() {
    document.querySelectorAll(".spoiler-toggle-btn[data-level]").forEach(function (btn) {
      var book = btn.getAttribute("data-level");
      btn.classList.toggle("active", !!bookState[book]);
      btn.setAttribute("aria-pressed", !!bookState[book]);
    });
  }

  function toggleBook(bookNum) {
    bookState[bookNum] = !bookState[bookNum];
    saveState();
    updateSpoilers();
    updateControlButtons();
  }

  function revealAll() {
    Object.keys(bookState).forEach(function (k) {
      bookState[k] = true;
    });
    saveState();
    updateSpoilers();
    updateControlButtons();
  }

  function hideAll() {
    Object.keys(bookState).forEach(function (k) {
      bookState[k] = false;
    });
    saveState();
    updateSpoilers();
    updateControlButtons();
  }

  function init() {
    loadState();
    initializeState();

    // Control panel buttons
    document.querySelectorAll(".spoiler-toggle-btn[data-level]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleBook(btn.getAttribute("data-level"));
      });
    });

    // Master toggle-all button
    var toggleAllBtn = document.getElementById("spoiler-toggle-all");
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", function () {
        var anyRevealed = Object.keys(bookState).some(function (k) { return bookState[k]; });
        if (anyRevealed) {
          hideAll();
        } else {
          revealAll();
        }
      });
    }

    // Inline spoiler clicks — toggle all spoilers for that book
    document.querySelectorAll(".spoiler[data-level]").forEach(function (el) {
      el.addEventListener("click", function () {
        var books = el.getAttribute("data-level").split(",");
        // Toggle the first book referenced
        toggleBook(books[0].trim());
      });
      // Keyboard support for spoiler spans (Enter or Space)
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var books = el.getAttribute("data-level").split(",");
          toggleBook(books[0].trim());
        }
      });
    });

    // Spoiler hover tooltip
    setupTooltip();

    // Apply saved state
    updateSpoilers();
    updateControlButtons();
  }

  function setupTooltip() {
    var tip = document.createElement("div");
    tip.className = "spoiler-tooltip";
    tip.style.cssText = "position:fixed;pointer-events:none;opacity:0;transition:opacity 0.12s ease;" +
      "background:#333;color:#fff;font-size:0.75rem;padding:3px 8px;border-radius:4px;" +
      "white-space:nowrap;z-index:9999;";
    document.body.appendChild(tip);

    document.querySelectorAll(".spoiler[data-level]").forEach(function (el) {
      // Move title to data attr so native tooltip doesn't show
      var titleVal = el.getAttribute("title");
      if (titleVal) {
        el.setAttribute("data-level-label", titleVal);
        el.removeAttribute("title");
      }

      el.addEventListener("mouseenter", function () {
        if (el.classList.contains("revealed")) return;
        var label = el.getAttribute("data-level-label");
        if (!label) return;
        tip.textContent = label;
        tip.style.opacity = "1";
      });

      el.addEventListener("mousemove", function (e) {
        if (el.classList.contains("revealed")) return;
        // Use getClientRects to get per-line-fragment rects for inline elements
        var rects = el.getClientRects();
        var targetRect = null;
        for (var i = 0; i < rects.length; i++) {
          var r = rects[i];
          if (e.clientY >= r.top && e.clientY <= r.bottom) {
            targetRect = r;
            break;
          }
        }
        if (!targetRect && rects.length > 0) {
          targetRect = rects[0];
        }
        if (targetRect) {
          tip.style.left = targetRect.left + "px";
          tip.style.top = (targetRect.top - tip.offsetHeight - 4) + "px";
        }
      });

      el.addEventListener("mouseleave", function () {
        tip.style.opacity = "0";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
