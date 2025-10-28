// ========================================
// CONFIGURACIÓN INICIAL
// ========================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initNavbarEffects();
    initActiveNavLinks();
    initCardAnimations();
    initMenuToggle();
    initBackToTop();
    initLazyLoading();
});

// ========================================
// SMOOTH SCROLL PARA ENLACES
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Si es solo "#", no hacer nada
            if (targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Scroll suave al elemento
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Cerrar el navbar en móvil después de hacer clic
                closeNavbarOnMobile();

                // Actualizar URL sin recargar
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Función auxiliar para cerrar navbar en móvil
function closeNavbarOnMobile() {
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    }
}

// ========================================
// EFECTOS DEL NAVBAR AL HACER SCROLL
// ========================================
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar-custom');
    let lastScroll = 0;

    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;

        // Agregar clase 'scrolled' cuando se hace scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, 100));
}

// ========================================
// MARCAR LINK ACTIVO EN NAVBAR
// ========================================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', throttle(() => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Ajustar el offset para tener en cuenta el navbar fijo
            if (window.pageYOffset >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Actualizar clase active en los links
        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ========================================
// ANIMACIONES DE ENTRADA PARA TARJETAS
// ========================================
function initCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadir un pequeño delay para efecto escalonado
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, index * 50);

                // Dejar de observar este elemento
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con data-aos
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// TOGGLE MENÚ COMPLETO EN MÓVIL
// ========================================
function initMenuToggle() {
    const toggleButton = document.getElementById('toggle-menu');
    const platosContainer = document.getElementById('platos-container');
    const toggleText = document.getElementById('toggle-text');
    const toggleIcon = document.getElementById('toggle-icon');

    if (!toggleButton || !platosContainer) return;

    let menuCompleto = false;

    toggleButton.addEventListener('click', function () {
        menuCompleto = !menuCompleto;

        if (menuCompleto) {
            // Mostrar todas las tarjetas
            platosContainer.classList.add('show-extra');
            toggleText.textContent = 'Ver Menú Reducido';
            toggleIcon.classList.remove('bi-chevron-down');
            toggleIcon.classList.add('bi-chevron-up');

            // Animar las tarjetas que aparecen
            const extraCards = document.querySelectorAll('.card-extra');
            extraCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        } else {
            // Ocultar tarjetas extra
            platosContainer.classList.remove('show-extra');
            toggleText.textContent = 'Ver Menú Completo';
            toggleIcon.classList.remove('bi-chevron-up');
            toggleIcon.classList.add('bi-chevron-down');

            // Scroll suave a la sección de menú
            document.getElementById('menu').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ========================================
// BOTÓN "VOLVER ARRIBA"
// ========================================
function initBackToTop() {
    const btnVolverArriba = document.getElementById('btnVolverArriba');

    if (!btnVolverArriba) return;

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 400) {
            btnVolverArriba.classList.add('show');
            btnVolverArriba.style.display = 'block';
        } else {
            btnVolverArriba.classList.remove('show');
            // Esperar a que termine la transición antes de ocultar
            setTimeout(() => {
                if (!btnVolverArriba.classList.contains('show')) {
                    btnVolverArriba.style.display = 'none';
                }
            }, 300);
        }
    }, 100));

    // Acción al hacer clic
    btnVolverArriba.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// LAZY LOADING PARA IMÁGENES
// ========================================
function initLazyLoading() {
    // Navegadores modernos soportan loading="lazy" nativamente
    // Esta función es un fallback para navegadores antiguos

    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        return;
    }

    // Fallback para navegadores antiguos
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// UTILIDADES
// ========================================

// Función throttle para optimizar eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Función debounce (alternativa a throttle)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// MANEJO DE FORMULARIOS (EJEMPLO)
// ========================================

// Ejemplo de validación de newsletter
const newsletterForm = document.querySelector('footer form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        // Validación básica de email
        if (validateEmail(email)) {
            // Aquí iría la lógica para enviar el email
            showNotification('¡Gracias por suscribirte!', 'success');
            emailInput.value = '';
        } else {
            showNotification('Por favor, ingresa un email válido', 'error');
        }
    });
}

// Función de validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'warning'} position-fixed top-0 start-50 translate-middle-x mt-5`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.textContent = message;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// PERFORMANCE: PRELOAD DE IMÁGENES IMPORTANTES
// ========================================
function preloadImages() {
    const importantImages = [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop'
    ];

    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Llamar a preload cuando la página esté casi cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// ========================================
// DETECCIÓN DE DISPOSITIVO
// ========================================
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);

    document.body.classList.add(
        isMobile ? 'is-mobile' :
            isTablet ? 'is-tablet' :
                'is-desktop'
    );
}

detectDevice();

// ========================================
// MANEJO DE BOTONES "ORDENAR"
// ========================================
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-success') && e.target.textContent.includes('Ordenar')) {
        e.preventDefault();

        const card = e.target.closest('.card-plato');
        const platilloNombre = card.querySelector('.card-title').textContent;

        showNotification(`"${platilloNombre}" agregado al carrito 🛒`, 'success');

        // Efecto visual en el botón
        const btn = e.target.closest('.btn-success');
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i> Agregado';
        btn.classList.add('btn-warning');
        btn.classList.remove('btn-success');

        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-cart-plus me-2"></i> Ordenar';
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-success');
        }, 2000);
    }
});

// ========================================
// LOGS DE DESARROLLO (remover en producción)
// ========================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🍽️ Sabor Salvadoreño - Modo Desarrollo');
    console.log('✅ Todos los módulos cargados correctamente');
}

// ========================================
// EXPORTAR FUNCIONES (si se usa módulos ES6)
// ========================================
// export { throttle, debounce, validateEmail, showNotification };