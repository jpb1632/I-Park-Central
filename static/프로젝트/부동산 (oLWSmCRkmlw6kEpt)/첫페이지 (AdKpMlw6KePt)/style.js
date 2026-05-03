(function() {
  $(function() {
    $(".properties-N1[id=\'gmmlW6kdpj\']").each(function() {
      const $block = $(this);
      let isMobileMenuInitialized = false;
      let isDesktopMenuInitialized = false;
      const BASE_HEADER_TOP = -4;
      const DESKTOP_SECTION_SHIFT = -26;
      const MOBILE_SECTION_SHIFT = -26;
      const COMPLEX_MAIN_HREF = "./menu-page.html?group=complex&tab=siteplan";
      const COMPLEX_MENU_ITEMS = [
        { tab: "siteplan", label: "단지배치도" },
        { tab: "unitplan", label: "동호수배치도" },
        { tab: "community", label: "커뮤니티" },
        { tab: "myhills", label: "마이힐스" },
        { tab: "hsystem", label: "H-시스템" },
      ];

      function buildComplexSubMenuHtml(itemClass, linkClass) {
        return COMPLEX_MENU_ITEMS.map(function(item) {
          const href = `./menu-page.html?group=complex&tab=${item.tab}`;
          return `<li class="${itemClass}"><a class="${linkClass}" href="${href}"><span>${item.label}</span></a></li>`;
        }).join("");
      }

      function normalizeComplexSubMenus() {
        $block
          .find('.header-gnblink[href*="group=complex"], .fullmenu-gnblink[href*="group=complex"]')
          .attr("href", COMPLEX_MAIN_HREF);

        $block.find(".header-gnbitem").each(function() {
          const $item = $(this);
          const href = $item.find("> .header-gnblink").attr("href") || "";
          if (!href.includes("group=complex")) return;
          $item
            .find("> .header-sublist")
            .html(buildComplexSubMenuHtml("header-subitem", "p2 header-sublink"));
        });

        $block.find(".fullmenu-gnbitem").each(function() {
          const $item = $(this);
          const href = $item.find("> .fullmenu-gnblink").attr("href") || "";
          if (!href.includes("group=complex")) return;
          $item
            .find("> .fullmenu-sublist")
            .html(buildComplexSubMenuHtml("fullmenu-subitem", "p1 fullmenu-sublink"));
        });
      }

      function getBaseSectionShift() {
        return window.innerWidth <= 992 ? MOBILE_SECTION_SHIFT : DESKTOP_SECTION_SHIFT;
      }

      function forceTopGapFix() {
        const html = document.documentElement;
        const body = document.body;
        if (html) {
          html.style.setProperty("margin-top", "0px", "important");
          html.style.setProperty("padding-top", "0px", "important");
        }
        if (body) {
          body.style.setProperty("margin-top", "0px", "important");
          body.style.setProperty("padding-top", "0px", "important");
        }
        $block[0].style.setProperty("top", BASE_HEADER_TOP + "px", "important");
        const firstSection = document.querySelector(".properties-N4");
        if (firstSection) {
          firstSection.style.setProperty("margin-top", getBaseSectionShift() + "px", "important");
        }
      }
      // 모바일 메뉴 초기화
      function initMobileMenu() {
        if (isMobileMenuInitialized) return;
        const $btnMomenu = $block.find(".btn-momenu");
        $btnMomenu.off("click").on("click", function() {
          if ($block.hasClass("block-active")) {
            $block.removeClass("block-active");
          } else {
            $block.addClass("block-active");
          }
          $block.find(".header-gnbitem").removeClass("item-active");
          $block.find(".header-sublist").removeAttr("style");
        });
        // header-gnbitem 클릭 이벤트
        $block.find(".header-gnbitem").each(function() {
          const $this = $(this);
          const $thisLink = $this.find(".header-gnblink");
          const $sublist = $this.find(".header-sublist");
          if ($sublist.length) {
            $thisLink.off("click").on("click", function(event) {
              event.preventDefault();
              const $clickedItem = $(this).parents(".header-gnbitem");
              if (!$clickedItem.hasClass("item-active")) {
                $block.find(".header-gnbitem").removeClass("item-active");
                $block.find(".header-sublist").stop().slideUp(300);
              }
              $clickedItem.toggleClass("item-active");
              $sublist.stop().slideToggle(300);
            });
          }
        });
        isMobileMenuInitialized = true;
      }
      // 데스크탑 메뉴 초기화
      function initDesktopMenu() {
        if (isDesktopMenuInitialized) return;
        $block.find(".header-gnbitem").each(function() {
          const $this = $(this);
          const $thisLink = $this.find(".header-gnblink");
          if ($thisLink.hasClass("header-reserve-link")) return;
          $thisLink.off("click");
        });
        isDesktopMenuInitialized = true;
      }
      // 해상도에 따른 메뉴 처리
      function handleResize() {
        if (window.innerWidth <= 992) {
          if (!isMobileMenuInitialized) {
            initMobileMenu();
          }
          isDesktopMenuInitialized = false;
        } else {
          if (!isDesktopMenuInitialized) {
            initDesktopMenu();
          }
          isMobileMenuInitialized = false;
        }
      }
      // 스크롤 시 메뉴 처리
      function handleScroll() {
        $block.removeClass("top-menu-active");
        if ($(window).scrollTop() === 0) {
          $block.addClass("header-top-active");
        }
        $(window).scroll(function() {
          if ($(window).scrollTop() > 0) {
            $block.removeClass("header-top-active");
          } else {
            $block.addClass("header-top-active");
          }
        });
      }
      handleScroll();
      forceTopGapFix();
      normalizeComplexSubMenus();
      $(window).on("load resize orientationchange", forceTopGapFix);
      // 전체 메뉴 열기/닫기 처리
      function handleFullMenu() {
        $block.find(".btn-allmenu").on("click", function() {
          $block.find(".header-fullmenu").addClass("fullmenu-active");
        });
        $block.find(".fullmenu-close").on("click", function() {
          $block.find(".header-fullmenu").removeClass("fullmenu-active");
        });
        $block.find(".fullmenu-gnbitem").each(function() {
          const $this = $(this);
          $this.on("mouseover", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").addClass("on");
            }
          });
          $this.on("mouseout", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").removeClass("on");
            }
          });
        });
      }

      function getConsultationTarget() {
        return (
          document.getElementById("consultation") ||
          document.querySelector(".properties-N9 .consultation-anchor") ||
          document.getElementById("consultation-title") ||
          document.querySelector(".properties-N9 .title-area")
        );
      }

      function buildConsultationUrl() {
        return "#consultation";
      }

      function getConsultationPreloadImages() {
        return Array.prototype.slice.call(
          document.querySelectorAll(
            ".properties-N5 img, .properties-N6 img, .properties-N7 img, .properties-N8 img, .properties-N10 img, .properties-N9 img"
          )
        );
      }

      function waitForConsultationAssets() {
        const images = getConsultationPreloadImages().filter(function(img) {
          if (!img) return false;
          img.loading = "eager";
          img.decoding = "sync";
          return !img.complete || !img.naturalWidth;
        });

        if (!images.length) {
          return Promise.resolve();
        }

        return new Promise(function(resolve) {
          var resolved = false;
          var remaining = images.length;
          var preloaders = [];

          function finish() {
            if (resolved) return;
            resolved = true;
            resolve();
          }

          function markDone() {
            remaining -= 1;
            if (remaining <= 0) {
              finish();
            }
          }

          var timeoutId = window.setTimeout(finish, 2400);

          images.forEach(function(img) {
            var source = img.currentSrc || img.src;
            if (source) {
              var preloader = new Image();
              preloaders.push(preloader);
              preloader.decoding = "sync";
              preloader.src = source;
            }

            function handleLoad() {
              img.removeEventListener("load", handleLoad);
              img.removeEventListener("error", handleLoad);
              markDone();
              if (remaining <= 0) {
                window.clearTimeout(timeoutId);
              }
            }

            img.addEventListener("load", handleLoad, { once: true });
            img.addEventListener("error", handleLoad, { once: true });
          });
        });
      }

      function waitForConsultationFonts() {
        if (!document.fonts || !document.fonts.ready) {
          return Promise.resolve();
        }

        return document.fonts.ready.catch(function() {
          return;
        });
      }

      function waitForConsultationLayoutStable() {
        return new Promise(function(resolve) {
          const startedAt = Date.now();
          let previousTop = null;
          let stableCount = 0;

          function sample() {
            const target = getConsultationTarget();
            if (!target) {
              resolve();
              return;
            }

            const currentTop = Math.round(target.getBoundingClientRect().top + window.scrollY);

            if (previousTop !== null && Math.abs(currentTop - previousTop) <= 1) {
              stableCount += 1;
            } else {
              stableCount = 0;
            }

            previousTop = currentTop;

            if (stableCount >= 3 || Date.now() - startedAt >= 2200) {
              resolve();
              return;
            }

            window.setTimeout(function() {
              window.requestAnimationFrame(sample);
            }, 90);
          }

          window.requestAnimationFrame(sample);
        });
      }

      function scrollToConsultation(behavior) {
        const target = getConsultationTarget();
        if (!target) return false;

        const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
        const isConsultationAnchor =
          target.id === "consultation" ||
          target.classList.contains("consultation-anchor");
        const header =
          document.querySelector(".properties-N1 .header-container") ||
          document.querySelector(".properties-N1");
        const headerHeight = header ? header.getBoundingClientRect().height : 96;
        const extraOffset = window.innerWidth <= 992 ? 8 : 16;
        const targetTop = isConsultationAnchor
          ? absoluteTop
          : absoluteTop - headerHeight - extraOffset;

        window.scrollTo({
          top: Math.max(0, Math.round(targetTop)),
          behavior: behavior || "smooth"
        });

        return true;
      }

      function runConsultationScroll() {
        if (!getConsultationTarget()) {
          window.location.href = buildConsultationUrl();
          return;
        }

        Promise.resolve()
          .then(waitForConsultationAssets)
          .then(waitForConsultationFonts)
          .then(waitForConsultationLayoutStable)
          .then(function() {
            window.requestAnimationFrame(function() {
              scrollToConsultation("smooth");
              window.setTimeout(clearConsultationLocation, 900);
            });
          });
      }

      function clearConsultationLocation() {
        const params = new URLSearchParams(window.location.search);
        params.delete("consultation");

        const nextSearch = params.toString();
        const nextHash =
          window.location.hash === "#consultation" ||
          window.location.hash === "#consultation-title"
            ? ""
            : window.location.hash;
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;

        history.replaceState(null, "", nextUrl);
      }

      function handleInitialConsultationRequest() {
        const params = new URLSearchParams(window.location.search);
        const shouldScroll =
          params.get("consultation") === "1" ||
          window.location.hash === "#consultation" ||
          window.location.hash === "#consultation-title";
        if (!shouldScroll) return;

        runConsultationScroll();
      }

      function bindConsultationShortcut() {
        const $consultationLinks = $block
          .find(".header-reserve-link[href='#consultation']")
          .add($(".js-consultation-scroll"));
        if (!$consultationLinks.length) return;

        $consultationLinks.off("click.consultationShortcut").on("click.consultationShortcut", function(event) {
          event.preventDefault();
          $block.removeClass("block-active");
          $block.find(".header-fullmenu").removeClass("fullmenu-active");
          runConsultationScroll();
        });
      }

      window.addEventListener("message", function(event) {
        if (!event || !event.data || event.data.type !== "consultation-scroll") return;
        runConsultationScroll();
      });

      handleFullMenu();
      bindConsultationShortcut();
      waitForConsultationAssets();
      handleInitialConsultationRequest();
      // 리사이즈 시마다 메뉴 동작 초기화
      $(window).on("resize", function() {
        handleResize();
      });
      handleResize();
    });
  });
})();


