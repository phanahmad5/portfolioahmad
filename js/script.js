/* ===================================================
   PORTFOLIO SCRIPT - AHMAD HOPAN KURNIA
   Lightweight, Clean, and Accessible
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const header = document.querySelector(".header");
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const scrollTopBtn = document.getElementById("scrollTop");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    /* ==============================================
       1. STICKY NAVBAR ON SCROLL
    ============================================== */
    const handleScrollHeader = () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScrollHeader, { passive: true });
    handleScrollHeader();

    /* ==============================================
       2. MOBILE NAVIGATION DRAWER
    ============================================== */
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("open");
            mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                if (isOpen) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navbar.classList.contains("open")) {
                    navbar.classList.remove("open");
                    const icon = mobileToggle.querySelector("i");
                    if (icon) {
                        icon.classList.remove("fa-xmark");
                        icon.classList.add("fa-bars");
                    }
                }
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener("click", (e) => {
            if (!header.contains(e.target) && navbar.classList.contains("open")) {
                navbar.classList.remove("open");
                const icon = mobileToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    /* ==============================================
       3. ACTIVE NAVIGATION LINK ON SCROLL
    ============================================== */
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    /* ==============================================
       4. SCROLL TO TOP BUTTON
    ============================================== */
    if (scrollTopBtn) {
        const toggleScrollBtn = () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        };

        window.addEventListener("scroll", toggleScrollBtn, { passive: true });
        toggleScrollBtn();

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ==============================================
       5. STATS COUNTER ANIMATION (ON VIEW)
    ============================================== */
    const statNumbers = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated || statNumbers.length === 0) return;

        const firstStat = statNumbers[0];
        const rect = firstStat.getBoundingClientRect();

        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const targetText = stat.innerText.trim();
                const numericValue = parseInt(targetText.replace(/\D/g, ""), 10);
                const suffix = targetText.replace(/[0-9]/g, "");

                if (isNaN(numericValue)) return;

                let start = 0;
                const duration = 1200;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quadratic
                    const currentVal = Math.floor(progress * (2 - progress) * numericValue);

                    stat.innerText = `${currentVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.innerText = targetText;
                    }
                };

                requestAnimationFrame(updateCount);
            });
        }
    };

    window.addEventListener("scroll", animateStats, { passive: true });
    animateStats();

    /* ==============================================
       6. CONTACT FORM HANDLING (Direct to Gmail via FormSubmit)
    ============================================== */
    if (contactForm) {
        let isSubmitting = false;

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (isSubmitting) return;

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const subjectInput = document.getElementById("subject");
            const messageInput = document.getElementById("message");

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const subject = subjectInput ? subjectInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || name.length < 2) {
                showFormStatus("Harap masukkan nama lengkap Anda (minimal 2 karakter).", "error");
                nameInput?.focus();
                return;
            }

            if (!email || !emailRegex.test(email)) {
                showFormStatus("Harap masukkan format alamat email yang valid (contoh: nama@domain.com).", "error");
                emailInput?.focus();
                return;
            }

            if (!message || message.length < 10) {
                showFormStatus("Pesan terlalu singkat. Harap tuliskan pesan Anda minimal 10 karakter.", "error");
                messageInput?.focus();
                return;
            }

            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Mengirim Pesan...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
            }

            try {
                const response = await fetch("https://formsubmit.co/ajax/phanahmad63@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: subject ? `[Portofolio] ${subject}` : `Pesan Baru Portofolio dari ${name}`,
                        message: message,
                        _template: "table"
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === true || data.success === "true")) {
                    showFormStatus("Terima kasih! Pesan Anda berhasil dikirim ke email saya. Saya akan segera merespons.", "success");
                    contactForm.reset();
                } else if (data.message && data.message.toLowerCase().includes("activate")) {
                    showFormStatus("FormSubmit membutuhkan aktivasi awal. Tautan aktivasi telah dikirim ke phanahmad63@gmail.com.", "success");
                    contactForm.reset();
                } else {
                    throw new Error(data.message || "Pengiriman pesan tidak berhasil");
                }
            } catch (error) {
                console.error("Form error:", error);
                showFormStatus("Maaf, terjadi kendala saat mengirim pesan secara otomatis. Silakan hubungi saya langsung melalui WhatsApp (08988160715) atau email phanahmad63@gmail.com.", "error");
            } finally {
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Kirim Pesan</span> <i class="fa-solid fa-paper-plane"></i>`;
                }

                setTimeout(() => {
                    if (formStatus && formStatus.classList.contains("success")) {
                        formStatus.style.display = "none";
                    }
                }, 8000);
            }
        });

        function showFormStatus(msg, type) {
            if (!formStatus) return;
            formStatus.className = `form-status-message ${type}`;
            formStatus.textContent = msg;
            formStatus.style.display = "block";
            formStatus.setAttribute("role", "status");
            formStatus.setAttribute("aria-live", "polite");
        }
    }

    /* ==============================================
       7. PROJECTS AUTO-SLIDER / CAROUSEL
    ============================================== */
    const carousel = document.getElementById("projectsCarousel");
    const track = document.getElementById("projectsTrack");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const dotsContainer = document.getElementById("carouselDots");
    const projectCards = document.querySelectorAll(".project-card");

    if (carousel && track && projectCards.length > 0) {
        // Calculate step width for 1 card scroll (width + gap)
        const getStepWidth = () => {
            const card = projectCards[0];
            const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
            return (card ? card.getBoundingClientRect().width : 300) + gap;
        };

        // Create pagination dots
        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            projectCards.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.className = `carousel-dot ${i === 0 ? "active" : ""}`;
                dot.setAttribute("aria-label", `Lihat Proyek ke-${i + 1}`);
                dot.setAttribute("aria-current", i === 0 ? "true" : "false");
                dot.addEventListener("click", () => {
                    stopAutoSlide();
                    if (projectCards[i]) {
                        projectCards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                    }
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateActiveDot = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll(".carousel-dot");
            const carouselRect = carousel.getBoundingClientRect();

            let activeIndex = 0;
            let minDistance = Infinity;

            projectCards.forEach((card, idx) => {
                const cardRect = card.getBoundingClientRect();
                const distance = Math.abs(cardRect.left - carouselRect.left);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = idx;
                }
            });

            dots.forEach((dot, idx) => {
                const isActive = idx === activeIndex;
                dot.classList.toggle("active", isActive);
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        };

        carousel.addEventListener("scroll", updateActiveDot, { passive: true });

        // Slide forward (bergeser ke kanan)
        const slideNext = () => {
            const step = getStepWidth();
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft >= maxScroll - 15) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: step, behavior: "smooth" });
            }
        };

        // Slide backward (bergeser ke kiri)
        const slidePrev = () => {
            const step = getStepWidth();
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft <= 15) {
                carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
            } else {
                carousel.scrollBy({ left: -step, behavior: "smooth" });
            }
        };

        // Auto slider logic (bergeser otomatis setiap 4 detik)
        let autoSlideTimer = null;
        const AUTO_INTERVAL = 4000;

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideTimer = setInterval(slideNext, AUTO_INTERVAL);
        };

        const stopAutoSlide = () => {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        };

        // Arrow button click handlers
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                stopAutoSlide();
                slideNext();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                stopAutoSlide();
                slidePrev();
                startAutoSlide();
            });
        }

        // Pause when mouse hovers over carousel or buttons
        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);

        // Accessibility: Pause when keyboard focus enters carousel
        carousel.addEventListener("focusin", stopAutoSlide);
        carousel.addEventListener("focusout", startAutoSlide);

        if (prevBtn) {
            prevBtn.addEventListener("mouseenter", stopAutoSlide);
            prevBtn.addEventListener("mouseleave", startAutoSlide);
            prevBtn.addEventListener("focus", stopAutoSlide);
            prevBtn.addEventListener("blur", startAutoSlide);
        }
        if (nextBtn) {
            nextBtn.addEventListener("mouseenter", stopAutoSlide);
            nextBtn.addEventListener("mouseleave", startAutoSlide);
            nextBtn.addEventListener("focus", stopAutoSlide);
            nextBtn.addEventListener("blur", startAutoSlide);
        }

        // Pause on touch devices
        carousel.addEventListener("touchstart", stopAutoSlide, { passive: true });
        carousel.addEventListener("touchend", () => {
            setTimeout(startAutoSlide, 2500);
        }, { passive: true });

        // Start auto-slider
        startAutoSlide();
    }
});
