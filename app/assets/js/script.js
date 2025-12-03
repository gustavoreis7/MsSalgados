// Configurações básicas da página
document.addEventListener('DOMContentLoaded', function () {
    setupSmoothScroll();
    setupResponsiveMenu();
    setupBackToTop();
});

function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Atualizar link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Fechar menu móvel se aberto
            const navList = document.getElementById('navList');
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                document.getElementById('menuToggle').innerHTML = '<i class="fas fa-bars"></i>';
            }

            // Rolar suavemente para a seção
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupResponsiveMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');

    if (!menuToggle || !navList) return;

    menuToggle.addEventListener('click', function () {
        navList.classList.toggle('active');
        this.innerHTML = navList.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Fechar menu ao clicar fora (para mobile)
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 &&
            !e.target.closest('.navbar') &&
            navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Ativar seção baseada na posição de rolagem
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('.menu-section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = '#' + section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSectionId) {
            link.classList.add('active');
        }
    });
});