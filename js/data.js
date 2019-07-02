('use strict');
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 84;
  window.MAP_MAX_HEIGHT = 630;
  var errMess = function (textE) {
    var errorTemplate = document
      .querySelector('#error')
      .content.querySelector('.error'); // ищем тег template и берем всего содержимое
    // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
    var errorLog = errorTemplate.cloneNode(true);

    var errText = errorLog.querySelector('.error__message');
    var errButton = errorLog.querySelector('.error__button');
    // Создает новый *текстовый* узел с данным текстом
    errText.textContent = textE;

    // перезагрузка страницы при ошибке
    errButton.addEventListener('click', function () {
      location.reload();
    });

    // добавление элемента
    document.querySelector('main').appendChild(errorLog);
  };
  var getResult = function () {
    // function getResult(load) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('error', function () {
      errMess('Что-то пошло не так! Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errMess('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;

    return xhr;
  };

  window.getAdverts = function (load, value) {
    var xhr = getResult(load);
    var url = 'https://js.dump.academy/keksobooking/data';
    if (value === undefined) {
      value = 'any';
    }

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          load(xhr.response, value);
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
    xhr.open('GET', url);
    xhr.send();
  };

  document.querySelector('.map__pins').onclick = function (event) {
    var target = event.target; // где был клик?
    // клик для открытия модального окна нужного пина
    while (target.classList.value !== 'map__pins') {
      if (target.classList.value === 'map__pin') {
        card(target);
        return;
      }
      target = target.parentNode;
    }
  };

  // ЗАПОЛНЯЕМ модальное окно информацией
  var card = function (obj1) {
    var template = document.querySelector('#card').content;
    var s = obj1.getAttribute('data'); // получает значение атрибута

    var value = window.Lab[s];

    var card1 = template.cloneNode(true);

    var avatar = card1.querySelector('.popup__avatar'); // получили аватар
    avatar.setAttribute('src', value.author.avatar); // меняем атрибут src

    var title = card1.querySelector('.popup__title');
    title.textContent = value.offer.title;

    var textAddress = card1.querySelector('.popup__text--address');
    textAddress.textContent = value.offer.address;

    var textPrice = card1.querySelector('.popup__text--price');
    textPrice.textContent = value.offer.price + ' руб/ночь';

    var textType = card1.querySelector('.popup__type');
    textType.textContent = value.offer.type;

    var textCapacity = card1.querySelector('.popup__text--capacity');
    textCapacity.textContent =
      value.offer.rooms + ' комнаты для ' + value.offer.guests + ' гостей';

    var textType2 = card1.querySelector('.popup__text--time');
    textType2.textContent =
      'Заезд после ' +
      value.offer.checkin +
      ' , выезд до ' +
      value.offer.checkout;

    var ulFeatures = card1.querySelector('.popup__features');
    var ulFeature = card1.querySelectorAll('.popup__feature');

    ulFeature.forEach(function (value3) {
      value3.parentNode.removeChild(value3);
    });

    value.offer.features.forEach(function (value4) {
      var liF = document.createElement('li');
      liF.classList.add('popup__feature'); // добавляет класс
      liF.classList.add('popup__feature--' + value4);

      ulFeatures.appendChild(liF); // добавлем элемент иконку с удобствами
    });

    var textDescription = card1.querySelector('.popup__description');
    textDescription.textContent = value.offer.description;

    var photos = card1.querySelector('.popup__photos');
    var photo = card1.querySelector('.popup__photo');
    value.offer.photos.forEach(function (value2) {
      var temp = photo.cloneNode(true);
      temp.setAttribute('src', value2);
      photos.appendChild(temp);
    });

    // закрываем окно с информацией при клике
    card1.querySelector('.popup__close').addEventListener('click', function () {
      document.querySelector('.map__card').remove();
    });

    card1.querySelector('article').setAttribute('data', s);

    removeAllCards();
    document.querySelector('.map').appendChild(card1);
  };

  var removeAllCards = function () {
    document.querySelectorAll('.map__card').forEach(function (val) {
      val.remove();
    });
  };
})();
