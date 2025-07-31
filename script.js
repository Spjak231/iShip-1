


const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Open current if it wasn't already open
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// footer

function showPopup(title, description) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-description').innerText = description;
    document.getElementById('popup').style.display = 'block';
    document.body.classList.add('noscroll');
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.body.classList.remove('noscroll');
}


// side bar
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');

function toggleSidebar(open) {
    if (typeof open === 'boolean') {
        sidebar.classList.toggle('open', open);
        overlay.classList.toggle('active', open);
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}
// Hamburger open
mobileMenuBtn.addEventListener('click', () => toggleSidebar(true));
// Close btn
closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
// Overlay click closes
overlay.addEventListener('click', () => toggleSidebar(false));
// Optional: ESC-to-close on mobile
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) toggleSidebar(false);
});
// Optional: close sidebar when resizing to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) toggleSidebar(false);
});
