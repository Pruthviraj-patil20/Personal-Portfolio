document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon between bars and times
        const icon = menuIcon.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuIcon.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Navbar Sticky & Active State ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on load
    revealOnScroll();

    // --- Interactive Featured Project Cards Background & Parallax ---
    const featuredCards = document.querySelectorAll('.featured-project-card');
    featuredCards.forEach(card => {
        const light = card.querySelector('[class*="-interactive-light"]');
        const parallaxItems = card.querySelectorAll('[class*="-parallax-item"]');

        if (light || parallaxItems.length > 0) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (light) {
                    light.style.left = `${x}px`;
                    light.style.top = `${y}px`;
                }

                if (parallaxItems.length > 0) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const deltaX = (x - centerX) / centerX;
                    const deltaY = (y - centerY) / centerY;

                    parallaxItems.forEach(item => {
                        const speed = parseFloat(item.getAttribute('data-speed')) || 0.04;
                        const moveX = (deltaX * speed * 45).toFixed(2);
                        const moveY = (deltaY * speed * 45).toFixed(2);
                        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                parallaxItems.forEach(item => {
                    item.style.transform = 'translate3d(0px, 0px, 0)';
                });
            });
        }
    });

    // --- Welcome Intro Animation with Cinematic Sound ---
    const ENABLE_INTRO = true; // Set to false to disable the cinematic intro
    
    // --- Sound Manager ---
    class SoundManager {
        constructor() {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.isMuted = localStorage.getItem('portfolio_muted') === 'true';
            this.initialized = false;
            
            // Respect prefers-reduced-motion / accessibility
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) this.isMuted = true;
        }

        init() {
            if (this.initialized) return;
            // Resume context if suspended (browser policy)
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.initialized = true;
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            localStorage.setItem('portfolio_muted', this.isMuted);
            return this.isMuted;
        }

        playWhoosh(duration = 1, frequencyStart = 400, frequencyEnd = 50, volume = 0.1) {
            if (this.isMuted) return;
            this.init();

            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            // Create noise-like effect by modulating rapidly
            osc.type = 'sine';
            
            // Frequency sweep for whoosh
            osc.frequency.setValueAtTime(frequencyStart, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(frequencyEnd, this.ctx.currentTime + duration);
            
            // Envelope (Fade in and out)
            gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + (duration * 0.2));
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        }

        playImpact() {
            if (this.isMuted) return;
            this.init();

            // Low frequency impact
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.5);
        }
        
        playSparkle() {
            if (this.isMuted) return;
            this.init();
            
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
            
            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.2);
        }
    }
    
    const welcomeIntro = document.getElementById('welcome-intro');
    if (welcomeIntro) {
        if (!ENABLE_INTRO) {
            welcomeIntro.style.display = 'none';
        } else {
            const soundManager = new SoundManager();
            const soundToggleBtn = document.getElementById('intro-sound-toggle');
            
            // Initial toggle UI state
            if (soundToggleBtn) {
                const icon = soundToggleBtn.querySelector('i');
                if (soundManager.isMuted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                }
                
                // Toggle event listener
                soundToggleBtn.addEventListener('click', () => {
                    const isMuted = soundManager.toggleMute();
                    if (isMuted) {
                        icon.classList.remove('fa-volume-up');
                        icon.classList.add('fa-volume-mute');
                    } else {
                        icon.classList.remove('fa-volume-mute');
                        icon.classList.add('fa-volume-up');
                        soundManager.playSparkle(); // feedback sound
                    }
                });
            }

            // Prevent scrolling while intro is active
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);

            // Play startup whoosh shortly after load
            setTimeout(() => {
                soundManager.playWhoosh(1.5, 300, 50, 0.05);
            }, 300);

            // Stagger letter animations and sound impacts
            const letters = document.querySelectorAll('.intro-name .letter');
            letters.forEach((letter, index) => {
                const delayMs = 800 + (index * 50);
                letter.style.animationDelay = `${delayMs / 1000}s`;
                
                // Play tiny impact per letter
                setTimeout(() => {
                    if(index === 0 || index === letters.length - 1) {
                        soundManager.playImpact();
                    }
                }, delayMs);
            });
            
            // "PORTFOLIO" text appearance sound
            setTimeout(() => {
                soundManager.playSparkle();
            }, 1700);

            // Create background particles
            const particlesContainer = document.getElementById('intro-particles');
            if (particlesContainer) {
                const numParticles = 25;
                for (let i = 0; i < numParticles; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('intro-particle');
                    
                    // Randomize position, size, and animation delay
                    const size = Math.random() * 4 + 1;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
                    
                    particlesContainer.appendChild(particle);
                }
            }

            // Remove intro after sequence completes
            setTimeout(() => {
                soundManager.playWhoosh(1, 600, 100, 0.08); // Outro transition sound
                welcomeIntro.classList.add('hide');
                document.body.style.overflow = ''; // Restore scrolling
                
                // Remove from DOM after fade out completes
                setTimeout(() => {
                    welcomeIntro.remove();
                }, 800);
            }, 3800); // Wait for the whole animation sequence (2.3s loader + 1.5s delay)
        }
    }
    // --- Image Modal/Lightbox ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.cert-modal-close');
    
    // Select all overlay view buttons and images
    const overlayButtons = document.querySelectorAll('.cert-overlay .btn');
    const certImages = document.querySelectorAll('.cert-img');
    
    function openModal(imgSrc) {
        if (!modal) return;
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
        modalImg.src = imgSrc;
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); 
    }

    // Attach to overlay buttons
    overlayButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const imgSrc = certImages[index].src;
            openModal(imgSrc);
        });
    });
    
    // Attach directly to images as well
    certImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openModal(img.src);
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent 404/405 errors from POST to #
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.backgroundColor = '#10B981';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                contactForm.reset();
            }, 3000);
        });
    }
});
