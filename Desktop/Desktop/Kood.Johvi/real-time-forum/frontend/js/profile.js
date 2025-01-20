document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userData.nickname || userData.email;
        } else {
            console.error("Username element not found in the DOM.");
        }
    } else {
        alert('You are not logged in!');
        window.location.href = 'login.html';
        return;
    }

});
