/* ============================================
   Table of Contents: Scrollspy + Mobile Toggle
   ============================================ */
(function () {
  "use strict";

  // Mobile toggle
  var toggleBtn = document.querySelector(".toc-toggle");
  var tocNav = document.getElementById("toc-nav");
  if (toggleBtn && tocNav) {
    toggleBtn.addEventListener("click", function () {
      var expanded = tocNav.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", expanded);
    });
  }

  // Scrollspy
  var tocLinks = document.querySelectorAll(".toc-nav a");
  if (!tocLinks.length) return;

  // Build a map of id -> link
  var linkMap = {};
  tocLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      linkMap[href.slice(1)] = link;
    }
  });

  var headingIds = Object.keys(linkMap);
  var currentActive = null;

  function isSidebarMode() {
    return window.matchMedia("(min-width: 901px)").matches;
  }

  function updateActive() {
    if (!isSidebarMode()) return;

    var scrollY = window.scrollY;
    var found = null;
    var atBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50);

    if (atBottom) {
      // At bottom of page: activate the last heading visible in the viewport
      for (var i = headingIds.length - 1; i >= 0; i--) {
        var el = document.getElementById(headingIds[i]);
        if (el && el.getBoundingClientRect().top < window.innerHeight) {
          found = headingIds[i];
          break;
        }
      }
    } else {
      for (var i = headingIds.length - 1; i >= 0; i--) {
        var el = document.getElementById(headingIds[i]);
        if (el && el.offsetTop - 100 <= scrollY) {
          found = headingIds[i];
          break;
        }
      }
    }

    if (found !== currentActive) {
      if (currentActive && linkMap[currentActive]) {
        linkMap[currentActive].classList.remove("active");
      }
      if (found && linkMap[found]) {
        linkMap[found].classList.add("active");
        linkMap[found].scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      currentActive = found;
    }
  }

  // Throttle scroll events
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  updateActive();
})();