﻿(function() {
  const POPUP_HIDE_KEY = "patioforet_popup_hide_until_v2";

  function initBasicContentGuard() {
    if (window.__basicContentGuardInitialized) return;
    window.__basicContentGuardInitialized = true;
    document.documentElement.classList.add("content-guard-on");

    const editableSelector = "input, textarea, [contenteditable='true']";
    const isEditable = function(target) {
      return !!(target && target.closest && target.closest(editableSelector));
    };

    document.addEventListener(
      "contextmenu",
      function(event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "selectstart",
      function(event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "copy",
      function(event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "cut",
      function(event) {
        if (isEditable(event.target)) return;
        event.preventDefault();
      },
      { capture: true }
    );

    document.addEventListener(
      "dragstart",
      function(event) {
        const target = event.target;
        if (!target) return;
        if (target.tagName === "IMG" || target.closest("img")) {
          event.preventDefault();
        }
      },
      { capture: true }
    );

    document.addEventListener(
      "keydown",
      function(event) {
        const key = String(event.key || "").toLowerCase();
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        const blockedDevToolShortcut =
          event.key === "F12" ||
          (ctrlOrMeta && event.shiftKey && ["i", "j", "c"].includes(key));

        if (blockedDevToolShortcut || (ctrlOrMeta && (key === "u" || key === "s"))) {
          event.preventDefault();
        }
      },
      { capture: true }
    );
  }

  function ensureLeadSubmitLoaded() {
    if (window.__leadSubmitBootstrapLoaded) return;
    window.__leadSubmitBootstrapLoaded = true;

    var loaded = document.querySelector("script[src$='lead-submit.js'], script[src*='lead-submit.js?']");
    if (loaded) return;

    var script = document.createElement("script");
    script.src = "./lead-submit.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  function getTomorrowMidnight() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  }

  function isPopupHidden() {
    try {
      const value = Number(localStorage.getItem(POPUP_HIDE_KEY) || 0);
      return value > Date.now();
    } catch (_) {
      return false;
    }
  }

  function hidePopup($overlay) {
    $overlay.addClass("is-hidden");
  }

  $(function() {
    initBasicContentGuard();
    ensureLeadSubmitLoaded();

    const searchParams = new URLSearchParams(window.location.search || "");
    const skipPopupForConsultation =
      window.location.hash === "#consultation" ||
      searchParams.get("consultation") === "1";

    $(".properties-N4[id='pGmlW6KDwI']").each(function() {
      const $block = $(this);
      const $overlay = $block.find(".popup-overlay");
      const $heroSlider = $block.find(".hero-slider");
      const $heroBackdropPrimary = $block.find(".hero-backdrop-primary");
      const $heroBackdropSecondary = $block.find(".hero-backdrop-secondary");
      const $heroSlides = $block.find(".hero-slide");
      const $heroDots = $block.find(".hero-dots");
      const $heroPrev = $block.find(".hero-prev");
      const $heroNext = $block.find(".hero-next");
      const $stage = $block.find(".popup-stage");
      const $popupArea = $block.find(".popup-area");
      const $popupTrack = $block.find(".popup-track");
      let $cards = $popupTrack.children(".popup-card");
      const $dots = $block.find(".popup-dots");
      const $prev = $block.find(".popup-prev");
      const $next = $block.find(".popup-next");
      const $close = $block.find(".popup-close-btn");
      const $dayoff = $block.find(".popup-dayoff-check");
      const MOBILE_POPUP_AUTOPLAY_MS = 3200;
      const HERO_SLIDE_MS = 4300;
      let currentIndex = 0;
      let heroIndex = 0;
      let touchStartX = 0;
      let touchStartY = 0;
      let heroTouchStartX = 0;
      let heroTouchStartY = 0;
      let heroMouseDown = false;
      let heroDragMoved = false;
      let heroMouseStartX = 0;
      let heroMouseStartY = 0;
      let heroMouseCurrentX = 0;
      let heroMouseCurrentY = 0;
      let heroIsAnimating = false;
      let heroReleaseTimer = null;
      let autoplayTimer = null;
      let heroAutoplayTimer = null;
      let onVisibilityChange = null;
      let fitRaf = null;
      let popupLoopSnapIndex = null;

      function hoistPopupOverlay() {
        const node = $overlay && $overlay[0];
        if (!node || node.dataset.popupHoisted === "true") return;
        node.dataset.popupHoisted = "true";
        node.classList.add("popup-overlay-hoisted");
        document.body.appendChild(node);
      }

      $block.find(".popup-card img").attr("draggable", "false");
      hoistPopupOverlay();

      function isMobilePopup() {
        return window.matchMedia("(max-width: 992px)").matches;
      }

      function refreshPopupCards() {
        $cards = $popupTrack.children(".popup-card").not(".popup-card-clone");
      }

      function isPopupLoopReady() {
        return $popupTrack.data("popup-loop-ready") === true;
      }

      function setupPopupLoop() {
        $popupTrack.children(".popup-card-clone").remove();
        $popupTrack.removeData("popup-loop-ready");
        refreshPopupCards();
        popupLoopSnapIndex = null;

        if (!isMobilePopup() || $cards.length < 2) return;

        const $firstClone = $cards.eq(0).clone(false).addClass("popup-card-clone").attr("aria-hidden", "true");
        const $lastClone = $cards.eq($cards.length - 1).clone(false).addClass("popup-card-clone").attr("aria-hidden", "true");
        $popupTrack.prepend($lastClone);
        $popupTrack.append($firstClone);
        $popupTrack.data("popup-loop-ready", true);
      }

      function normalizeIndex(index) {
        const len = $cards.length;
        if (!len) return 0;
        return (index + len) % len;
      }

      function normalizeHeroIndex(index) {
        const len = $heroSlides.length;
        if (!len) return 0;
        return (index + len) % len;
      }

      function setPopupTrackPosition(positionIndex, useTransition) {
        if (!isMobilePopup()) {
          $popupTrack.css({ transition: "", transform: "" });
          return;
        }

        if (useTransition) {
          $popupTrack.css("transition", "");
          $popupTrack.css("transform", "translateX(-" + (positionIndex * 100) + "%)");
          return;
        }

        $popupTrack.css("transition", "none");
        $popupTrack.css("transform", "translateX(-" + (positionIndex * 100) + "%)");
        const node = $popupTrack.get(0);
        if (node) void node.offsetWidth;
        $popupTrack.css("transition", "");
      }

      function updatePopupDots() {
        $dots.find(".popup-dot").removeClass("is-active")
          .eq(currentIndex).addClass("is-active");
      }

      function renderPopupSlider(useTransition) {
        refreshPopupCards();
        if (!$cards.length) return;
        if (isMobilePopup()) {
          const visualIndex = isPopupLoopReady() ? currentIndex + 1 : currentIndex;
          setPopupTrackPosition(visualIndex, useTransition !== false);
          updatePopupDots();
        } else {
          setPopupTrackPosition(0, false);
        }
      }

      function goTo(index) {
        refreshPopupCards();
        if (!$cards.length) return;

        if (isMobilePopup() && isPopupLoopReady()) {
          const len = $cards.length;
          if (index >= len) {
            currentIndex = 0;
            popupLoopSnapIndex = 0;
            setPopupTrackPosition(len + 1, true);
            updatePopupDots();
            return;
          }
          if (index < 0) {
            currentIndex = len - 1;
            popupLoopSnapIndex = len - 1;
            setPopupTrackPosition(0, true);
            updatePopupDots();
            return;
          }
        }

        popupLoopSnapIndex = null;
        currentIndex = normalizeIndex(index);
        renderPopupSlider(true);
      }

      function stopAutoplay() {
        if (!autoplayTimer) return;
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }

      function startAutoplay() {
        stopAutoplay();
        if (!isMobilePopup() || $cards.length < 2 || $overlay.hasClass("is-hidden")) return;
        autoplayTimer = window.setInterval(function() {
          goTo(currentIndex + 1);
        }, MOBILE_POPUP_AUTOPLAY_MS);
      }

      function restartAutoplay() {
        startAutoplay();
      }

      function renderHeroSlides() {
        if (!$heroSlides.length) return;
        if (heroReleaseTimer) {
          window.clearTimeout(heroReleaseTimer);
          heroReleaseTimer = null;
        }
        heroIsAnimating = false;
        $heroSlides.removeAttr("style");
        $heroSlider.removeClass("is-dragging is-snapping");
        $heroSlides.removeClass("is-active").eq(heroIndex).addClass("is-active");
        $heroDots.find(".hero-dot").removeClass("is-active")
          .eq(heroIndex).addClass("is-active");
        syncHeroBackdrop(heroIndex);
        syncHeroTheme(heroIndex);
      }

      function goHero(index) {
        if (!$heroSlides.length) return;
        heroIndex = normalizeHeroIndex(index);
        renderHeroSlides();
      }

      function getHeroSlideImage(index) {
        const slide = $heroSlides.get(index);
        if (!slide) return "";
        const img = slide.querySelector("img");
        if (!img) return "";
        return img.currentSrc || img.getAttribute("src") || "";
      }

      function syncHeroBackdrop(index) {
        const src = getHeroSlideImage(index);
        if (!src) return;
        $heroBackdropPrimary.css({
          backgroundImage: 'url("' + src + '")',
          opacity: 0.88
        });
        $heroBackdropSecondary.css({
          backgroundImage: "",
          opacity: 0
        });
      }

      function syncHeroTheme(index) {
        $block.removeClass("hero-theme-gold hero-theme-navy hero-theme-bright");
        if (index === 0) {
          $block.addClass("hero-theme-gold");
        } else if (index === 2) {
          $block.addClass("hero-theme-bright");
        } else {
          $block.addClass("hero-theme-navy");
        }
      }

      function stabilizeHeroCopy() {
        const copyLines = $block.find(".hero-copy-kicker, .hero-copy-title, .hero-copy-subtitle").toArray();
        if (!copyLines.length) return;

        let ended = 0;
        let fallbackTimer = null;

        const lock = function() {
          if ($block.hasClass("hero-copy-stable")) return;
          $block.addClass("hero-copy-stable");
          copyLines.forEach(function(line) {
            line.removeEventListener("animationend", handleEnd);
          });
          if (fallbackTimer) {
            window.clearTimeout(fallbackTimer);
            fallbackTimer = null;
          }
        };

        const handleEnd = function() {
          ended += 1;
          if (ended >= copyLines.length) lock();
        };

        copyLines.forEach(function(line) {
          line.addEventListener("animationend", handleEnd);
        });

        fallbackTimer = window.setTimeout(lock, 3200);
      }

      function handleHeroGesture(diffX, diffY) {
        if (heroIsAnimating || Math.abs(diffY) > Math.abs(diffX)) return false;

        const sliderWidth = $block.outerWidth() || $heroSlider.outerWidth() || 1;
        const threshold = Math.max(70, sliderWidth * 0.14);
        const direction = diffX < 0 ? 1 : -1;
        const adjacentIndex = normalizeHeroIndex(heroIndex + direction);
        const $current = $heroSlides.eq(heroIndex);
        const $adjacent = $heroSlides.eq(adjacentIndex);

        $heroSlider.removeClass("is-dragging").addClass("is-snapping");
        heroIsAnimating = true;

        if (Math.abs(diffX) >= threshold) {
          $current.css({
            opacity: 1,
            transform: "translateX(" + (-direction * sliderWidth) + "px) scale(1)",
            zIndex: 3
          });
          $adjacent.css({
            opacity: 1,
            transform: "translateX(0px) scale(1)",
            zIndex: 2
          });

          heroReleaseTimer = window.setTimeout(function() {
            heroIndex = adjacentIndex;
            renderHeroSlides();
            restartHeroAutoplay();
          }, 620);
          return true;
        }

        $current.css({
          opacity: 1,
          transform: "translateX(0px) scale(1)",
          zIndex: 3
        });
        $adjacent.css({
          opacity: 1,
          transform: "translateX(" + (direction > 0 ? sliderWidth : -sliderWidth) + "px) scale(1)",
          zIndex: 2
        });

        heroReleaseTimer = window.setTimeout(function() {
          renderHeroSlides();
          startHeroAutoplay();
        }, 560);
        return false;
      }

      function resetHeroDragState() {
        heroMouseDown = false;
        heroDragMoved = false;
        heroMouseStartX = 0;
        heroMouseStartY = 0;
        heroMouseCurrentX = 0;
        heroMouseCurrentY = 0;
        $heroSlider.removeClass("is-dragging");
        $heroSlides.removeAttr("style");
      }

      function applyHeroDrag(diffX) {
        if (!$heroSlides.length) return;

        const sliderWidth = $block.outerWidth() || $heroSlider.outerWidth() || 1;
        const clamped = Math.max(-sliderWidth, Math.min(sliderWidth, diffX));
        const progress = Math.min(1, Math.abs(clamped) / sliderWidth);
        const direction = clamped < 0 ? 1 : -1;
        const adjacentIndex = normalizeHeroIndex(heroIndex + direction);
        const $current = $heroSlides.eq(heroIndex);
        const $adjacent = $heroSlides.eq(adjacentIndex);
        const currentSrc = getHeroSlideImage(heroIndex);
        const adjacentSrc = getHeroSlideImage(adjacentIndex);

        if (currentSrc) {
          $heroBackdropPrimary.css({
            backgroundImage: 'url("' + currentSrc + '")',
            opacity: 0.88 - progress * 0.28
          });
        }
        if (adjacentSrc) {
          $heroBackdropSecondary.css({
            backgroundImage: 'url("' + adjacentSrc + '")',
            opacity: Math.min(0.88, progress * 0.72)
          });
        }

        $heroSlider.addClass("is-dragging");
        $heroSlides.each(function(index) {
          const $slide = $(this);
          if (index === heroIndex) {
            $slide.css({
              opacity: 1,
              transform: "translateX(" + clamped + "px) scale(1)",
              zIndex: 3
            });
          } else if (index === adjacentIndex) {
            const incoming = direction > 0 ? sliderWidth + clamped : -sliderWidth + clamped;
            $slide.css({
              opacity: 1,
              transform: "translateX(" + incoming + "px) scale(1)",
              zIndex: 2
            });
          } else {
            $slide.css({
              opacity: 0,
              transform: "translateX(0) scale(1)",
              zIndex: 1
            });
          }
        });
      }

      function canStartHeroDrag(target) {
        if (!target) return false;
        if ($(target).closest(".hero-controls, .popup-overlay, a, button, input, textarea, select, label").length) {
          return false;
        }
        return true;
      }

      function stopHeroAutoplay() {
        if (!heroAutoplayTimer) return;
        window.clearInterval(heroAutoplayTimer);
        heroAutoplayTimer = null;
      }

      function startHeroAutoplay() {
        stopHeroAutoplay();
        if ($heroSlides.length < 2) return;
        heroAutoplayTimer = window.setInterval(function() {
          goHero(heroIndex + 1);
        }, HERO_SLIDE_MS);
      }

      function restartHeroAutoplay() {
        startHeroAutoplay();
      }

      function isMobileHero() {
        return window.matchMedia("(max-width: 992px)").matches;
      }

      function fitDesktopPopup() {
        if (!$stage.length) return;
        const stageEl = $stage.get(0);
        if (!stageEl) return;

        if (isMobilePopup()) {
          stageEl.style.removeProperty("--popup-desktop-scale");
          return;
        }

        stageEl.style.setProperty("--popup-desktop-scale", "1.035");
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const availableHeight = Math.max(240, viewportHeight - 32);
        const measuredHeight = stageEl.getBoundingClientRect().height;
        if (!measuredHeight || measuredHeight <= availableHeight) return;

        const fitScale = Math.max(0.55, Math.min(1.035, 1.035 * (availableHeight / measuredHeight)));
        stageEl.style.setProperty("--popup-desktop-scale", fitScale.toFixed(3));
      }

      function scheduleFitDesktopPopup() {
        if (fitRaf) window.cancelAnimationFrame(fitRaf);
        fitRaf = window.requestAnimationFrame(function() {
          fitDesktopPopup();
          fitRaf = null;
        });
      }

      function buildHeroDots() {
        if (!$heroSlides.length) return;
        $heroDots.empty();
        for (let i = 0; i < $heroSlides.length; i += 1) {
          const $dot = $("<button/>", {
            type: "button",
            class: "hero-dot" + (i === 0 ? " is-active" : ""),
            "aria-label": "메인 이미지 " + (i + 1) + "번 보기",
            "data-index": i
          });
          $heroDots.append($dot);
        }
      }

      function buildDots() {
        refreshPopupCards();
        if (!$cards.length) return;
        $dots.empty();
        for (let i = 0; i < $cards.length; i += 1) {
          const $dot = $("<button/>", {
            type: "button",
            class: "popup-dot" + (i === 0 ? " is-active" : ""),
            "aria-label": "?앹뾽 " + (i + 1) + "踰?蹂닿린",
            "data-index": i
          });
          $dots.append($dot);
        }
      }

      setupPopupLoop();
      buildHeroDots();
      buildDots();
      $popupTrack.find("img").on("load", scheduleFitDesktopPopup);
      $block.find(".hero-slide img").attr("draggable", "false");
      goHero(0);
      startHeroAutoplay();
      stabilizeHeroCopy();

      $popupTrack.on("transitionend", function(event) {
        if (event.target !== $popupTrack.get(0)) return;
        if (!isMobilePopup() || !isPopupLoopReady() || popupLoopSnapIndex === null) return;
        renderPopupSlider(false);
        popupLoopSnapIndex = null;
      });

      $heroPrev.on("click", function() {
        goHero(heroIndex - 1);
        restartHeroAutoplay();
      });

      $heroNext.on("click", function() {
        goHero(heroIndex + 1);
        restartHeroAutoplay();
      });

      $heroDots.on("click", ".hero-dot", function() {
        const index = Number($(this).data("index") || 0);
        goHero(index);
        restartHeroAutoplay();
      });

      $heroSlider.on("touchstart", function(event) {
        const touch = event.originalEvent.touches && event.originalEvent.touches[0];
        if (!touch || heroIsAnimating) return;
        heroTouchStartX = touch.clientX;
        heroTouchStartY = touch.clientY;
      });

      $heroSlider.on("touchend", function(event) {
        const touch = event.originalEvent.changedTouches && event.originalEvent.changedTouches[0];
        if (!touch) return;
        const diffX = touch.clientX - heroTouchStartX;
        const diffY = touch.clientY - heroTouchStartY;
        if (isMobileHero()) {
          if (Math.abs(diffX) < 40 || Math.abs(diffX) < Math.abs(diffY)) return;
          if (diffX < 0) {
            goHero(heroIndex + 1);
          } else {
            goHero(heroIndex - 1);
          }
          restartHeroAutoplay();
          return;
        }
        handleHeroGesture(diffX, diffY);
      });

      $block.on("mousedown", function(event) {
        if (event.button !== 0 || heroIsAnimating) return;
        if (!canStartHeroDrag(event.target)) return;
        heroMouseDown = true;
        heroDragMoved = false;
        heroMouseStartX = event.clientX;
        heroMouseStartY = event.clientY;
        heroMouseCurrentX = event.clientX;
        heroMouseCurrentY = event.clientY;
        stopHeroAutoplay();
        $heroSlider.addClass("is-dragging");
      });

      $(window).on("mousemove", function(event) {
        if (!heroMouseDown) return;
        heroMouseCurrentX = event.clientX;
        heroMouseCurrentY = event.clientY;

        const diffX = heroMouseCurrentX - heroMouseStartX;
        const diffY = heroMouseCurrentY - heroMouseStartY;

        if (!heroDragMoved && Math.abs(diffX) < 6 && Math.abs(diffY) < 6) return;
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 12) {
          resetHeroDragState();
          startHeroAutoplay();
          renderHeroSlides();
          return;
        }

        heroDragMoved = true;
        applyHeroDrag(diffX);
      });

      $(window).on("mouseup", function(event) {
        if (!heroMouseDown) return;
        const diffX = (heroDragMoved ? heroMouseCurrentX : event.clientX) - heroMouseStartX;
        const diffY = (heroDragMoved ? heroMouseCurrentY : event.clientY) - heroMouseStartY;
        resetHeroDragState();
        if (!handleHeroGesture(diffX, diffY)) {
          renderHeroSlides();
          startHeroAutoplay();
        }
      });

      $prev.on("click", function() {
        if (!isMobilePopup()) return;
        goTo(currentIndex - 1);
        restartAutoplay();
      });

      $next.on("click", function() {
        if (!isMobilePopup()) return;
        goTo(currentIndex + 1);
        restartAutoplay();
      });

      $dots.on("click", ".popup-dot", function() {
        if (!isMobilePopup()) return;
        const index = Number($(this).data("index") || 0);
        goTo(index);
        restartAutoplay();
      });

      $popupArea.on("touchstart", function(event) {
        if (!isMobilePopup()) return;
        const touch = event.originalEvent.touches && event.originalEvent.touches[0];
        if (!touch) return;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      });

      $popupArea.on("touchend", function(event) {
        if (!isMobilePopup()) return;
        const touch = event.originalEvent.changedTouches && event.originalEvent.changedTouches[0];
        if (!touch) return;
        const diffX = touch.clientX - touchStartX;
        const diffY = touch.clientY - touchStartY;
        if (Math.abs(diffX) < 40 || Math.abs(diffX) < Math.abs(diffY)) return;
        if (diffX < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
        restartAutoplay();
      });

      $(window).on("resize orientationchange", function() {
        setupPopupLoop();
        buildDots();
        currentIndex = normalizeIndex(currentIndex);
        renderPopupSlider(false);
        scheduleFitDesktopPopup();
        startAutoplay();
      });

      if (isPopupHidden() || skipPopupForConsultation) {
        stopAutoplay();
        hidePopup($overlay);
      }
      else {
        currentIndex = 0;
        renderPopupSlider(false);
        scheduleFitDesktopPopup();
        startAutoplay();
      }

      onVisibilityChange = function() {
        if (document.hidden) {
          stopAutoplay();
          stopHeroAutoplay();
        } else {
          startHeroAutoplay();
          if (!$overlay.hasClass("is-hidden")) {
            startAutoplay();
          }
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      $close.on("click", function() {
        stopAutoplay();
        if ($dayoff.is(":checked")) {
          try {
            localStorage.setItem(POPUP_HIDE_KEY, String(getTomorrowMidnight()));
          } catch (_) {}
        }
        hidePopup($overlay);
      });
    });
  });
})();





﻿(function() {


function initN5Reveal(sectionEl) {
    if (!sectionEl) return;
    var leadBanners = sectionEl.querySelectorAll(".n5-lead-banner-wrap");
    var leadItems = sectionEl.querySelectorAll(".n5-lead-item");
    var topItems = sectionEl.querySelectorAll(".n5-mobile-top-item");
    var cards = sectionEl.querySelectorAll(".swiper-slide .n5-card");
    var premiumItems = sectionEl.querySelectorAll(".premium8-head, .premium8-slider-wrap, .premium8-pagination");
    var targets = Array.prototype.slice.call(leadBanners)
      .concat(Array.prototype.slice.call(leadItems))
      .concat(Array.prototype.slice.call(topItems))
      .concat(Array.prototype.slice.call(cards))
      .concat(Array.prototype.slice.call(premiumItems));
    if (!targets.length) return;

    sectionEl.classList.add("reveal-ready");

    var revealItem = function(item, idx) {
      window.setTimeout(function() {
        item.classList.add("in-view");
      }, idx * 100);
    };

    var show = function() {
      targets.forEach(function(card, idx) {
        window.setTimeout(function() {
          card.classList.add("in-view");
        }, idx * 100);
      });
    };

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var itemIndex = targets.indexOf(entry.target);
        revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px"
    });

    targets.forEach(function(item) {
      observer.observe(item);
    });
  }

  $(function() {
    $(".properties-N5[id='mbmLw6KE2H']").each(function() {
      var blockSelector = ".properties-N5[id='mbmLw6KE2H']";
      new Swiper(blockSelector + " .n5-swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 680,
        grabCursor: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        navigation: {
          prevEl: blockSelector + " .n5-btn-prev",
          nextEl: blockSelector + " .n5-btn-next"
        },
        pagination: {
          el: blockSelector + " .n5-pagination",
          clickable: true
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 0 },
          640: { slidesPerView: 1, spaceBetween: 0 },
          1024: { slidesPerView: 1, spaceBetween: 0 },
          1440: { slidesPerView: 1, spaceBetween: 0 }
        }
      });

      initN5Reveal(this);
    });
  });
})();




﻿(function() {
  function initN6Reveal() {
    var section = document.querySelector('.properties-N6[id="Wtmlw6KE6z"]');
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll(
      '.n6-image-combo > .section-banner-card, .n6-image-item > .section-banner-card, .n6-mobile-section-head'
    ));
    if (!items.length) return;

    items.forEach(function(item) {
      item.classList.add('n6-reveal-target');
    });
    section.classList.add('reveal-ready');

    var revealItem = function(item, idx) {
      if (!item) return;
      window.setTimeout(function() {
        item.classList.add('in-view');
      }, idx * 90);
    };

    if (!("IntersectionObserver" in window)) {
      items.forEach(function(item, idx) {
        revealItem(item, idx);
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var itemIndex = items.indexOf(entry.target);
          revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px -4% 0px'
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  function initN6() {
    initN6Reveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initN6);
  } else {
    initN6();
  }
})();

(function() {
  function initN7Reveal(sectionEl) {
    if (!sectionEl) return;
    var items = Array.prototype.slice.call(
      sectionEl.querySelectorAll(".landscape-head, .landscape-slider-wrap, .landscape-pagination")
    );
    if (!items.length) return;

    sectionEl.classList.add("reveal-ready");

    var showAll = function() {
      items.forEach(function(item, index) {
        window.setTimeout(function() {
          item.classList.add("in-view");
        }, index * 140);
      });
    };

    if (!("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        items.forEach(function(item, index) {
          window.setTimeout(function() {
            item.classList.add("in-view");
          }, index * 120);
        });
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    observer.observe(sectionEl);
  }

  $(function() {
    $(".properties-N7[id='FgMLw6KEAS']").each(function() {
      initN7Reveal(this);
    });
  });
})();

(function() {
  function initN8Reveal() {
    var section = document.querySelector('.properties-N8[id="ciMLW6keFd"]');
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll('.n8-banner-card'));
    if (!items.length) return;

    section.classList.add('reveal-ready');

    var revealItem = function(item, idx) {
      window.setTimeout(function() {
        item.classList.add('in-view');
      }, idx * 90);
    };

    var showItems = function() {
      items.forEach(function(item, idx) {
        revealItem(item, idx);
      });
    };

    if (!('IntersectionObserver' in window)) {
      showItems();
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var itemIndex = items.indexOf(entry.target);
        revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initN8Reveal);
  } else {
    initN8Reveal();
  }
})();

(function() {
  function initN10Reveal() {
    var section = document.querySelector('.properties-N10');
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll('.n10-type-card'));
    if (!items.length) return;

    section.classList.add('reveal-ready');

    var revealItem = function(item, idx) {
      window.setTimeout(function() {
        item.classList.add('in-view');
      }, idx * 70);
    };

    var showItems = function() {
      items.forEach(function(item, idx) {
        revealItem(item, idx);
      });
    };

    if (!('IntersectionObserver' in window)) {
      showItems();
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var itemIndex = items.indexOf(entry.target);
        revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initN10Reveal);
  } else {
    initN10Reveal();
  }
})();

(function() {
  function initN9Reveal(sectionEl) {
    if (!sectionEl) return;
    var items = Array.prototype.slice.call(
      sectionEl.querySelectorAll('.title-area, .form-group, .n9-bottom-banner')
    );
    items = items.filter(function(item) { return !!item; });
    if (!items.length) return;

    sectionEl.classList.add('reveal-ready');

    var revealItem = function(item, idx) {
      window.setTimeout(function() {
        item.classList.add('in-view');
      }, idx * 90);
    };

    var showItems = function() {
      items.forEach(function(item, idx) {
        revealItem(item, idx);
      });
    };

    if (!('IntersectionObserver' in window)) {
      showItems();
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var itemIndex = items.indexOf(entry.target);
        revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  $(function() {
    $(".properties-N9[id='vzMlw6KehW']").each(function() {
      initN9Reveal(this);
      const $block = $(this);
      const $checksetWrap = $block.find(".checkset-wrap");
      const NAME_PATTERN = /^[A-Za-z\uAC00-\uD7A3]+$/;
      const PHONE_PATTERN = /^010\d{8}$/;
      const sanitizeName = (value) => String(value || "").replace(/[^A-Za-z\uAC00-\uD7A3]/g, "");
      const sanitizePhone = (value) => String(value || "").replace(/\D/g, "").slice(0, 11);

      if ($checksetWrap.length) {
        const $validator = $("<input>", {
          type: "text",
          required: true,
          style: "position: absolute; opacity: 0; pointer-events: none;",
          tabindex: -1
        }).insertBefore($checksetWrap.find(".checkset-input").first());

        const $groupChecks = $checksetWrap.find(".checkset-input");
        $groupChecks.prop("required", false);

        $groupChecks.on("change", function() {
          if ($groupChecks.is(":checked")) {
            $validator.val("checked");
            $validator[0].setCustomValidity("");
          } else {
            $validator.val("");
            $validator[0].setCustomValidity("\uBAA9\uC801\uC740 \uCD5C\uC18C \uD558\uB098 \uC774\uC0C1 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
          }
        });

        $validator.val("");
        $validator[0].setCustomValidity("\uBAA9\uC801\uC740 \uCD5C\uC18C \uD558\uB098 \uC774\uC0C1 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");
      }

      const $form = $block.find(".form-group form").first();
      const $nameInput = $form.find("#properties-N9-inputset-a-1, input[name='성함'], input[type='text']").first();
      const $privacyCheck = $block.find(".contents-agree .checkset-input[type='checkbox']").first();
      const $phoneInput = $form.find("#properties-N9-inputset-a-2, input[type='tel']").first();

      if ($nameInput.length) {
        let isComposing = false;
        $nameInput.attr({ pattern: "[A-Za-z가-힣]+" });
        $nameInput.off("compositionstart.nameSanitize compositionend.nameSanitize input.nameSanitize");

        $nameInput.on("compositionstart.nameSanitize", function() {
          isComposing = true;
        });

        $nameInput.on("compositionend.nameSanitize", function() {
          isComposing = false;
          const normalized = sanitizeName($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });

        $nameInput.on("input.nameSanitize", function(event) {
          if (isComposing || (event.originalEvent && event.originalEvent.isComposing)) return;
          const normalized = sanitizeName($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });
      }

      if ($phoneInput.length) {
        $phoneInput.attr({
          inputmode: "numeric",
          maxlength: "11",
          pattern: "010[0-9]{8}"
        });

        $phoneInput.off("input.phoneSanitize").on("input.phoneSanitize", function() {
          const normalized = sanitizePhone($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });
      }

      if ($form.length && $privacyCheck.length) {
        $privacyCheck.prop("required", false);
        $form.off("submit.privacyConsentGuard").on("submit.privacyConsentGuard", function(event) {
          if ($nameInput.length) {
            const name = sanitizeName($nameInput.val());
            $nameInput.val(name);
            if (!name) {
              event.preventDefault();
              alert("\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
              $nameInput.trigger("focus");
              return false;
            }
            if (!NAME_PATTERN.test(name)) {
              event.preventDefault();
              alert("\uC774\uB984\uC740 \uD55C\uAE00 \uB610\uB294 \uC601\uC5B4\uB9CC \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
              $nameInput.trigger("focus");
              return false;
            }
          }

          if ($phoneInput.length) {
            const phone = sanitizePhone($phoneInput.val());
            $phoneInput.val(phone);
            if (!PHONE_PATTERN.test(phone)) {
              event.preventDefault();
              alert("\uD734\uB300\uD3F0 \uBC88\uD638\uB294 010\uC73C\uB85C \uC2DC\uC791\uD558\uB294 11\uC790\uB9AC \uC22B\uC790\uB9CC \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
              $phoneInput.trigger("focus");
              return false;
            }
          }

          if (!$privacyCheck.is(":checked")) {
            event.preventDefault();
            alert("\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1/\uC774\uC6A9\uB3D9\uC758\uC5D0 \uCCB4\uD06C\uD574 \uC8FC\uC138\uC694.");
            $privacyCheck.trigger("focus");
            return false;
          }

          return true;
        });
      }
    });
  });
})();
(function() {
  $(function() {
    var NAME_PATTERN = /^[A-Za-z\uAC00-\uD7A3]+$/;
    var PHONE_PATTERN = /^010\d{8}$/;

    function sanitizeName(value) {
      return String(value || "").replace(/[^A-Za-z\uAC00-\uD7A3]/g, "");
    }

    function sanitizePhone(value) {
      return String(value || "").replace(/\D/g, "").slice(0, 11);
    }

    function hoistFixedConsultBar($bar) {
      const node = $bar && $bar[0];
      if (!node || node.dataset.fixedHoisted === "true") return;
      node.dataset.fixedHoisted = "true";
      document.body.appendChild(node);
    }

    $(".fixed-consult-bar.is-split").each(function() {
      const $block = $(this);
      hoistFixedConsultBar($block);
      const $nameInput = $block.find(".consult-form input[type='text']").first();
      const $phoneInput = $block.find(".consult-form input[type='tel']").first();
      const $privacyCheck = $block.find(".consult-privacy-check").first();
      const $submitBtn = $block.find(".consult-submit").first();

      if ($nameInput.length) {
        let isComposing = false;
        $nameInput.attr({ pattern: "[A-Za-z가-힣]+" });
        $nameInput.off("compositionstart.nameSanitize compositionend.nameSanitize input.nameSanitize");

        $nameInput.on("compositionstart.nameSanitize", function() {
          isComposing = true;
        });

        $nameInput.on("compositionend.nameSanitize", function() {
          isComposing = false;
          const normalized = sanitizeName($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });

        $nameInput.on("input.nameSanitize", function(event) {
          if (isComposing || (event.originalEvent && event.originalEvent.isComposing)) return;
          const normalized = sanitizeName($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });
      }

      if ($phoneInput.length) {
        $phoneInput.attr({
          inputmode: "numeric",
          maxlength: "11",
          pattern: "010[0-9]{8}"
        });

        $phoneInput.off("input.phoneSanitize").on("input.phoneSanitize", function() {
          const normalized = sanitizePhone($(this).val());
          if ($(this).val() !== normalized) {
            $(this).val(normalized);
          }
        });
      }

      if (!$privacyCheck.length || !$submitBtn.length) return;

      $submitBtn.off("click.privacyConsentGuard").on("click.privacyConsentGuard", function(event) {
        if ($nameInput.length) {
          const name = sanitizeName($nameInput.val());
          $nameInput.val(name);
          if (!name) {
            event.preventDefault();
            alert("\uC774\uB984\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
            $nameInput.trigger("focus");
            return;
          }
          if (!NAME_PATTERN.test(name)) {
            event.preventDefault();
            alert("\uC774\uB984\uC740 \uD55C\uAE00 \uB610\uB294 \uC601\uC5B4\uB9CC \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
            $nameInput.trigger("focus");
            return;
          }
        }

        if ($phoneInput.length) {
          const phone = sanitizePhone($phoneInput.val());
          $phoneInput.val(phone);
          if (!PHONE_PATTERN.test(phone)) {
            event.preventDefault();
            alert("\uD734\uB300\uD3F0 \uBC88\uD638\uB294 010\uC73C\uB85C \uC2DC\uC791\uD558\uB294 11\uC790\uB9AC \uC22B\uC790\uB9CC \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
            $phoneInput.trigger("focus");
            return;
          }
        }

        if ($privacyCheck.is(":checked")) return;
        event.preventDefault();
        alert("\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1/\uC774\uC6A9\uB3D9\uC758\uC5D0 \uCCB4\uD06C\uD574 \uC8FC\uC138\uC694.");
        $privacyCheck.trigger("focus");
      });
    });
  });
})();

(function () {
  var iframe = document.getElementById('n5-yt-player');
  var videoItem = document.querySelector('.n5-lead-video');
  if (!iframe || !videoItem) return;

  var iframeLoaded = false;
  var playRequested = false;

  function postPlayerCommand(func, args) {
    if (!iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: func, args: args || [] }),
      '*'
    );
  }

  function playFromVideoSection() {
    if (playRequested) return;
    playRequested = true;

    var run = function() {
      postPlayerCommand('setVolume', [50]);
      postPlayerCommand('unMute');
      postPlayerCommand('playVideo');
    };

    if (iframeLoaded) {
      run();
      window.setTimeout(run, 450);
      return;
    }

    iframe.addEventListener('load', function handleLoad() {
      iframe.removeEventListener('load', handleLoad);
      iframeLoaded = true;
      run();
      window.setTimeout(run, 450);
    });
  }

  iframe.addEventListener('load', function() {
    iframeLoaded = true;
  });

  if (!('IntersectionObserver' in window)) {
    playFromVideoSection();
    return;
  }

  var videoObserver = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.38) return;
      playFromVideoSection();
      obs.unobserve(entry.target);
    });
  }, {
    threshold: [0.2, 0.38, 0.6]
  });

  videoObserver.observe(videoItem);
})();

(function () {
  var p8wrap = document.querySelector('.premium8-swiper');
  if (!p8wrap || typeof Swiper === 'undefined') return;
  var p8 = new Swiper(p8wrap, {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
    speed: 520,
    autoplay: {
      delay: 2200,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: { el: '.premium8-pagination', clickable: true },
    navigation: {
      prevEl: '.premium8-prev',
      nextEl: '.premium8-next'
    },
    breakpoints: {
      0:   { slidesPerView: 1, spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 16 },
      993: { slidesPerView: 3, spaceBetween: 16 }
    }
  });
  document.querySelector('.premium8-prev').addEventListener('click', function(){ p8.slidePrev(); });
  document.querySelector('.premium8-next').addEventListener('click', function(){ p8.slideNext(); });
})();

(function () {
  if (typeof Swiper === 'undefined') return;

  var premiumWrap = document.querySelector('.premium8-swiper');
  if (!premiumWrap) return;

  var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 992px)') : null;
  var premiumSlides = Array.prototype.slice.call(premiumWrap.querySelectorAll('.swiper-slide'));
  var sourceMap = [];

  premiumSlides.forEach(function (slide, index) {
    var img = slide.querySelector('img');
    if (!img) return;
    var realIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
    if (isNaN(realIndex)) realIndex = index;
    if (sourceMap[realIndex]) return;
    sourceMap[realIndex] = {
      src: img.currentSrc || img.src,
      alt: img.alt || ('PREMIUM ' + (realIndex + 1))
    };
  });

  sourceMap = sourceMap.filter(Boolean);
  if (!sourceMap.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'premium8-lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="premium8-lightbox-inner" role="dialog" aria-modal="true" aria-label="프리미엄 이미지 확대 보기">' +
      '<button type="button" class="premium8-lightbox-close" aria-label="닫기">&times;</button>' +
      '<button type="button" class="premium8-lightbox-nav premium8-lightbox-prev" aria-label="이전">&#8249;</button>' +
      '<div class="premium8-lightbox-swiper swiper"><div class="swiper-wrapper"></div><div class="premium8-lightbox-pagination swiper-pagination"></div></div>' +
      '<button type="button" class="premium8-lightbox-nav premium8-lightbox-next" aria-label="다음">&#8250;</button>' +
    '</div>';

  var wrapper = overlay.querySelector('.swiper-wrapper');
  sourceMap.forEach(function (item) {
    var slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = '<div class="swiper-zoom-container"><img src="' + item.src + '" alt="' + item.alt + '"></div>';
    wrapper.appendChild(slide);
  });
  document.body.appendChild(overlay);

  var lightboxSwiper = new Swiper(overlay.querySelector('.premium8-lightbox-swiper'), {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 320,
    zoom: {
      maxRatio: 4,
      minRatio: 1,
      toggle: true
    },
    pagination: {
      el: overlay.querySelector('.premium8-lightbox-pagination'),
      clickable: true
    },
    navigation: {
      prevEl: overlay.querySelector('.premium8-lightbox-prev'),
      nextEl: overlay.querySelector('.premium8-lightbox-next')
    },
    on: {
      slideChangeTransitionStart: function () {
        if (this.zoom && typeof this.zoom.out === 'function') {
          this.zoom.out();
        }
      }
    }
  });

  function closeLightbox() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('premium8-lightbox-open');
    document.body.classList.remove('premium8-lightbox-open');
    if (lightboxSwiper.zoom && typeof lightboxSwiper.zoom.out === 'function') {
      lightboxSwiper.zoom.out();
    }
  }

  function openLightbox(index) {
    if (mobileQuery && !mobileQuery.matches) return;
    lightboxSwiper.slideToLoop(index, 0);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('premium8-lightbox-open');
    document.body.classList.add('premium8-lightbox-open');
  }

  premiumWrap.addEventListener('click', function (event) {
    if (mobileQuery && !mobileQuery.matches) return;
    var card = event.target.closest('.premium8-card');
    if (!card) return;
    event.preventDefault();
    var slide = card.closest('.swiper-slide');
    var realIndex = slide ? parseInt(slide.getAttribute('data-swiper-slide-index'), 10) : 0;
    openLightbox(isNaN(realIndex) ? 0 : realIndex);
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target.classList.contains('premium8-lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  if (mobileQuery && typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', function (event) {
      if (!event.matches && overlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }
})();

(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var cards = document.querySelectorAll('.properties-N6 .n6-hide-mobile .n6-location-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    var images = Array.prototype.slice.call(card.querySelectorAll('.n6-location-main > img'));
    var excludedArea = card.querySelector('.n6-location-sub-card');
    if (!images.length) return;

    var lens = document.createElement('div');
    lens.className = 'n6-magnifier-lens';
    card.appendChild(lens);

    var zoom = 1.85;

    function getActiveImage(clientX, clientY) {
      for (var i = 0; i < images.length; i += 1) {
        var rect = images[i].getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          return images[i];
        }
      }
      return images[0];
    }

    function syncLensImage(targetImg) {
      var src = targetImg.currentSrc || targetImg.src;
      if (src && lens.dataset.src !== src) {
        lens.style.backgroundImage = 'url("' + src + '")';
        lens.dataset.src = src;
      }
    }

    function moveLens(event) {
      if (excludedArea) {
        var excludedRect = excludedArea.getBoundingClientRect();
        var isExcluded =
          event.clientX >= excludedRect.left &&
          event.clientX <= excludedRect.right &&
          event.clientY >= excludedRect.top &&
          event.clientY <= excludedRect.bottom;
        if (isExcluded) {
          card.classList.remove('is-magnifying');
          return;
        }
      }

      var cardRect = card.getBoundingClientRect();
      var size = lens.offsetWidth || 190;
      var radius = size / 2;
      var x = event.clientX - cardRect.left;
      var y = event.clientY - cardRect.top;
      var clampedX = Math.max(radius, Math.min(cardRect.width - radius, x));
      var clampedY = Math.max(radius, Math.min(cardRect.height - radius, y));
      var activeImg = getActiveImage(event.clientX, event.clientY);
      var imgRect = activeImg.getBoundingClientRect();
      var imgX = Math.max(0, Math.min(imgRect.width, event.clientX - imgRect.left));
      var imgY = Math.max(0, Math.min(imgRect.height, event.clientY - imgRect.top));

      syncLensImage(activeImg);
      lens.style.left = clampedX + 'px';
      lens.style.top = clampedY + 'px';
      lens.style.backgroundSize = imgRect.width * zoom + 'px ' + imgRect.height * zoom + 'px';
      lens.style.backgroundPosition =
        (-imgX * zoom + radius) + 'px ' + (-imgY * zoom + radius) + 'px';
    }

    syncLensImage(images[0]);

    card.addEventListener('mouseenter', function (event) {
      card.classList.add('is-magnifying');
      moveLens(event);
    });

    card.addEventListener('mousemove', function (event) {
      card.classList.add('is-magnifying');
      moveLens(event);
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-magnifying');
    });
  });
})();

(function () {
  function initUnitTypes() {
    var root = document.querySelector('[data-unit-types]');
    if (!root) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll('.unit-types-tab'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.unit-types-panel'));
    var bars = Array.prototype.slice.call(root.querySelectorAll('.unit-types-progress-bar'));
    var current = root.querySelector('.unit-types-current');
    var prev = root.querySelector('.unit-types-prev');
    var next = root.querySelector('.unit-types-next');
    var stage = root.querySelector('.unit-types-swiper');
    if (!tabs.length || !panels.length) return;

    var activeIndex = Math.max(0, tabs.findIndex(function (tab) {
      return tab.classList.contains('is-active');
    }));
    var swiper = null;
    var magnifier = null;
    var magnifierZoom = 2.15;

    function syncActive(index, shouldFocus, fromSwiper) {
      activeIndex = (index + tabs.length) % tabs.length;

      tabs.forEach(function (tab, idx) {
        var isActive = idx === activeIndex;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach(function (panel, idx) {
        var isActive = idx === activeIndex;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (!swiper) {
          panel.hidden = !isActive;
        } else {
          panel.hidden = false;
        }
      });

      bars.forEach(function (bar, idx) {
        bar.classList.toggle('is-active', idx === activeIndex);
      });

      if (current) {
        current.textContent = tabs[activeIndex].dataset.type || tabs[activeIndex].textContent.trim();
      }

      if (shouldFocus) {
        tabs[activeIndex].focus();
      }

      if (swiper && !fromSwiper) {
        if (typeof swiper.slideToLoop === 'function') {
          swiper.slideToLoop(activeIndex);
        } else if (swiper.activeIndex !== activeIndex) {
          swiper.slideTo(activeIndex);
        }
      }
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        syncActive(idx, false, false);
      });

      tab.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          syncActive(activeIndex - 1, true, false);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          syncActive(activeIndex + 1, true, false);
        } else if (event.key === 'Home') {
          event.preventDefault();
          syncActive(0, true, false);
        } else if (event.key === 'End') {
          event.preventDefault();
          syncActive(tabs.length - 1, true, false);
        }
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        if (swiper) {
          swiper.slidePrev();
        } else {
          syncActive(activeIndex - 1, false, false);
        }
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        if (swiper) {
          swiper.slideNext();
        } else {
          syncActive(activeIndex + 1, false, false);
        }
      });
    }

    function hideMagnifier() {
      if (!stage) return;
      stage.classList.remove('is-magnifying');
    }

    function getActiveUnitImage(clientX, clientY) {
      if (!stage) return null;
      var activeImages = Array.prototype.slice.call(stage.querySelectorAll('.unit-types-panel.swiper-slide-active img'));
      if (!activeImages.length) {
        activeImages = Array.prototype.slice.call(stage.querySelectorAll('.unit-types-panel.is-active img'));
      }

      for (var i = 0; i < activeImages.length; i += 1) {
        var rect = activeImages[i].getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          return {
            image: activeImages[i],
            rect: rect
          };
        }
      }

      return null;
    }

    function moveMagnifier(event) {
      if (!stage || !magnifier || stage.classList.contains('is-dragging')) {
        hideMagnifier();
        return;
      }

      var target = getActiveUnitImage(event.clientX, event.clientY);
      if (!target) {
        hideMagnifier();
        return;
      }

      var imgRect = target.rect;
      var xRatio = (event.clientX - imgRect.left) / imgRect.width;
      var yRatio = (event.clientY - imgRect.top) / imgRect.height;
      var isUnitFeatureArea =
        xRatio >= 0.64 &&
        xRatio <= 0.99 &&
        yRatio >= 0.56 &&
        yRatio <= 0.98;

      if (!isUnitFeatureArea) {
        hideMagnifier();
        return;
      }

      var stageRect = stage.getBoundingClientRect();
      var lensSize = magnifier.offsetWidth || 240;
      var radius = lensSize / 2;
      var rawX = event.clientX - stageRect.left;
      var rawY = event.clientY - stageRect.top;
      var clampedX = Math.max(radius, Math.min(stageRect.width - radius, rawX));
      var clampedY = Math.max(radius, Math.min(stageRect.height - radius, rawY));
      var imgX = Math.max(0, Math.min(imgRect.width, event.clientX - imgRect.left));
      var imgY = Math.max(0, Math.min(imgRect.height, event.clientY - imgRect.top));
      var src = target.image.currentSrc || target.image.src;

      if (src && magnifier.dataset.src !== src) {
        magnifier.style.backgroundImage = 'url("' + src + '")';
        magnifier.dataset.src = src;
      }

      magnifier.style.left = clampedX + 'px';
      magnifier.style.top = clampedY + 'px';
      magnifier.style.backgroundSize = imgRect.width * magnifierZoom + 'px ' + imgRect.height * magnifierZoom + 'px';
      magnifier.style.backgroundPosition =
        (-imgX * magnifierZoom + radius) + 'px ' + (-imgY * magnifierZoom + radius) + 'px';
      stage.classList.add('is-magnifying');
    }

    if (stage && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      magnifier = document.createElement('div');
      magnifier.className = 'unit-types-magnifier-lens';
      stage.appendChild(magnifier);
      stage.addEventListener('mousemove', moveMagnifier);
      stage.addEventListener('mouseleave', hideMagnifier);
    }

    if (stage && typeof Swiper !== 'undefined') {
      swiper = new Swiper(stage, {
        slidesPerView: 1,
        spaceBetween: 22,
        speed: 1040,
        loop: true,
        loopAdditionalSlides: 2,
        grabCursor: true,
        simulateTouch: true,
        threshold: 8,
        resistanceRatio: 0.18,
        longSwipesRatio: 0.22,
        longSwipesMs: 320,
        followFinger: true,
        on: {
          init: function () {
            syncActive(this.realIndex || 0, false, true);
          },
          slideChange: function () {
            syncActive(this.realIndex || 0, false, true);
          },
          touchStart: function () {
            hideMagnifier();
            stage.classList.add('is-dragging');
          },
          touchEnd: function () {
            stage.classList.remove('is-dragging');
          },
          transitionEnd: function () {
            stage.classList.remove('is-dragging');
            hideMagnifier();
          }
        }
      });
    }

    syncActive(activeIndex, false, false);
    initUnitTypesReveal(root);
    initUnitTypesLightbox(root, swiper, panels, tabs, syncActive);
  }

  function initUnitTypesReveal(root) {
    if (!root) return;

    var section = root.closest('.unit-types-section');
    if (!section) return;

    var items = Array.prototype.slice.call(
      section.querySelectorAll('.unit-types-head, .unit-types-tabs, .unit-types-view, .unit-types-status')
    );
    if (!items.length) return;

    section.classList.add('reveal-ready');

    var revealItem = function(item, idx) {
      window.setTimeout(function() {
        item.classList.add('in-view');
      }, idx * 100);
    };

    if (!('IntersectionObserver' in window)) {
      items.forEach(function(item, idx) {
        revealItem(item, idx);
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var itemIndex = items.indexOf(entry.target);
        revealItem(entry.target, itemIndex > -1 ? itemIndex : 0);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    items.forEach(function(item) {
      observer.observe(item);
    });
  }

  function initUnitTypesLightbox(root, unitSwiper, sourcePanels, tabs, syncActive) {
    if (!root || typeof Swiper === 'undefined') return;

    var stage = root.querySelector('.unit-types-stage');
    var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 992px)') : null;
    if (!stage) return;

    var sourceMap = [];
    sourcePanels.forEach(function(panel, index) {
      var img = panel.querySelector('img');
      if (!img) return;

      var tab = tabs[index];
      var label = tab ? (tab.dataset.type || tab.textContent.trim()) : ('TYPE ' + (index + 1));
      sourceMap[index] = {
        src: img.currentSrc || img.src,
        alt: img.alt || (label + ' 타입 안내')
      };
    });
    sourceMap = sourceMap.filter(Boolean);
    if (!sourceMap.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'unit-types-lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="unit-types-lightbox-inner" role="dialog" aria-modal="true" aria-label="유닛타입 이미지 확대 보기">' +
        '<button type="button" class="unit-types-lightbox-close" aria-label="닫기">&times;</button>' +
        '<div class="unit-types-lightbox-swiper swiper"><div class="swiper-wrapper"></div><div class="unit-types-lightbox-pagination swiper-pagination"></div></div>' +
      '</div>';

    var wrapper = overlay.querySelector('.swiper-wrapper');
    sourceMap.forEach(function(item) {
      var slide = document.createElement('div');
      var zoomContainer = document.createElement('div');
      var image = document.createElement('img');

      slide.className = 'swiper-slide';
      zoomContainer.className = 'swiper-zoom-container';
      image.src = item.src;
      image.alt = item.alt;
      zoomContainer.appendChild(image);
      slide.appendChild(zoomContainer);
      wrapper.appendChild(slide);
    });
    document.body.appendChild(overlay);

    var lightboxSwiper = new Swiper(overlay.querySelector('.unit-types-lightbox-swiper'), {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 320,
      zoom: {
        maxRatio: 4,
        minRatio: 1,
        toggle: true
      },
      pagination: {
        el: overlay.querySelector('.unit-types-lightbox-pagination'),
        clickable: true
      },
      on: {
        slideChangeTransitionStart: function() {
          if (this.zoom && typeof this.zoom.out === 'function') {
            this.zoom.out();
          }
          if (typeof syncActive === 'function') {
            syncActive(this.realIndex || 0, false, false);
          }
        }
      }
    });

    function closeLightbox() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('unit-types-lightbox-open');
      document.body.classList.remove('unit-types-lightbox-open');
      if (lightboxSwiper.zoom && typeof lightboxSwiper.zoom.out === 'function') {
        lightboxSwiper.zoom.out();
      }
    }

    function openLightbox(index) {
      if (mobileQuery && !mobileQuery.matches) return;
      lightboxSwiper.slideToLoop(index, 0);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('unit-types-lightbox-open');
      document.body.classList.add('unit-types-lightbox-open');
    }

    var touchStartX = 0;
    var touchStartY = 0;
    var touchMoved = false;

    stage.addEventListener('touchstart', function(event) {
      var touch = event.touches && event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchMoved = false;
    }, { passive: true });

    stage.addEventListener('touchmove', function(event) {
      var touch = event.touches && event.touches[0];
      if (!touch) return;
      if (Math.abs(touch.clientX - touchStartX) > 10 || Math.abs(touch.clientY - touchStartY) > 10) {
        touchMoved = true;
      }
    }, { passive: true });

    stage.addEventListener('click', function(event) {
      if (mobileQuery && !mobileQuery.matches) return;
      if (touchMoved || (unitSwiper && unitSwiper.allowClick === false)) {
        touchMoved = false;
        return;
      }

      var panel = event.target.closest('.unit-types-panel');
      if (!panel) return;

      event.preventDefault();
      var realIndex = parseInt(panel.getAttribute('data-swiper-slide-index'), 10);
      if (isNaN(realIndex)) {
        realIndex = sourcePanels.indexOf(panel);
      }
      openLightbox(realIndex < 0 || isNaN(realIndex) ? 0 : realIndex);
    });

    overlay.addEventListener('click', function(event) {
      if (event.target === overlay || event.target.classList.contains('unit-types-lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    if (mobileQuery && typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', function(event) {
        if (!event.matches && overlay.classList.contains('is-open')) {
          closeLightbox();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnitTypes);
  } else {
    initUnitTypes();
  }
})();

(function () {
  var wrap = document.querySelector('.landscape-swiper');
  if (!wrap || typeof Swiper === 'undefined') return;

  var landscape = new Swiper(wrap, {
    slidesPerView: 1,
    spaceBetween: 18,
    centeredSlides: false,
    loop: true,
    speed: 650,
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.landscape-pagination',
      clickable: true
    },
    navigation: {
      prevEl: '.landscape-prev',
      nextEl: '.landscape-next'
    },
    breakpoints: {
      640: { slidesPerView: 1, spaceBetween: 18, centeredSlides: false },
      993: { slidesPerView: 1, spaceBetween: 22, centeredSlides: false },
      1360: { slidesPerView: 1, spaceBetween: 24, centeredSlides: false }
    }
  });

  document.querySelector('.landscape-prev').addEventListener('click', function(){ landscape.slidePrev(); });
  document.querySelector('.landscape-next').addEventListener('click', function(){ landscape.slideNext(); });
})();
