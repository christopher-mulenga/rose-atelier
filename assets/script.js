/* Rosé Atelier — global interactivity */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .underline-draw");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Staggered groups (service cards, portfolio) ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var items = group.children;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("reveal");
      items[i].style.transitionDelay = i * 0.09 + "s";
    }
  });
  // re-observe items added via stagger after the fact
  if ("IntersectionObserver" in window) {
    var staggerItems = document.querySelectorAll("[data-stagger] > *");
    if (staggerItems.length) {
      var io2 = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io2.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      staggerItems.forEach(function (el) {
        io2.observe(el);
      });
    }
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("bookingForm");
  if (form) {
    var statusEl = document.getElementById("formStatus");

    function setError(field, message) {
      var wrap = field.closest(".field");
      var errorEl = wrap.querySelector(".field-error");
      if (message) {
        wrap.classList.add("error");
        if (errorEl) errorEl.textContent = message;
      } else {
        wrap.classList.remove("error");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateField(field) {
      var value = field.value.trim();
      if (field.hasAttribute("required") && !value) {
        setError(field, "Please complete this field.");
        return false;
      }
      if (field.type === "email" && value) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value)) {
          setError(field, "Please enter a valid email address.");
          return false;
        }
      }
      setError(field, "");
      return true;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll("input, select, textarea");
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "Please check the fields marked below.";
          statusEl.classList.remove("success");
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent = "Thank you — your request has been received. We will confirm your appointment by email shortly.";
        statusEl.classList.add("success");
      }
      form.reset();
    });
  }
})();
