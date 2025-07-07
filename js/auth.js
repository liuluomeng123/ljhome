document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const closeModalButton = document.getElementById('close-modal');

    function showErrorModal(message) {
        errorMessage.textContent = message;
        errorModal.classList.add('show');
    }

    function hideErrorModal() {
        errorModal.classList.remove('show');
    }

    closeModalButton.addEventListener('click', hideErrorModal);
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) {
            hideErrorModal();
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Store login status
            sessionStorage.setItem('loggedIn', 'true');
            localStorage.setItem('loggedInUser', user.displayName);
            window.location.href = 'home.html';
        } else {
            showErrorModal('账号或密码错误');
        }
    });
});