('use strict');
(function () {
  // DEBOUNCE
  var DEBOUNCE_INTERVAL = 500; // ms

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };
  var init = false;
  var load = function (data, value) {
    window.Labels = [];
    window.Lab = data;
    for (var item in data) {
      if ('offer' in data[item]) {
        window.Labels.push(data[item]);
      }
    }
    // отбираем значения по типу жилья
    window.Labels = window.Labels.filter(function (currentValue) {
      window.removeAllCards();
      if (currentValue.offer.type !== value.type && value.type !== 'any') {
        return false;
      }
      if (value.price === 'low' && currentValue.offer.price > 10000) {
        return false;
      }
      if (
        value.price === 'middle' &&
        (currentValue.offer.price <= 10000 || currentValue.offer.price > 50000)
      ) {
        return false;
      }
      if (value.price === 'high' && currentValue.offer.price < 50000) {
        return false;
      }

      if (
        currentValue.offer.rooms !== parseInt(value.rooms, 10) &&
        value.rooms !== 'any'
      ) {
        return false;
      }
      if (
        currentValue.offer.guests !== parseInt(value.guests, 10) &&
        value.guests !== 'any'
      ) {
        return false;
      }
      for (var i = 0; i < value.features.length; i++) {
        if (!currentValue.offer.features.includes(value.features[i])) {
          return false;
        }
      }
      return true;
    }).slice(0, 5); // пытаюсь получить 5 меток

    drawPins(window.Labels);
  };

  // удаляем метки, чтобы отрисовать те что нам нужны
  window.removePins = function () {
    document.querySelectorAll('.map__pin').forEach(function (val) {
      if (!val.classList.contains('map__pin--main')) {
        val.remove();
      }
    });
  };

  // открываем карту
  var showMap = function () {
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
  };

  var drawPin = function (dataobj, n) {
    var template = document
      .querySelector('#pin')
      .content.querySelector('.map__pin'); // ищем тег template и берем всего содержимое
    var pin = template.cloneNode(true);
    pin.style.left = dataobj.location.x - window.PIN_WIDTH / 2 + 'px';
    pin.style.top = dataobj.location.y - window.PIN_HEIGHT + 'px';
    pin.querySelector('img').src = dataobj.author.avatar;
    pin.setAttribute('data', n);
    return pin;
  };
  // после отправки формы помещаем кружочек в центр
  window.movePin = function () {
    var map = document.querySelector('.map');
    map.classList.add('map--faded');
    document.querySelector('.map__pin--main').style = 'left: 570px; top: 375px';
    init = false;
  };

  var drawPins = function (data) {
    var mapPinsElement = document.querySelector('.map__pins');
    var pinsFragment = document.createDocumentFragment();

    data.forEach(function (obj) {
      var newIndex = data.indexOf(obj);
      pinsFragment.appendChild(drawPin(obj, newIndex));
    });

    mapPinsElement.appendChild(pinsFragment);
  };

  var mainPin;
  // пишем координаты в поле адресс
  var updatePinCoordField = function () {
    var px =
      parseInt(mainPin.style.left, 10) + Math.floor(window.PIN_WIDTH / 2);
    var py = parseInt(mainPin.style.top, 10) + window.PIN_HEIGHT;
    document.querySelector('#address').value = px + ',' + py;
  };

  document.addEventListener('DOMContentLoaded', function () {
    mainPin = document.querySelector('.map__pin--main');

    window.disabledForm();

    // отключаем Drag браузера по умолчанию
    mainPin.ondragstart = function () {
      return false;
    };

    mainPin.addEventListener('mousedown', function (e) {
      var downX = e.clientX;
      var downY = e.clientY;

      // если dx и dy больше 3 то открываем форму
      var mouseMove = function (evt) {
        var dx = evt.clientX - downX;
        var dy = evt.clientY - downY;
        if (Math.abs(dx) > 3 && Math.abs(dy) > 3) {
          if (!init) {
            window.showForm();
            showMap();
            init = true;
            window.getAdverts(load);
          }

          downX = evt.clientX;
          downY = evt.clientY;

          var newX = parseFloat(mainPin.style.left) + dx;
          var newY = parseFloat(mainPin.style.top) + dy;
          if (
            newY > window.MAP_MAX_HEIGHT ||
            newY < 130 ||
            newX > 1140 ||
            newX < 0
          ) {
            return;
          } else {
            mainPin.style.left = newX + 'px';
            mainPin.style.top = newY + 'px';
            updatePinCoordField();
          }
        }
      };

      var mouseUp = function (evt) {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        updatePinCoordField();
        var dx = evt.clientX - downX;
        var dy = evt.clientY - downY;
        if (Math.abs(dx) > 3 && Math.abs(dy) > 3) {
          if (!init) {
            window.showForm();
            showMap();
            init = true;
            window.getAdverts(load);
          }
        }
      };
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });
  });

  // достать кликнутые элементы wifi и т.д
  var getActiveFeature = function (inpFeatures) {
    var selected = [];
    for (var i = 0; i < inpFeatures.length; i++) {
      selected.push(inpFeatures[i].value);
    }
    return selected;
  };

  // получем данные для фильтра тип жилья
  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterGuests = document.querySelector('#housing-guests');

  // связываем в одну функцию для фильтрации
  var filterAll = function () {
    var price = filterPrice.value;
    var type = filterType.value;
    var rooms = filterRooms.value;
    var guests = filterGuests.value;

    var filterInputsArr1 = document.querySelectorAll(
        '#housing-features input:checked'
    );
    var features = getActiveFeature(filterInputsArr1);

    // для фильтра
    var value = {
      price: price,
      type: type,
      rooms: rooms,
      guests: guests,
      features: features
    };

    window.removePins(); // удаляем все метки, чтобы загрузить нужные

    var debounceLoad = debounce(load);
    debounceLoad(window.Lab, value);
  };

  document
    .querySelector('.map__filters')
    .addEventListener('change', function () {
      filterAll();
    });
})();
