// IMPORTS ----------------------------------------------------------
import "../../node_modules/babel-polyfill/node_modules/core-js/client/core";  // Core-js for polyfill
import "../../node_modules/babel-polyfill/node_modules/regenerator-runtime/runtime";  // runtime for polyfill
import "../../node_modules/babel-polyfill/dist/polyfill";  // Polyfill fixed

import { App } from './modules/ywdxpn.js';
import Swiper from '../../node_modules/swiper/swiper-bundle';
import lottie from '../../node_modules/lottie-web/build/player/lottie';
// IMPORTS ----------------------------------------------------------

// PRELOADER --------------------------------------------------------
function preloaderProgress() {
    const preloader = document.querySelector('.preloader');
    let images = document.images,
        imagesLength = images.length,
        imagesLoaded = 0,
        parcentLoad = 0,
        lineLoad = document.querySelector('.preloader__progressbar-line'),
        textLoad = document.querySelector('.preloader__progressbar-text');

    for ( let i = 0; i < imagesLength; i++ ) {
        let imageClone = new Image();
        imageClone.onload = imageLoadedFunc;
        imageClone.onerror = imageLoadedFunc;
        imageClone.src = images[i].src;
    }
    function imageLoadedFunc() {
        imagesLoaded++;
        parcentLoad = ((100 / imagesLength) * imagesLoaded) << 0;
        lineLoad.style.width = parcentLoad + '%';
        textLoad.innerHTML = parcentLoad + '%';
        if (imagesLoaded >= imagesLength) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                document.body.classList.remove('_load');
            }, 1200);
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 2000);
        }
    };
};
preloaderProgress();
// PRELOADER --------------------------------------------------------

// CANVAS ANIMATION INIT --------------------------------------------
const $ = new App();
class Psy0 extends $.Psy {
    constructor({ nPtc = 100, scale = 1 } = {}) {
        super({ nPtc });
        this.scale = scale;
    }
    buildTexture(graphic) {
        graphic.beginFill(0xffffff, 1);
        graphic.drawRect(0, 0, this.scale, this.scale);
        graphic.endFill();
    }
    recycle(sprite, isFirstRun) {
        const { width, height } = sprite.getBounds();
        if (isFirstRun) {
            sprite.position.y = Math.random() * innerHeight;
            sprite.anchor.set(0.5, 0.5);
            sprite.angle = Math.random() * 360;
        } else {
            sprite.position.y = -height * 2;
        }
        sprite.position.x = Math.random() * innerWidth;
        sprite.tint = Math.random() * 0xffffff;
        sprite.scale.set(Math.random());
        sprite.$w = 0.2 + Math.random() * 0.2;
        sprite.$vy = (0.4 + Math.random() * 0.6) * 2;
        sprite.$vx = (-0.5 + Math.random()) * 0.2;
    }
    update() {
        for (const sprite of this.container.children) {
            sprite.angle += sprite.$w;
            sprite.position.y += sprite.$vy;
            sprite.position.x += sprite.$vx;
            const { y, x, width } = sprite.getBounds();
            if (y > innerHeight || x < -width || x > innerWidth) {
                this.recycle(sprite);
            }
        }
    }}
// ----- mutli systems ------
const blurFilter = new PIXI.filters.BlurFilter(10);
// ----- sys 1
const psy0 = new Psy0({ scale: 10, nPtc: 500 });
psy0.container.filters = [blurFilter];
$.regPsy(psy0);
// ----- sys2
const psy0b = new Psy0({ scale: 10, nPtc: 200 });
$.regPsy(psy0b);
// CANVAS ANIMATION INIT --------------------------------------------

// PARALLAX EXPERIENS -----------------------------------------------
const parallax = document.querySelector('.parallax');
if (parallax) {
    //Параллакс элементы
    const planet = document.querySelector('.experiens__decor');

    //Коэффициенты
    const forPlanet = 20;

    //Скорость
    const speed = 0.25;

    //Переменные движений
    let posX = 0, posY = 0;
    let currentPosX = 0, currentPosY = 0;

    function setMouseParallaxStyle() {
        const distX = currentPosX - posX;
        const distY = currentPosY - posY;

        posX += (distX * speed)
        posY += (distY * speed)

        planet.style.cssText = `transform: translate(${posX / forPlanet}%,${posY / forPlanet}%);`;

        requestAnimationFrame(setMouseParallaxStyle);
    }
    setMouseParallaxStyle();

    parallax.addEventListener('mousemove', function(e) {
        //Ширины и высота блока
        const parallaxWidth = parallax.offsetWidth;
        const parallaxHeight = parallax.offsetHeight;

        // Ноль по середине
        const coordX = e.pageX - parallaxWidth / 2;
        const coordY = e.pageY - parallaxHeight / 2;
        //Проценты положения
        currentPosX = coordX / parallaxWidth * 100;
        currentPosY = coordY / parallaxHeight * 100;
    });
}
// PARALLAX EXPERIENS -----------------------------------------------

// LOTTIE CLICK ANIM ------------------------------------------------
const lottieHints = document.querySelectorAll('.lottie-hint');
let lottiePath = document.body.clientWidth <= 1024 ? 'click' : 'hover';
lottieHints.forEach(hint => {
    lottie.loadAnimation({
        container: hint, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `animations/${lottiePath}.json` // the path to the animation json
    });
});
// LOTTIE CLICK ANIM ------------------------------------------------

