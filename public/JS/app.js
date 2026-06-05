const links = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageID = link.data