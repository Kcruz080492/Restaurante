 // ===== SMOOTH SCROLL PARA ENLACES =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Cerrar el navbar en móvil después de hacer clic
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });

        // ===== EFECTO DE SCROLL EN NAVBAR =====
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar-custom');
            const btnVolverArriba = document.getElementById('btnVolverArriba');

            // Cambiar padding del navbar
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
            } else {
                navbar.style.padding = '15px 0';
            }

            // Mostrar/ocultar botón "Volver arriba"
            if (window.scrollY > 300) {
                btnVolverArriba.style.display = 'block';
            } else {
                btnVolverArriba.style.display = 'none';
            }
        });

        // ===== MARCAR LINK ACTIVO EN NAVBAR =====
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // ===== ANIMACIÓN DE ENTRADA PARA TARJETAS =====
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'all 0.6s ease';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card-plato').forEach(card => {
            observer.observe(card);
        });

        //=== Ocultar las tarjetas en movil 
        document.addEventListener('DOMContentLoaded', function () {
            const toggleButton = document.getElementById('toggle-menu');
            const platosContainer = document.getElementById('platos-container');
            let menuCompleto = false;

            // Alternar menú completo en móvil
            toggleButton.addEventListener('click', function () {
                if (menuCompleto) {
                    platosContainer.classList.remove('show-extra');
                    toggleButton.textContent = 'Ver Menú Completo 📄';
                } else {
                    platosContainer.classList.add('show-extra');
                    toggleButton.textContent = 'Ver Menú Reducido 📄';
                }
                menuCompleto = !menuCompleto;
            });
        });