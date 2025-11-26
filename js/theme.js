document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateButtonText(true);
    } else {
        updateButtonText(false);
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        updateButtonText(isLight);
    });

    function updateButtonText(isLight) {
        toggleButton.textContent = isLight ? 'Modo: Claro' : 'Modo: Oscuro';
    }
});
