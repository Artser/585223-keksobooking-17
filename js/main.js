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

  document.addEventListener('mousemove', function (evt) {
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
        return;
      } else {
        mainPin.style.left = newX + 'px';
        mainPin.style.top = newY + 'px';
        updatePinCoordField();
      }
    }
  });

  document.addEventListener('mouseup', function () {
    isDown = false;
  });
  // /
};
var showForm = function () {
  var form = document.querySelector('.ad-form');
  document.querySelector('.map__filters').disabled = true;
  form.classList.remove('ad-form--disabled');
  // form.querySelector('input, select').disabled = true;
  document.querySelectorAll('form.ad-form fieldset').forEach(function (element) {
    element.removeAttribute('disabled');
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
  document.querySelectorAll('form.ad-form fieldset').forEach(function (evt) {
    evt.setAttribute('disabled', 'disabled');
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

var Labels = generateLabels(8);
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
    drawPins(Labels);
    showMap();
    showForm();
  });
});

var form = document.querySelector('.ad-form.ad-form--disabled');
// валидация полей формы
var priceOfNight = form.querySelector('#type');
priceOfNight.addEventListener('change', function (evt) {
  var value = evt.target.value;
  var price = form.querySelector('#price');
  if (value === 'bungalo') {
    price.setAttribute('min', 0);
  } else if (value === 'flat') {
    price.setAttribute('min', 1000);
  } else if (value === 'house') {
    price.setAttribute('min', 5000);
  } else if (value === 'palace') {
    price.setAttribute('min', 10000);
  }
});

var timeIn = form.querySelector('#timein');
var timeOut = form.querySelector('#timeout');
timeIn.addEventListener('change', function (evt) {
  var value = evt.target.value;
  if (value === '12:00') {
    timeOut.value = '12:00';
  } else if (value === '13:00') {
    timeOut.value = '13:00';
  } else if (value === '14:00') {
    timeOut.value = '14:00';
  }
});
timeOut.addEventListener('change', function (evt) {
  var value = evt.target.value;
  if (value === '12:00') {
    timeIn.value = '12:00';
  } else if (value === '13:00') {
    timeIn.value = '13:00';
  } else if (value === '14:00') {
    timeIn.value = '14:00';
  }
});
