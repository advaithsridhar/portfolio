// ===============================
// 🚀 Portfolio Script – Advaith H S
// Optimized Twinkling Starfield (Mouse + Scroll Parallax)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");
    const resumeModal = document.getElementById("resume-modal");
    const resumeButton = document.getElementById("resume-btn");
    const modalClose = document.querySelector(".modal-close");

    // ==== THEME TOGGLE ====
    function updateToggleUI(isLight) {
        if (!themeToggle) return;
        const sun = themeToggle.querySelector(".fa-sun");
        const moon = themeToggle.querySelector(".fa-moon");
        if (sun) sun.style.display = isLight ? "inline-block" : "none";
        if (moon) moon.style.display = isLight ? "none" : "inline-block";
    }

    function applyTheme(isLight) {
        if (isLight) body.classList.add("light-mode");
        else body.classList.remove("light-mode");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        updateToggleUI(isLight);

        // Cross-fade transition between themes
        targetOpacity = 0; // fade out
        setTimeout(() => {
            resetStars();     // reinitialize stars for new theme
            targetOpacity = 1; // fade back in
        }, 400);
    }

    const saved = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const startLight = saved ? saved === "light" : prefersLight;
    applyTheme(startLight);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = !body.classList.contains("light-mode");
            applyTheme(isLight);
        });
    }

    // ==== RESUME MODAL ====
    if (resumeButton && resumeModal) {
        resumeButton.addEventListener("click", () => (resumeModal.style.display = "flex"));
    }
    if (modalClose) {
        modalClose.addEventListener("click", () => (resumeModal.style.display = "none"));
    }
    window.addEventListener("click", (e) => {
        if (e.target === resumeModal) resumeModal.style.display = "none";
    });
});

// ===============================
// 🌌 OPTIMIZED STARFIELD (Twinkling + Mouse + Scroll)
// ===============================

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d", { alpha: false });
canvas.style.willChange = "transform";

let stars = [];
let numStars = Math.min(800, window.innerWidth * 0.5); // adaptive count
let parallaxX = 0, parallaxY = 0;
let targetX = 0, targetY = 0;
let scrollOffset = 0;
let lastFrame = 0;
let gradientDark, gradientLight;
let starfieldOpacity = 0; // For fade-in
let targetOpacity = 1;    // Adjusts for cross-fade



// Resize + reinit
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cache gradients
    gradientDark = "#000";
    gradientLight = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientLight.addColorStop(0, "#f5f9ff");
    gradientLight.addColorStop(1, "#d6edff");
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Initialize stars
function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width,
            opacity: Math.random(),
            fadeSpeed: 0.002 + Math.random() * 0.002,
        });
    }
}

// Draw loop (with throttling)
function drawStars(timestamp) {
    const delta = timestamp - lastFrame;
    if (delta < 16) { // limit to ~60fps
        requestAnimationFrame(drawStars);
        return;
    }
    lastFrame = timestamp;

    const body = document.body;
    const isLight = body.classList.contains("light-mode");

    // Use cached gradients
    ctx.fillStyle = isLight ? gradientLight : gradientDark;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Parallax smoothing
    parallaxX += (targetX - parallaxX) * 0.05;
    parallaxY += (targetY - parallaxY) * 0.05;
    const scrollInfluence = scrollOffset * 0.1;

    // Reduce intensity on mobile
    const parallaxScale = window.innerWidth < 768 ? 15 : 30;
    const cx = canvas.width / 2 + parallaxX * parallaxScale;
    const cy = canvas.height / 2 + parallaxY * parallaxScale - scrollInfluence;

    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= 1.2;
        if (s.z <= 0) s.z = canvas.width;

        // Twinkle effect
        s.opacity += s.fadeSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (s.opacity > 1) s.opacity = 1;
        if (s.opacity < 0.1) s.opacity = 0.1;

        const k = 128.0 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            const size = (1 - s.z / canvas.width) * 2;
            let color;
            if (isLight) {
                const pastelColors = ["#a0d8ef", "#f7c6ff", "#ffe6b3", "#b8f7d4"];
                color = pastelColors[i % pastelColors.length];
                ctx.fillStyle = color;
                ctx.globalAlpha = s.opacity * 0.8;
            } else {
                ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
                ctx.globalAlpha = s.opacity;
            }
            ctx.fillRect(px, py, size, size);
        }
    }

    // Fade-in effect for the whole field
    // === Smooth Fade ===
    starfieldOpacity += (targetOpacity - starfieldOpacity) * 0.05;
    canvas.style.opacity = starfieldOpacity;
    ctx.globalAlpha = 1;


    requestAnimationFrame(drawStars);

}

// Theme reset
function resetStars() {
    initStars();
}

// Parallax Events
window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener("scroll", () => {
    scrollOffset = window.scrollY / window.innerHeight;
});

// Start
// 🌙 Lazy start animation for performance
window.addEventListener("load", () => {
    setTimeout(() => {
        initStars();
        requestAnimationFrame(drawStars);
    }, 800); // wait ~0.8s after full load
});

