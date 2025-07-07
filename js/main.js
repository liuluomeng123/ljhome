document.addEventListener('DOMContentLoaded', function() {
    const clockElement = document.getElementById('clock');
    const userInfoElement = document.getElementById('user-info');

    // Function to update the clock
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        clockElement.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Function to set up user authentication status
    function setupAuth() {
        if (!userInfoElement) return;
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (loggedInUser) {
            userInfoElement.innerHTML = `
                <span>欢迎, ${loggedInUser}</span>
                <button id="logout-button">退出</button>
            `;

            const logoutButton = document.getElementById('logout-button');
            const logoutConfirmModal = document.getElementById('logout-confirm-modal');
            const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
            const cancelLogoutBtn = document.getElementById('cancel-logout-btn');

            logoutButton.addEventListener('click', () => {
                logoutConfirmModal.classList.add('show');
            });

            confirmLogoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                sessionStorage.removeItem('loggedIn');
                window.location.href = 'index.html';
            });

            cancelLogoutBtn.addEventListener('click', () => {
                logoutConfirmModal.classList.remove('show');
            });

            logoutConfirmModal.addEventListener('click', (e) => {
                if (e.target === logoutConfirmModal) {
                    logoutConfirmModal.classList.remove('show');
                }
            });
        } else {
            userInfoElement.innerHTML = `<a href="index.html" class="nav-link">登录</a>`;
        }
    }

    // Initial calls
    updateClock();
    setInterval(updateClock, 1000);
    setupAuth();
    // Check if user is logged in (using localStorage now)
    if (!localStorage.getItem('loggedInUser') && window.location.pathname.split('/').pop() !== 'index.html') {
        window.location.href = 'index.html';
    }

    // Active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Hamburger menu logic
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Back to Top Button Logic
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.innerHTML = '↑<br>回到顶部';
    document.body.appendChild(backToTopBtn);

    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            if (!backToTopBtn.classList.contains('show')) {
                backToTopBtn.classList.remove('hide');
                backToTopBtn.classList.add('show');
                backToTopBtn.style.display = 'block';
            }
        } else {
            if (backToTopBtn.classList.contains('show')) {
                backToTopBtn.classList.remove('show');
                backToTopBtn.classList.add('hide');
                // Wait for the animation to finish before hiding the element
                setTimeout(() => {
                    if (!backToTopBtn.classList.contains('show')) { // Re-check in case user scrolls down again quickly
                        backToTopBtn.style.display = 'none';
                    }
                }, 500); // Match animation duration
            }
        }
    };

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});