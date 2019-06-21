('use strict');
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 84;
  window.MAP_MAX_HEIGHT = 630;
  var types = ['flat', 'house', 'bungalo', 'palace'];
  // Создадим функцию для генерации номера индекса
  var getRandomOffer = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  // координаты меток рандом
  var getNumberOfRange = function (minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  };

  // Создадим функцию генерации меток
  window.generateLabels = function (quantity) {
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
})();