// Also start if user interacts early (scroll or move)
let started = false;
function startOnUserAction() {
    if (started) return;
    started = true;
    initStars();
    requestAnimationFrame(drawStars);
}
window.addEventListener("scroll", startOnUserAction, { once: true });
window.addEventListener("mousemove", startOnUserAction, { once: true });
window.addEventListener("touchstart", startOnUserAction, { once: true });


window.addEventListener('load', () => {
    const navbar = document.querySelector('.navbar');
    navbar?.classList.add('animate');
});

// ==== ACTIVE NAV LINK ON SCROLL ====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navHeight = document.querySelector('.header').offsetHeight;

function changeNavOnScroll() {
    let currentSectionId = '';

    // Find the current section
    // We add a small offset (1.5 * navHeight) to activate the link a bit before the section top
    sections.forEach(section => {
        const sectionTop = section.offsetTop - (1.5 * navHeight);
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Special case for hero section (top of page)
    if (window.scrollY < sections[0].offsetTop - navHeight) {
        currentSectionId = sections[0].getAttribute('id');
    }

    // Update nav links
    navLinks.forEach(link => {
        const parentItem = link.closest('.nav-item');
        link.classList.remove('active');
        parentItem?.classList.remove('active');

        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
            parentItem?.classList.add('active');
        }
    });


}

window.addEventListener('scroll', changeNavOnScroll);
changeNavOnScroll(); // Initial check on load

// ==== SMOOTH SCROLLING FOR NAV LINKS ====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate position to scroll to, accounting for the fixed header
            const targetPosition = targetElement.offsetTop - navHeight + 2; // +2 for a small buffer

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==== SCROLL-TO-REVEAL ANIMATION ====
const fadeElements = document.querySelectorAll('.fade-in');

const revealOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Stop observing after it's visible
            // observer.unobserve(entry.target); 
        }
    });
};

const sectionObserver = new IntersectionObserver(revealOnScroll, {
    root: null, // relative to the viewport
    threshold: 0.1, // 10% of the item must be visible
    rootMargin: "0px 0px -50px 0px" // trigger a bit earlier
});

fadeElements.forEach(el => {
    sectionObserver.observe(el);
});

// ==== NAVBAR PHOTO SCROLL ANIMATION ====
const heroPhoto = document.querySelector('.hero-photo');
const navPhoto = document.querySelector('.nav-photo');
let photoInNavbar = false;

window.addEventListener('scroll', () => {
    const heroBottom = heroPhoto.getBoundingClientRect().bottom;

    if (heroBottom < 100 && !photoInNavbar) {
        // Move photo to navbar
        navPhoto.classList.remove('hidden');
        setTimeout(() => navPhoto.classList.add('visible'), 50);
        heroPhoto.style.opacity = '0';
        photoInNavbar = true;
    }
    else if (heroBottom >= 100 && photoInNavbar) {
        // Move back to hero section
        navPhoto.classList.remove('visible');
        setTimeout(() => navPhoto.classList.add('hidden'), 400);
        heroPhoto.style.opacity = '1';
        photoInNavbar = false;
    }
});


// ==== RESUME MODAL ====
const viewResumeBtn = document.getElementById('viewResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const closeModal = document.querySelector('.close-modal');

viewResumeBtn.addEventListener('click', () => {
    resumeModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    resumeModal.style.display = 'none';
});

// Close when clicking outside modal
window.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
        resumeModal.style.display = 'none';
    }
});

// ==== NAVBAR VIEW RESUME ICON ====
const navResumeView = document.getElementById('navResumeView');
if (navResumeView) {
    navResumeView.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.style.display = 'flex';
    });
}

// ==== HERO TYPING EFFECT ====
const roles = [
    "Computer Science and Design Student",
    "Web Developer",
    "Python Programmer",
    "Creative Coder"
];

let roleIndex = 0;
let charIndex = 0;
const typedText = document.getElementById("typed-text");
const cursor = document.querySelector(".cursor");

function typeEffect() {
    if (charIndex < roles[roleIndex].length) {
        typedText.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {
    if (charIndex > 0) {
        typedText.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 400);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeEffect, 1000);
});

// ==== SKILL TILE FADE-IN ON SCROLL ====
const skillTiles = document.querySelectorAll('.skill-item');

const showSkillTiles = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const skillTileObserver = new IntersectionObserver(showSkillTiles, {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
});

skillTiles.forEach(tile => skillTileObserver.observe(tile));

// === Revolving Color Background ===
const bg = document.getElementById("bg-animation");
for (let i = 0; i < 3; i++) {
    const sphere = document.createElement("div");
    sphere.classList.add("bg-sphere");
    sphere.style.left = `${Math.random() * 100}%`;
    sphere.style.top = `${Math.random() * 100}%`;
    sphere.style.animationDelay = `${i * 5}s`;
    bg.appendChild(sphere);
}

window.addEventListener("mousemove", e => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    bg.style.transform = `rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
});

