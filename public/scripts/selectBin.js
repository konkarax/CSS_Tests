
function handleBinLinkClick(event) {
    // event.preventDefault(); 
    const binLink = event.target;
    const binLinkHref = binLink.getAttribute('href');
  
    // Get the current URL and append the bin link's href
    const currentURL = window.location.href;
    const newURL = currentURL + binLinkHref;
    console.log("id-link: ", binLinkHref)
    console.log("current-link: ", currentURL)

    console.log("new-link: ", newURL)
    window.location.href = newURL;
  }
  
  
document.addEventListener('DOMContentLoaded', function() {
// Add event listeners to all bin ID links
const binIdLinks = document.querySelectorAll('.bin-id-link')
binIdLinks.forEach((binLink) => {
    binLink.addEventListener('click', handleBinLinkClick)
})
})
  