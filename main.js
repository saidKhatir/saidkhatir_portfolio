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

    // Initialize timeline
    initTimeline();
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

// Timeline functionality
function initTimeline() {
    const timelineTrack = document.querySelector('.timeline-track');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const prevBtn = document.querySelector('.timeline-nav.prev');
    const nextBtn = document.querySelector('.timeline-nav.next');
    const dotsContainer = document.querySelector('.timeline-dots');
    
    let currentIndex = 0;

    // Create dots
    timelineItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('timeline-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.timeline-dot');

    function updateTimeline() {
        // Update track position
        timelineTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active states
        timelineItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === timelineItems.length - 1;
        
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }

        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateTimeline();
    }

    function nextSlide() {
        if (currentIndex < timelineItems.length - 1) {
            currentIndex++;
            updateTimeline();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateTimeline();
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    timelineTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    timelineTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }

    // Initialize
    updateTimeline();
}