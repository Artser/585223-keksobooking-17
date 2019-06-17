'use strict';

var types = ['flat', 'house', 'bungalo', 'palace'];
// Создадим функцию для генерации номера индекса
var getRandomOffer = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
// координаты меток рандом
var getNumberOfRange = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue) + minValue);
};

var showMap = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  // /
  document
    .querySelector('.map__pin')
    .addEventListener('mousedown', function (evt) {
      isDown = true;
      downX = evt.clientX;
      downY = evt.clientY;
    });

  document
    .querySelector('.map__pin')
    .addEventListener('mousemove', function (evt) {
      if (isDown) {
        var dx = evt.clientX - downX;
        var dy = evt.clientY - downY;
        downX = evt.clientX;
        downY = evt.clientY;
        var newX = parseFloat(mainPin.style.left) + dx;
        var newY = parseFloat(mainPin.style.top) + dy;
        if (
          newY > MAP_MAX_HEIGHT ||
          newY < 130 ||
          newX > parseFloat(mapPins.style.height) - PIN_HEIGHT ||
          newX < -PIN_WIDTH / 2
        ) {
          isDown = false;
          return;
        } else {
          mainPin.style.left = newX + 'px';
          mainPin.style.top = newY + 'px';
          updatePinCoordField();
        }
      }
    });

  document.querySelector('.map__pin').addEventListener('mouseup', function () {
    isDown = false;
  });
  // /
};
var showForm = function () {
  var form = document.querySelector('.ad-form');
  document.querySelector('.map__filters').disabled = true;
  form.classList.remove('ad-form--disabled');
  // form.querySelector('input, select').disabled = true;
  document
    .querySelectorAll(
        'form.ad-form input[type=text], form.ad-form select, form.ad-form textarea'
    )
    .forEach(function (evt) {
      evt.disabled = '';
    });
};
// Создадим функцию генерации меток
var generateLabels = function (quantity) {
  var adverts = [];
  for (var i = 1; i <= quantity; i++) {
    // заполняем массив объектами
    adverts.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        type: getRandomOffer(types)
      },
      location: {
        x: getNumberOfRange(0, 1200),
        y: getNumberOfRange(130, 630)
      }
    });
  }
  return adverts;
};

var PIN_WIDTH = 62;
var PIN_HEIGHT = 84;
var MAP_MAX_HEIGHT = 630;

var drawPin = function (dataobj) {
  var template = document
    .querySelector('#pin')
    .content.querySelector('.map__pin'); // ищем тег template и берем всего содержимое
  var pin = template.cloneNode(true);
  pin.style.left = dataobj.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = dataobj.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = dataobj.author.avatar;
  return pin;
};

var disabledForm = function () {
  document
    .querySelectorAll(
        'form.ad-form input, form.ad-form select, form.ad-form textarea, form.ad-form button, form.ad-form features'
    )
    .forEach(function (evt) {
      evt.disabled = 'disabled';
    });
};

var drawPins = function (data) {
  var mapPinsElement = document.querySelector('.map__pins');
  var pinsFragment = document.createDocumentFragment();
  data.forEach(function (obj) {
    pinsFragment.appendChild(drawPin(obj));
  });
  mapPinsElement.appendChild(pinsFragment);
};

var ads = generateLabels(8);
// //////////////
var isDown = false;
var downX;
var downY;
var mainPin;
var mapPins;

var updatePinCoordField = function () {
  var px = parseInt(mainPin.style.left, 10) + Math.floor(PIN_WIDTH / 2);
  var py = parseInt(mainPin.style.top, 10) + PIN_HEIGHT;
  document.querySelector('#address').value = px + ',' + py;
};

document.addEventListener('DOMContentLoaded', function () {
  mainPin = document.querySelector('.map__pin--main');
  mapPins = document.querySelector('.map__pins');

  disabledForm();
  updatePinCoordField();

  mainPin.addEventListener('click', function () {
    drawPins(ads);
    showMap();
    showForm();
  });
});

// var form = document.querySelector('.ad-form.ad-form--disabled');

// form.onsubmit = function validate(e) {
//   if ('title.value == '') {
//     e.preventDefault();
//   }

//   if (title.value.length <= 2 || title.value.length >= 10) {
//     console.log(
//         'title.value.length: ' +
//         title.value.length +
//         ' значение не попадает в диапазон'
//     );

//     e.preventDefault();
//   }

//   if (typeof title.value !== 'string') {

//     e.preventDefault();
//   }
// };

// type.onchange = function () {
//   if (type.value == 'bungalo') {
//     price.setAttribute('placeholder', '0');
//   }
//   if (type.value == 'flat') {
//     price.setAttribute('placeholder', '1000');
//   }
//   if (type.value == 'house') {
//     price.setAttribute('placeholder', '5000');
//   }
//   if (type.value == 'palace') {
//     price.setAttribute('placeholder', '10000');
//   }
// };

// timein.onchange = function () {
//   if (timein.value == 'bungalo') {
//     price.setAttribute('placeholder', '0');
//   }
//   if (timein.value == '12:00') {
//     price.setAttribute('placeholder', '1000');
//   }
//   if (timein.value == '13:00') {
//     price.setAttribute('placeholder', '5000');
//   }
//   if (timein.value == '14:00') {
//     price.setAttribute('placeholder', '10000');
//   }
// };
