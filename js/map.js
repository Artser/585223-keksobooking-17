('use strict');
(function () {
  var Labels = [];
  var init = false;
  var load = function (data, value) {
    for (var item in data) {
      if ('offer' in data[item]) {
        Labels.push(data[item]);
      }
    }
    // отбираем значения по типу жилья
    Labels = Labels.filter(function (currentValue) {
      window.removeAllCards();

      if (currentValue.offer.type === value.type || value.type === 'any') {
        if (
          (value.price === 'low' && currentValue.offer.price < 10000) ||
          (value.price === 'middle' &&
            currentValue.offer.price >= 10000 &&
            currentValue.offer.price < 50000) ||
          (value.price === 'high' && currentValue.offer.price >= 50000) ||
          value.price === 'any'
        ) {
          if (
            currentValue.offer.rooms.toString() === value.rooms ||
            value.rooms === 'any'
          ) {
            if (
              currentValue.offer.guests.toString() === value.guests ||
              value.guests === 'any'
            ) {
              for (var i = 0; i < value.features.length; i++) {
                if (!currentValue.offer.features.includes(value.features[i])) {
                  return false;
                }
              }
              return true;
            }
          }
        }
      }

      return false;
    }).slice(0, 5); // пытаюсь получить 5 меток

    window.Lab = Labels;

    drawPins(Labels);
  };

  // удаляем метки, чтобы отрисовать те что нам нужны
  window.removePins = function () {
    document.querySelectorAll('.map__pin').forEach(function (val) {
      if (!val.classList.contains('map__pin--main')) {
        val.remove();
      }
    });
  };
  // после отправки формы помещаем кружочек в центр
  window.hiddenMap = function () {
    var map = document.querySelector('.map');
    map.classList.add('map--faded');
    document.querySelector('.map__pin--main').style = 'left: 570px; top: 375px';
    init = false;
  };
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

  var drawPins = function (data) {
    var mapPinsElement = document.querySelector('.map__pins');
    var pinsFragment = document.createDocumentFragment();
    // var n = 0;

    data.forEach(function (obj) {
      var n = data.indexOf(obj);
      pinsFragment.appendChild(drawPin(obj, n));
      // n++;
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
      document.onmousemove = function (evt) {
        var dx = evt.clientX - downX;
        var dy = evt.clientY - downY;
        if (Math.abs(dx) > 3 && Math.abs(dy) > 3) {
          if (!init) {
            // init = false
            // drawPins(Labels);
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

      document.onmouseup = function (evt) {
        document.onmousemove = null;
        document.onmouseup = null;
        updatePinCoordField();
        var dx = evt.clientX - downX;
        var dy = evt.clientY - downY;
        if (Math.abs(dx) > 3 && Math.abs(dy) > 3) {
          if (!init) {
            // drawPins(Labels);
            window.showForm();
            showMap();
            init = true;
            window.getAdverts(load);
          }
        }
      };
    });
  });

  // достать кликнутые элементы
  var getActiveFeature = function (inp) {
    var inp1 = [];
    for (var i = 0; i < inp.length; i++) {
      inp1.push(inp[i].value);
    }
    return inp1;
  };

  // получем данные для фильтра тип жилья
  var filterType = document.querySelector('#housing-type');

  var filterPrice = document.querySelector('#housing-price');

  var filterRooms = document.querySelector('#housing-rooms');

  var filterGuests = document.querySelector('#housing-guests');

  var filterInputsArr = document.querySelectorAll('#housing-features input');
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

    window.getAdverts(load, value); // вызываем функцию load и передаем тип жилья
    window.removePins(); // удаляем все метки, чтобы загрузить нужные
  };

  filterInputsArr.forEach(function (ob) {
    ob.addEventListener('change', function () {
      filterAll();
    });
  });

  filterPrice.addEventListener('change', function () {
    filterAll();
  });

  filterType.addEventListener('change', function () {
    filterAll();
  });

  filterRooms.addEventListener('change', function () {
    filterAll();
  });

  filterGuests.addEventListener('change', function () {
    filterAll();
  });

  // закрываем модальное окно клавишей esc
  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var cl = document.querySelector('.map__card');
    if (evt.keyCode === 27 && cl) {
      cl.remove();
    }
  };
})();
