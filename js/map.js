('use strict');
(function () {
  var Labels = [];
  var load = function (data) {
    // Labels = data;
    for (var item in data) {
      if ('offer' in data[item]) {
        Labels.push(data[item]);
      }
    }
  };
  window.getAdverts(load);
  // с консультации код
  // Labels.forEach(function (value) {
  //   var template = document.querySelector('#card').content;
  //   var card = template.cloneNode(true);
  //   var avatar = card.querySelector('.popup__avatar'); // получили аватар
  //   avatar.setAttribute('src', value.author.avatar); // меняем атрибут src
  //   var title = card.querySelector('.popup__title');
  //   title.textContent = value.offer.title;
  //   var photos = card.querySelector('.popup__photos');
  //   var photo = card.querySelector('.popup__photo');
  //   value.offer.photos.forEach(function (value2) {
  //     var temp = photo.cloneNode(true);
  //     temp.setAttribute('src', value2);
  //     photos.appendChild(temp);
  //   });

  //   document.querySelector('.main').appendChild(card);
  // });
  var showMap = function () {
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
  };

  var drawPin = function (dataobj) {
    var template = document
      .querySelector('#pin')
      .content.querySelector('.map__pin'); // ищем тег template и берем всего содержимое
    var pin = template.cloneNode(true);
    pin.style.left = dataobj.location.x - window.PIN_WIDTH / 2 + 'px';
    pin.style.top = dataobj.location.y - window.PIN_HEIGHT + 'px';
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
  // var mapPins;
  // function onLoadSuccess(data) {
  //   console.log(data);
  // }

  // function onLoadError(data) {
  //   console.log(data);
  // }
  var mainPin;

  var updatePinCoordField = function () {
    var px =
      parseInt(mainPin.style.left, 10) + Math.floor(window.PIN_WIDTH / 2);
    var py = parseInt(mainPin.style.top, 10) + window.PIN_HEIGHT;
    document.querySelector('#address').value = px + ',' + py;
  };

  document.addEventListener('DOMContentLoaded', function () {
    mainPin = document.querySelector('.map__pin--main');
    // mapPins = document.querySelector('.map__pins');

    window.disabledForm();
    // updatePinCoordField();
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
            // newX > parseFloat(mapPins.style.height) - PIN_HEIGHT ||
            // newX < PIN_WIDTH / 2
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
