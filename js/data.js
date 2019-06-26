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

    var errMess = function (textE) {
      var errorTemplate = document
        .querySelector('#error')
        .content.querySelector('.error'); // ищем тег template и берем всего содержимое
      var errorLog = errorTemplate.cloneNode(true);

      var errText = errorLog.querySelector('.error__message');
      var errButton = errorLog.querySelector('.error__button');

      errText.textContent = textE;

      // перезагрузка страницы при ошибке
      errButton.addEventListener('click', function () {
        location.reload();
      });

      document.querySelector('main').appendChild(errorLog);
    };

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          load(xhr.response);
          return;
        case 400:
          errMess('Неверный запрос');
          return;
        case 404:
          errMess('Что-то пошло не так! Произошла ошибка соединения');
          return;
        default:
          errMess('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
          return;
      }
    });

    xhr.addEventListener('error', function () {
      errMess('Что-то пошло не так! Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errMess('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
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
