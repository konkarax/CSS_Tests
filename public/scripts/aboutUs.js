document.addEventListener("DOMContentLoaded", function() {
    // Get all anchor links with the class "nav-link" and an href starting with "#"
    var navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    
    // Add click event listeners to the links
    navLinks.forEach(function(navLink) {
        navLink.addEventListener("click", function(e) {
            e.preventDefault();
            var targetId = this.getAttribute("href").substring(1); // Remove the "#"
            var targetElement = document.getElementById(targetId);
            if (targetElement) {
                var offset = targetElement.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth"
                });
            }
        });
    });
});