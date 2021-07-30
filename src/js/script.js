'use strict';

const btnGenerate = document.querySelector('.btn-generate');
const mainContainer = document.querySelector('.main-container')
const songContent = document.querySelector('.song-content')
const btnDark = document.querySelector('#tog');

const downloadbtn = document.querySelector('.btn-download')

const urlInput = document.querySelector('#song')
const errMsg = document.querySelector('.err')
const btnsContainer = document.querySelector('.btns')


let isClicked = 0;


btnGenerate.addEventListener('click', () => {
    mainContainer.style.transform = 'translate(-35%,-10%) scale(65%)';
    songContent.style.visibility = 'visible';
    songContent.style.opacity = 1;
    isClicked = 1;
})


urlInput.addEventListener('focus', () => {
    if (isClicked === 1) {
        mainContainer.style.transform = '';
        songContent.style.visibility = 'hidden';
        songContent.style.opacity = 0;
        isClicked = 0;
        document.getElementById('lyrics-text').innerHTML = '';
        document.getElementById('title').innerHTML = '';

        document.getElementById('song-img').src = ""

        document.querySelector('.loader').classList.remove('hidden');

    }
})


btnDark.addEventListener('change', () => {
    document.body.classList.toggle('dark');
})

