('use strict');
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 84;
  window.MAP_MAX_HEIGHT = 630;
  // var types = ['flat', 'house', 'bungalo', 'palace'];
  //   // Создадим функцию для генерации номера индекса
  //   var getRandomOffer = function (arr) {
  //     return arr[Math.floor(Math.random() * arr.length)];
  //   };
  //   // координаты меток рандом
  //   var getNumberOfRange = function (minValue, maxValue) {
  //     return Math.floor(Math.random() * (maxValue - minValue) + minValue);
  //   };

  function getResult(load) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          load(xhr.response);
          return '200';
        case 400:
          return 'Неверный запрос';
        case 404:
          return 'Ничего не найдено';
        default:
          return 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }
    });
    xhr.addEventListener('error', function () {
      return 'Что-то пошло не так! Произошла ошибка соединения';
    });
    xhr.addEventListener('timeout', function () {
      return 'Запрос не успел выполниться за ' + xhr.timeout + 'мс';
    });

    xhr.timeout = 10000;

    return xhr;
  }

  window.getAdverts = function (load) {
    var xhr = getResult(load);
    var url = 'https://js.dump.academy/keksobooking/data';

    xhr.open('GET', url);
    xhr.send();
  };
})();
