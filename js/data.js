('use strict');
(function () {
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 84;
  window.MAP_MAX_HEIGHT = 630;
  window.MAP_MIN_HEIGHT = 130;
  window.MAP_MAX_WIDTH = 1140;
  window.MAP_MIN_WIDTH = 0;
  window.ESCAPE = 27;
  window.ENTER = 13;
  window.PRICE = 1000;
  window.PIXEL = 3;
  var treatError = function (textErr) {
    var errorTemplate = document
      .querySelector('#error')
      .content.querySelector('.error'); // ищем тег template и берем всего содержимое
    // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
    var errorLog = errorTemplate.cloneNode(true);

    var errText = errorLog.querySelector('.error__message');
    var errButton = errorLog.querySelector('.error__button');
    // Создает новый *текстовый* узел с данным текстом
    errText.textContent = textErr;

    // перезагрузка страницы при ошибке
    errButton.addEventListener('click', function () {
      location.reload();
    });

    // добавление элемента
    document.querySelector('main').appendChild(errorLog);
  };
  var getResult = function () {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('error', function () {
      treatError('Что-то пошло не так! Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      treatError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;

    return xhr;
  };

  window.getAdverts = function (load, value) {
    if (value === undefined) {
      value = {};
    }
    var xhr = getResult(load);

    var url = 'https://js.dump.academy/keksobooking/data';

    if (value.type === undefined) {
      value.type = 'any';
    }
    if (value.price === undefined) {
      value.price = 'any';
    }
    if (value.guests === undefined) {
      value.guests = 'any';
    }
    if (value.rooms === undefined) {
      value.rooms = 'any';
    }

    if (value.features === undefined) {
      value.features = [];
    }

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          load(xhr.response, value);
          return;
        case 400:
          treatError('Неверный запрос');
          return;
        case 404:
          treatError('Что-то пошло не так! Произошла ошибка соединения');
          return;
        default:
          treatError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
          return;
      }
    });
    xhr.open('GET', url);
    xhr.send();
  };

  document.querySelector('.map__pins').addEventListener('click', function () {
    var target = event.target; // где был клик?
    // клик для открытия модального окна нужного пина
    while (target.classList.value !== 'map__pins') {
      if (target.classList.value === 'map__pin') {
        createModal(target);
        return;
      }
      target = target.parentNode;
    }
  });

  var onPopupCloseEscKeydown = function (evt) {
    if (evt.keyCode === window.ESCAPE || evt.keyCode === window.ENTER) {
      document.querySelector('.map__card').remove();
      document.removeEventListener('keydown', onPopupCloseEscKeydown);
    }
  };

  window.onPopupCloseClick = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
      document.removeEventListener('keydown', onPopupCloseEscKeydown);
    }
  };

  // ЗАПОЛНЯЕМ модальное окно информацией
  var createModal = function (newObj) {
    var template = document.querySelector('#card').content;
    var newData = newObj.getAttribute('data'); // получает значение атрибута

    var value = window.Labels[newData];

    var cardClone = template.cloneNode(true);

    var avatar = cardClone.querySelector('.popup__avatar'); // получили аватар
    avatar.setAttribute('src', value.author.avatar); // меняем атрибут src

    var title = cardClone.querySelector('.popup__title');
    title.textContent = value.offer.title;

    var textAddress = cardClone.querySelector('.popup__text--address');
    textAddress.textContent = value.offer.address;

    var textPrice = cardClone.querySelector('.popup__text--price');
    textPrice.textContent = value.offer.price + ' руб/ночь';

    var textType = cardClone.querySelector('.popup__type');
    textType.textContent = value.offer.type;

    var textCapacity = cardClone.querySelector('.popup__text--capacity');
    textCapacity.textContent =
      value.offer.rooms + ' комнаты для ' + value.offer.guests + ' гостей';

    var textTime = cardClone.querySelector('.popup__text--time');
    textTime.textContent =
      'Заезд после ' +
      value.offer.checkin +
      ' , выезд до ' +
      value.offer.checkout;

    var featureContainer = cardClone.querySelector('.popup__features');
    var features = cardClone.querySelectorAll('.popup__feature');

    features.forEach(function (valueFeature) {
      valueFeature.parentNode.removeChild(valueFeature);
    });

    value.offer.features.forEach(function (valueIcon) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature'); // добавляет класс
      newFeature.classList.add('popup__feature--' + valueIcon);

      featureContainer.appendChild(newFeature); // добавлем элемент иконку с удобствами
    });

    var textDescription = cardClone.querySelector('.popup__description');
    textDescription.textContent = value.offer.description;

    var photos = cardClone.querySelector('.popup__photos');
    var photo = cardClone.querySelector('.popup__photo');
    value.offer.photos.forEach(function (photoImg) {
      var temp = photo.cloneNode(true);
      temp.setAttribute('src', photoImg);
      photos.appendChild(temp);
    });
    photo.remove();

    // закрываем окно с информацией при клике

    cardClone
      .querySelector('.popup__close')
      .addEventListener('click', window.onPopupCloseClick);

    // закрывает окно по нажатию esc

    document.addEventListener('keydown', onPopupCloseEscKeydown);

    cardClone.querySelector('article').setAttribute('data', newData);

    window.removeAllCards();
    document.querySelector('.map').appendChild(cardClone);
  };

  window.removeAllCards = function () {
    document.querySelectorAll('.map__card').forEach(function (val) {
      val.remove();
    });
  };
})();
