'use strict';

const btnGenerate = document.querySelector('.btn-generate');
const mainContainer = document.querySelector('.main-container')
const songContent = document.querySelector('.song-content')
const btnDark = document.querySelector('#tog');


let isClicked = 0;


btnGenerate.addEventListener('click', () => {
    if (isClicked !== 1) {
        mainContainer.style.transform = 'translate(-35%,-10%) scale(65%)';
        songContent.style.visibility = 'visible';
        songContent.style.opacity = 1;
        isClicked = 1;
    }
    else {
        mainContainer.style.transform = '';
        songContent.style.visibility = 'hidden';
        songContent.style.opacity = 0;
        isClicked = 0;
    }
})


btnDark.addEventListener('change', () => {
    document.body.classList.toggle('dark');
})
