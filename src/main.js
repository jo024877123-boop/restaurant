import { loadFromDB } from './firebase.js';

// ====================
// MOBILE MENU
// ====================
const mobileMenu = document.getElementById('mobile-menu');
const menuButton = document.querySelector('header button');

function toggleMobileMenu() {
    const spans = menuButton.querySelectorAll('span');

    if (mobileMenu.classList.contains('translate-x-full')) {
        // Open
        mobileMenu.classList.remove('translate-x-full');
        spans[0].classList.add('rotate-45', 'translate-y-2');
        spans[1].classList.add('opacity-0');
        document.body.style.overflow = 'hidden';
    } else {
        // Close
        mobileMenu.classList.add('translate-x-full');
        spans[0].classList.remove('rotate-45', 'translate-y-2');
        spans[1].classList.remove('opacity-0');
        document.body.style.overflow = '';
    }
}

if (menuButton) menuButton.addEventListener('click', toggleMobileMenu);


// ====================
// LOAD ADMIN DATA
// ====================

async function loadAdminData() {
    let siteData = null;

    try {
        siteData = await loadFromDB('siteData');

        // 데이터 정제 (로컬 경로 문제 해결)
        if (siteData) {
            const isDemoOrLocal = (url) => {
                if (!url) return false;
                return url.startsWith('file:') || url.startsWith('C:') || url.startsWith('/Users') || url.includes('images.unsplash.com');
            }

            // Hero Image Check
            if (siteData.hero && isDemoOrLocal(siteData.hero.image)) {
                siteData.hero.image = '/images/hero.png';
            }

            // Space Images Check
            if (siteData.space && siteData.space.images) {
                const defaultSpaces = ['/images/space1.png', '/images/space2.png', '/images/space3.png'];
                siteData.space.images = siteData.space.images.map((img, idx) =>
                    isDemoOrLocal(img) ? (defaultSpaces[idx] || img) : img
                );
            }

            // Menu Images Check
            if (siteData.menu && siteData.menu.images) {
                const defaultMenus = ['/images/menu1.png', '/images/menu2.png', '/images/menu3.png', '/images/menu4.png', '/images/menu5.png'];
                siteData.menu.images = siteData.menu.images.map((img, idx) =>
                    (!img || isDemoOrLocal(img)) ? (defaultMenus[idx] || '') : img
                );
            }

            console.log('데이터 로드 및 경로 검증 완료');
        }
    } catch (err) {
        console.error('데이터 로드 중 오류 발생:', err);
    }

    if (!siteData) return;

    // Hero Section
    if (siteData.hero) {
        const heroTitle = document.querySelector('section h1');
        if (heroTitle && siteData.hero.title) {
            heroTitle.innerHTML = siteData.hero.title;
        }
        const heroSubtitle = document.querySelector('section p.tracking-\\[0\\.6em\\]');
        if (heroSubtitle && siteData.hero.subtitle) {
            heroSubtitle.textContent = siteData.hero.subtitle;
        }
        const heroImage = document.querySelector('section img[alt="Clean Restaurant Interior"]');
        if (heroImage && siteData.hero.image) {
            heroImage.src = siteData.hero.image;
        }
    }

    // Space Section
    if (siteData.space) {
        const spaceTitle = document.querySelector('#space h2');
        if (spaceTitle && siteData.space.title) {
            spaceTitle.innerHTML = siteData.space.title;
        }
        const spaceDesc = document.querySelector('#space p.leading-loose');
        if (spaceDesc && siteData.space.description) {
            spaceDesc.innerHTML = siteData.space.description.replace(/\n/g, '<br>');
        }

        // Space Images
        if (siteData.space.images) {
            const spaceImgs = document.querySelectorAll('#space .img-wrapper img');
            siteData.space.images.forEach((imgSrc, idx) => {
                if (spaceImgs[idx] && imgSrc) {
                    spaceImgs[idx].src = imgSrc;
                }
            });
        }
    }

    // Menu Section
    if (siteData.menu) {
        const menuTitle = document.querySelector('#menu h2');
        if (menuTitle && siteData.menu.title) {
            menuTitle.textContent = siteData.menu.title;
        }
        const menuSubtitle = document.querySelector('#menu span.tracking-\\[0\\.2em\\]');
        if (menuSubtitle && siteData.menu.subtitle) {
            menuSubtitle.textContent = siteData.menu.subtitle;
        }

        // Menu Items
        if (siteData.menu.items && Array.isArray(siteData.menu.items)) {
            const menuItems = document.querySelectorAll('.menu-item');
            siteData.menu.items.forEach((item, idx) => {
                if (menuItems[idx] && item) {
                    const nameEl = menuItems[idx].querySelector('h3');
                    const priceEl = menuItems[idx].querySelector('span.text-gray-400');
                    const descEl = menuItems[idx].querySelector('p.text-secondary');

                    if (nameEl && item.name) nameEl.textContent = item.name;
                    if (priceEl && item.price) priceEl.textContent = item.price;
                    if (descEl && item.description) descEl.textContent = item.description;
                }
            });
        }

        // Menu Images (Visual Preview)
        // Ensure images array exists matching items
        if (siteData.menu.images && Array.isArray(siteData.menu.images)) {
            siteData.menu.images.forEach((imgSrc, idx) => {
                const img = document.getElementById(`img-${idx + 1}`);
                if (img && imgSrc) {
                    img.src = imgSrc;
                }
            });
        }
    }

    // Origin Section
    if (siteData.origin) {
        const originMap = {
            'farm': 'origin-farm-img',
            'jeju': 'origin-jeju-img',
            'tongyeong': 'origin-tongyeong-img',
            'seafoodMain': 'origin-seafood-main-img',
            'truffle': 'origin-truffle-img',
            'caviar': 'origin-caviar-img',
            'hanwoo': 'origin-hanwoo-img',
            'uni': 'origin-uni-img'
        };

        Object.keys(originMap).forEach(key => {
            if (siteData.origin[key]) {
                const img = document.getElementById(originMap[key]);
                if (img) img.src = siteData.origin[key];
            }
        });
    }

    // Reservation Section
    if (siteData.reservation) {
        const resImage = document.querySelector('#reservation img[alt="Table Setting"]');
        if (resImage && siteData.reservation.image) {
            resImage.src = siteData.reservation.image;
        }
    }

    // Time Slots
    if (siteData.timeSlots && siteData.timeSlots.length > 0) {
        const timeSlotsContainer = document.getElementById('time-slots');
        if (timeSlotsContainer) {
            // Keep existing buttons logic or regenerate?
            // The Original HTML has 6 static buttons. Here we replace them with dynamic ones.
            timeSlotsContainer.innerHTML = '';

            siteData.timeSlots.forEach(time => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'time-slot border border-border py-3 text-xs md:text-sm rounded hover:bg-white bg-white transition-colors';
                button.textContent = time;
                timeSlotsContainer.appendChild(button);

                button.addEventListener('click', () => {
                    if (button.classList.contains('disabled')) return;
                    const allSlots = timeSlotsContainer.querySelectorAll('.time-slot');
                    allSlots.forEach(s => s.classList.remove('selected'));
                    button.classList.add('selected');
                    document.getElementById('selected-time').value = time;
                });
            });
        }
    }

    // Disabled time slots
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput && siteData.disabledSlots) {
        dateInput.addEventListener('change', () => {
            updateDisabledSlots(dateInput.value, siteData.disabledSlots);
        });
    }
}

