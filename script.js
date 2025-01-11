// Hero Section Animations
gsap.to(".hero h1", {
    opacity: 1,
    y: -50,
    duration: 1,
    delay: 0.5
});
gsap.to(".hero p", {
    opacity: 1,
    y: -50,
    duration: 1,
    delay: 1
});
gsap.to(".hero .btn", {
    opacity: 1,
    y: -50,
    duration: 1,
    delay: 1.5
});

// Task Animation (Nanobot Simulations)
document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('mouseenter', () => {
        gsap.to(task, {
            scale: 1.1,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            duration: 0.3
        });
    });
    task.addEventListener('mouseleave', () => {
        gsap.to(task, {
            scale: 1,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            duration: 0.3
        });
    });
});

// Timeline Scroll Animations
anime({
    targets: '.timeline-item',
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(300),
    duration: 1000,
    easing: 'easeOutExpo'
});

// Smooth Scroll
document.querySelector('.btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#main-content').scrollIntoView({ behavior: 'smooth' });
});
