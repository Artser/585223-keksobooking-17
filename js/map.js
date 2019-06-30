('use strict');
(function () {
  var Labels = [];

  var load = function (data) {
    for (var item in data) {
      if ('offer' in data[item]) {
        Labels.push(data[item]);
        // load.slice(5, 10); // пытаюсь получить 5 меток
      }
    }
  };
  window.getAdverts(load);

  window.Lab = Labels;

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
    var n = 0;
    data.forEach(function (obj) {
      pinsFragment.appendChild(drawPin(obj, n));
      n++;
    });

    mapPinsElement.appendChild(pinsFragment);
  };

  var mainPin;

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

    var init = false;
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
            drawPins(Labels);
            window.showForm();
            showMap();
            init = true;
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
            drawPins(Labels);
            window.showForm();
            showMap();
            init = true;
          }
        }
      };
    });
  });
})();