// SWIPER FOR PHILOSOPHY --------------------------------------------
const swiperPhilosophy = new Swiper('.philosophy__slider', {
    // Optional parameters
    speed: 500,
    spaceBetween: 50,
    slidesPerView: 1,
    slidesPerGroup: 1,
    virtualTranslate: false,
    paginationClickable: true,
    navigation: {
        nextEl: '.philosophy__slide-next',
        prevEl: '.philosophy__slide-prev',
    },
    pagination: {
        el: '.philosophy__pagination',
        type: 'bullets',
    },
    breakpoints: {
        900: {
            slidesPerView: 2,
        },
      }
});
// SWIPER FOR PHILOSOPHY --------------------------------------------

// SWIPER FOR TECHNOLOGY --------------------------------------------
const swiperTechnologyInit = () => {
    // Классы swiper
    const technologiesContainer = document.querySelector('.technologies__container');
    const technologiesCards = document.querySelector('.technologies__cards');
    const technologiesScrollbar = document.querySelector('.technologies__scrollbar');
    const technologiesCard = document.querySelectorAll('.technologies__card');
    // Добавление классов swiper при <= 480px
    if (document.body.clientWidth <= 480) {
        if (!technologiesContainer.classList.contains('swiper-container')) technologiesContainer.classList.add('swiper-container');
        if (!technologiesCards.classList.contains('swiper-wrapper')) technologiesCards.classList.add('swiper-wrapper');
        if (!technologiesScrollbar.classList.contains('swiper-scrollbar')) technologiesScrollbar.classList.add('swiper-scrollbar');
        technologiesCard.forEach(card => {
            if (!card.classList.contains('swiper-slide')) card.classList.add('swiper-slide');
        });

        const swiperTechnology = new Swiper('.technologies__container', {
            // Optional parameters
            direction: 'vertical',
            speed: 500,
            autoHeight: false,
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 50,
            loop: true,
            scrollbar: {
                el: '.technologies__scrollbar',
                draggable: true,
  },
        });
    }
};
window.onload = () => swiperTechnologyInit();

// SWIPER FOR TECHNOLOGY --------------------------------------------

// MODAL, MOBILE MENU - OPEN/CLOSE ----------------------------------
document.body.addEventListener('click', (e) => {
    // Элементы действия
    const modal = document.querySelector('.modal');
    const mobMenu = document.querySelector('.navbar');
    const burgerBtn = document.querySelector('.burger__btn');

    // Открытие модального окна
    if (e.target.classList.contains('btn__get')) {
        if (!modal.classList.contains('_open')) {
            modal.classList.add('_open');
            document.querySelector('body').classList.add('_scrollBan');
        }
    }
    // Закрытие модального окна
    if (e.target.classList.contains('modal__close')) {
        if (modal.classList.contains('_open')) {
            modal.classList.remove('_open');
            document.querySelector('body').classList.remove('_scrollBan');
            document.querySelector('.form').reset();
        }
    }
    // Открытие/закрытие мобильного меню
    if (e.target.classList.contains('burger__btn')) {
        mobMenu.classList.toggle('_menuOpen');
        burgerBtn.classList.toggle('_isActive');
        document.querySelector('body').classList.toggle('_scrollBan');
    }
    // Закрытие мобильного меню при клике на ссылку
    if (mobMenu.classList.contains('_menuOpen')) {
        const mobMenuLinks = document.querySelectorAll('.menu__link');
        mobMenuLinks.forEach(linkItem => {
            if (e.target == linkItem) {
                setTimeout(() => {
                    mobMenu.classList.remove('_menuOpen');
                    burgerBtn.classList.remove('_isActive');
                    document.querySelector('body').classList.remove('_scrollBan');
                }, 500);
            }
        })
    }
});
// MODAL, MOBILE MENU - OPEN/CLOSE ----------------------------------

// VALIDATING AND SENDING FORM -------------------------------------- 
let validateForms = function(selector, rules) {
    new window.JustValidate(selector, {
        rules: rules,
        submitHandler: async function(form) {
            document.querySelector('.send__load').classList.add('_sending'); // load sending
            document.querySelector('body').classList.add('_scrollBan'); // ban scroll when loadind send
            let formData = new FormData(form);
            let response = await fetch('php/mail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                console.log('Data sending!');
                form.reset();
                document.querySelector('.send__load').classList.remove('_sending'); // del load sending
                document.querySelector('body').classList.remove('_scrollBan'); // del ban scroll when loadind send
            } else {
                console.log('Error!');
                alert('Error sending!');
                document.querySelector('.send__load').classList.remove('_sending'); // del load sending
                document.querySelector('body').classList.remove('_scrollBan'); // del ban scroll when loadind send
            }
            // let xhr = new XMLHttpRequest();
            // xhr.onreadystatechange = function() {
            //     if (xhr.readyState === 4) {
            //         if (xhr.status === 200) {
            //             console.log('Data sending!');
            //         } else {
            //             console.log('Error!');
            //         }
            //     }
            // }
            // xhr.open('POST', 'php/mail.php', true);
            // xhr.send(formData);
            // form.reset();
        }
    });
}

validateForms('.form', {email: {required: true, email: true}, text: {required: true, maxLength: 500, minLength: 5}});
// VALIDATING AND SENDING FORM -------------------------------------- 



