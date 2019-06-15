'use strict';

var types = ['flat', 'house', 'bungalo', 'palace'];
// Создадим функцию для генерации номера индекса
var getRandomOffer = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getNumberOfRange = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue) + minValue);
};

var showMap = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
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

var drawPin = function (dataobj) {
  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 84;
  var template = document
    .querySelector('#pin')
    .content.querySelector('.map__pin'); // ищем тег template и берем всего содержимое
  var pin = template.cloneNode(true);
  pin.style.left = dataobj.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = dataobj.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = dataobj.author.avatar;
  return pin;
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
drawPins(ads);
showMap();
