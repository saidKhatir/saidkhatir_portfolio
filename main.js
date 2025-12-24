// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const interactiveSection = document.querySelector('.interactive-section');

// Initialize: show only 'carte' items by default
document.addEventListener('DOMContentLoaded', () => {
    portfolioItems.forEach(item => {
        const category = item.dataset.category;
        if (category === 'carte') {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
    
    interactiveSection.classList.add('hidden');
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        // Filter portfolio items
        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            if (category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Show/hide interactive section
        if (filter === 'interactive') {
            interactiveSection.classList.remove('hidden');
        } else {
            interactiveSection.classList.add('hidden');
        }
    });
});

// Modal functionality for images
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.item-image');
        modal.classList.add('active');
        modalImg.src = img.src;
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});