function updateDisabledSlots(selectedDate, disabledSlots) {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;

    const slots = timeSlotsContainer.querySelectorAll('.time-slot');
    slots.forEach(slot => {
        const time = slot.textContent;
        const isDisabled = disabledSlots.some(ds => ds.date === selectedDate && ds.time === time);

        if (isDisabled) {
            slot.classList.add('disabled', 'opacity-30', 'cursor-not-allowed', 'bg-gray-200');
            slot.classList.remove('selected', 'bg-white');
        } else {
            slot.classList.remove('disabled', 'opacity-30', 'cursor-not-allowed', 'bg-gray-200');
            slot.classList.add('bg-white');
        }
    });
}

// Load admin data on page load
loadAdminData();

// ====================
// INTERACTIVE SCRIPTS
// ====================

// 1. Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 2. Sticky Header Transformation
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.remove('bg-transparent', 'mix-blend-difference', 'text-white', 'py-6');
        header.classList.add('bg-white/95', 'backdrop-blur-md', 'text-primary', 'shadow-sm', 'py-4');
    } else {
        header.classList.add('bg-transparent', 'mix-blend-difference', 'text-white', 'py-6');
        header.classList.remove('bg-white/95', 'backdrop-blur-md', 'text-primary', 'shadow-sm', 'py-4');
    }
});

// 3. Menu Click Interaction
const menuItems = document.querySelectorAll('.menu-item');
const menuImages = document.querySelectorAll('.menu-image');

function setActiveItem(targetItem) {
    menuItems.forEach(item => item.classList.remove('selected'));
    menuImages.forEach(img => img.classList.remove('active'));

    targetItem.classList.add('selected');

    const targetId = targetItem.getAttribute('data-target');
    const targetImg = document.getElementById(targetId);
    if (targetImg) {
        targetImg.classList.add('active');
    }
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        setActiveItem(item);
    });
});

if (menuItems.length > 0) {
    setActiveItem(menuItems[0]);
}
