const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvCardImg = document.querySelectorAll('.tv-card__img');

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

tvCardImg.forEach(elem => {
    let src = elem.src;
    let backdrop = elem.getAttribute('data-backdrop');
    elem.addEventListener('mouseover', () => elem.src = backdrop);
    elem.addEventListener('mouseout', () => elem.src = src);
});