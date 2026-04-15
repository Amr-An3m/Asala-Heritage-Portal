/* Asala - Saudi Heritage Portal - Global Logic */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }, 1500);
    }

    // 2. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateThemeIcons();
    };

    const updateThemeIcons = () => {
        const isLight = document.documentElement.classList.contains('light');
        const updateBtn = (btn) => {
            if (!btn) return;
            const sun = btn.querySelector('[data-lucide="sun"]');
            const moon = btn.querySelector('[data-lucide="moon"]');
            if (sun && moon) {
                if (isLight) {
                    sun.classList.add('hidden');
                    moon.classList.remove('hidden');
                } else {
                    sun.classList.remove('hidden');
                    moon.classList.add('hidden');
                }
            }
        };
        updateBtn(themeToggleBtn);
        updateBtn(mobileThemeToggleBtn);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
    }
    
    // Defer icon creation slightly to ensure elements are available for manual toggle patches
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    updateThemeIcons(); // After lucide icons injected

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // 3. Sticky Navigation
    const header = document.getElementById('main-nav') || document.getElementById('navbar');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('bg-saudi-black/95', 'shadow-gold');
                header.classList.remove('bg-transparent', 'border-transparent');
                header.classList.add('border-saudi-gold/20');
            } else {
                header.classList.remove('bg-saudi-black/95', 'shadow-gold');
                header.classList.add('bg-transparent', 'border-transparent');
                header.classList.remove('border-saudi-gold/20');
            }
        });
    }

    // 4. Reveal on Scroll (mimicking framer-motion)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // remove tailwind classes that hide it
                entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-4', 'scale-90', 'scale-x-0', 'scale-y-0');
                // for some custom selectors
                entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'scale-x-100', 'scale-y-100');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Stats Counter Animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const targetValue = parseInt(targetEl.getAttribute('data-target'));
                const suffix = targetEl.getAttribute('data-suffix');
                
                let startValue = 0;
                const duration = 2500; // 2.5s
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // easeOutQuart
                    const easeOut = 1 - Math.pow(1 - progress, 4);
                    const currentVal = Math.floor(easeOut * targetValue);
                    
                    targetEl.textContent = currentVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        targetEl.textContent = targetValue + suffix;
                    }
                };

                requestAnimationFrame(updateCounter);
                statsObserver.unobserve(targetEl);
            }
        });
    }, { threshold: 0.5 });

    statsNumbers.forEach(el => statsObserver.observe(el));

    // 6. Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle') || document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay') || document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuToggle && mobileNavOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            // Check if it's the drawer (overlay) or dropdown
            if (mobileNavOverlay.id === 'mobile-nav-overlay') {
                mobileNavOverlay.classList.remove('hidden');
                requestAnimationFrame(() => {
                    mobileNavOverlay.querySelector('div:first-child').classList.remove('opacity-0');
                    mobileNavOverlay.querySelector('nav').classList.remove('translate-x-full');
                });
            } else {
                // Dropdown behavior
                mobileNavOverlay.classList.toggle('hidden');
            }
            document.body.style.overflow = mobileNavOverlay.classList.contains('hidden') ? 'auto' : 'hidden';
        });
    }

    const closeMobileMenu = () => {
        if (!mobileNavOverlay) return;
        if (mobileNavOverlay.id === 'mobile-nav-overlay') {
            const backdrop = mobileNavOverlay.querySelector('div:first-child');
            const drawer = mobileNavOverlay.querySelector('nav');
            if (backdrop) backdrop.classList.add('opacity-0');
            if (drawer) drawer.classList.add('translate-x-full');
            setTimeout(() => {
                mobileNavOverlay.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 300);
        } else {
            mobileNavOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // close if clicking overlay bg
    const backdrop = mobileNavOverlay ? mobileNavOverlay.querySelector('div:first-child') : null;
    if(backdrop && mobileNavOverlay && mobileNavOverlay.id === 'mobile-nav-overlay') {
        backdrop.addEventListener('click', closeMobileMenu);
    }

    // 7. Heritage Tabs Logic
    const heritageTabBtns = document.querySelectorAll('.heritage-tab-btn');
    const heritageContents = document.querySelectorAll('.heritage-tab-content');

    if (heritageTabBtns.length > 0) {
        heritageTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active state on buttons
                heritageTabBtns.forEach(b => {
                    b.classList.remove('bg-saudi-gold', 'text-saudi-black');
                    b.classList.add('bg-saudi-black-light', 'text-saudi-cream/70');
                });
                btn.classList.add('bg-saudi-gold', 'text-saudi-black');
                btn.classList.remove('bg-saudi-black-light', 'text-saudi-cream/70');

                // Switch content
                heritageContents.forEach(content => {
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            content.classList.replace('opacity-0', 'opacity-100');
                        });
                    } else {
                        content.classList.replace('opacity-100', 'opacity-0');
                        setTimeout(() => {
                            // Only hide if it hasn't somehow become active again
                            if (content.classList.contains('opacity-0')) {
                                content.classList.add('hidden');
                            }
                        }, 300);
                    }
                });
            });
        });
    }

    // 8. Landmarks Slider Logic
    const slides = document.querySelectorAll('.landmark-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const btnNext = document.getElementById('slider-next');
    const btnPrev = document.getElementById('slider-prev');
    let currentSlide = 0;

    if (slides.length > 0) {
        const updateSlider = (index) => {
            slides.forEach((slide, i) => {
                const content = slide.querySelector('.slide-content');
                if (i === index) {
                    slide.classList.replace('opacity-0', 'opacity-100');
                    slide.classList.replace('z-0', 'z-10');
                    content.classList.replace('translate-y-8', 'translate-y-0');
                    content.classList.replace('opacity-0', 'opacity-100');
                } else {
                    slide.classList.replace('opacity-100', 'opacity-0');
                    slide.classList.replace('z-10', 'z-0');
                    content.classList.replace('translate-y-0', 'translate-y-8');
                    content.classList.replace('opacity-100', 'opacity-0');
                }
            });
            
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.className = 'slider-dot w-8 h-3 rounded-full bg-saudi-gold transition-all';
                } else {
                    dot.className = 'slider-dot w-3 h-3 rounded-full bg-saudi-cream/30 hover:bg-saudi-cream/50 transition-all';
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider(currentSlide);
        };

        if (btnNext) btnNext.addEventListener('click', nextSlide);
        if (btnPrev) btnPrev.addEventListener('click', prevSlide);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider(currentSlide);
            });
        });
        
        // Ensure first slide is active immediately
        updateSlider(0);
    }

    // 9. Gallery Logic (Filtering & Lightbox)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const categoryBtns = document.querySelectorAll('.gallery-category-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxPrev = document.getElementById('lightbox-prev');

    let currentGalleryIndex = 0;
    let filteredGalleryItems = [...galleryItems];

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Active button state
                categoryBtns.forEach(b => {
                    b.classList.remove('bg-saudi-gold', 'text-saudi-black');
                    b.classList.add('bg-saudi-black-light', 'text-saudi-cream/70');
                });
                btn.classList.add('bg-saudi-gold', 'text-saudi-black');
                btn.classList.remove('bg-saudi-black-light', 'text-saudi-cream/70');

                // Filter items
                filteredGalleryItems = [];
                galleryItems.forEach(item => {
                    if (category === 'الكل' || item.getAttribute('data-category') === category) {
                        item.classList.remove('hidden');
                        filteredGalleryItems.push(item);
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    if (galleryItems.length > 0 && lightbox) {
        const openLightbox = (index) => {
            currentGalleryIndex = index;
            const item = filteredGalleryItems[index];
            if (!item) return;

            lightboxImg.src = item.getAttribute('data-src');
            lightboxTitle.textContent = item.getAttribute('data-title');
            lightboxDesc.textContent = item.getAttribute('data-desc');
            lightboxCategory.textContent = item.getAttribute('data-category');

            lightbox.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
            
            // Update nav buttons visibility
            lightboxPrev.style.opacity = currentGalleryIndex === 0 ? '0.3' : '1';
            lightboxPrev.style.pointerEvents = currentGalleryIndex === 0 ? 'none' : 'auto';
            lightboxNext.style.opacity = currentGalleryIndex === filteredGalleryItems.length - 1 ? '0.3' : '1';
            lightboxNext.style.pointerEvents = currentGalleryIndex === filteredGalleryItems.length - 1 ? 'none' : 'auto';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Find actual index in filtered list
                const actualIndex = filteredGalleryItems.indexOf(item);
                if (actualIndex !== -1) openLightbox(actualIndex);
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'auto';
            lightboxImg.src = '';
        });

        lightboxNext.addEventListener('click', () => {
            if (currentGalleryIndex < filteredGalleryItems.length - 1) {
                openLightbox(currentGalleryIndex + 1);
            }
        });

        lightboxPrev.addEventListener('click', () => {
            if (currentGalleryIndex > 0) {
                openLightbox(currentGalleryIndex - 1);
            }
        });

        // Close on backdrop click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightboxClose.click();
        });
    }

    // 10. Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Simulate loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin w-4.5 h-4.5"></i> جاري الإرسال...';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            setTimeout(() => {
                contactForm.classList.add('hidden');
                contactSuccess.classList.remove('hidden');
                
                // Reset after 5 seconds to show form again (optional simulation)
                setTimeout(() => {
                    contactSuccess.classList.add('hidden');
                    contactForm.classList.remove('hidden');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 5000);
            }, 1000);
        });
    }
});
