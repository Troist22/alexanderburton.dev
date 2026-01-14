// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', function() {
            menuDropdown.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                menuDropdown.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });

        // Close menu when clicking on empty space
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
});
