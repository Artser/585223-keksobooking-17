('use strict');
(function () {
  window.showForm = function () {
    var form = document.querySelector('.ad-form');
    document.querySelector('.map__filters').disabled = true;
    form.classList.remove('ad-form--disabled');

    document
      .querySelectorAll(
          'form.ad-form fieldset, .map__filters select, .map__filters fieldset'
      )
      .forEach(function (element) {
        element.removeAttribute('disabled');
      });
  };

  window.disabledForm = function () {
    document
      .querySelectorAll(
          'form.ad-form fieldset, .map__filters select, .map__filters fieldset'
      )
      .forEach(function (evt) {
        evt.setAttribute('disabled', 'disabled');
      });
    document.querySelector('.ad-form').classList.add('ad-form--disabled');
  };

  // form
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.ad-form.ad-form--disabled');
    // валидация полей формы
    var priceOfNight = form.querySelector('#type');
    priceOfNight.addEventListener('change', function (evt) {
      var value = evt.target.value;
      var price = form.querySelector('#price');
      if (value === 'bungalo') {
        price.setAttribute('min', 0);
        price.setAttribute('placeholder', 0);
      } else if (value === 'flat') {
        price.setAttribute('min', 1000);
        price.setAttribute('placeholder', 1000);
      } else if (value === 'house') {
        price.setAttribute('min', 5000);
        price.setAttribute('placeholder', 5000);
      } else if (value === 'palace') {
        price.setAttribute('min', 10000);
        price.setAttribute('placeholder', 10000);
      }
    });

    var timeIn = form.querySelector('#timein');
    var timeOut = form.querySelector('#timeout');
    timeIn.addEventListener('change', function (evt) {
      var value = evt.target.value;
      if (value === '12:00') {
        timeOut.value = '12:00';
      } else if (value === '13:00') {
        timeOut.value = '13:00';
      } else if (value === '14:00') {
        timeOut.value = '14:00';
      }
    });
    timeOut.addEventListener('change', function (evt) {
      var value = evt.target.value;
      if (value === '12:00') {
        timeIn.value = '12:00';
      } else if (value === '13:00') {
        timeIn.value = '13:00';
      } else if (value === '14:00') {
        timeIn.value = '14:00';
      }
    });
    // успешно отправлено - обновляем и стираем
    var closeSuccess = function () {
      var cl = document.querySelector('.success');
      if (cl) {
        cl.remove();
      }
      formSuccess.reset();
      window.disabledForm();
      window.removePins();
      window.movePin();
      window.popupClose();
      window.updatePinCoordField();
    };

    var cleanButton = document.querySelector('.ad-form__reset');
    cleanButton.addEventListener('click', closeSuccess);
    var formSuccess = document.querySelector('.ad-form');
    var treatSuccessMess = function () {
      var successTemplate = document
        .querySelector('#success')
        .content.querySelector('.success'); // ищем тег template и берем всего содержимое
      // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
      var successLog = successTemplate.cloneNode(true);
      // добавление элемента
      document.querySelector('main').appendChild(successLog);

      var closeClick = function () {
        closeSuccess();
        document.removeEventListener('click', closeClick);
      };

      var closeEsc = function (evt) {
        if (evt.keyCode === 27 || evt.keyCode === 13) {
          closeSuccess();
          document.removeEventListener('keydown', closeEsc);
        }
      };

      successLog.addEventListener('click', closeClick);

      document.addEventListener('keydown', closeEsc);
    };

    var treatErrorMess = function (textM) {
      var errorTemplate = document
        .querySelector('#error')
        .content.querySelector('.error'); // ищем тег template и берем всего содержимое
      // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
      var errorLog = errorTemplate.cloneNode(true);
      // добавление элемента
      document.querySelector('main').appendChild(errorLog);
      errorLog.querySelector('.error__message').textContent = textM;

      var errEsc = function (keyCode) {
        if (keyCode === 27) {
          errorLog.remove();
        }
      };

      var errRemove = function () {
        errorLog.remove();
      };

      errorLog
        .querySelector('.error__button')
        .addEventListener('click', function () {
          errEsc();
        });

      document.addEventListener('click', function () {
        errRemove();
      });

      document.addEventListener('keydown', function (evn) {
        errEsc(evn.keyCode);
      });
    };

    // валидация комнат гостей
    form
      .querySelector('.ad-form__submit')
      .addEventListener('click', function () {
        var filterRoom = document.querySelector('#room_number');
        var filterQuests = document.querySelector('#capacity');

        if (filterRoom.value < filterQuests.value) {
          filterRoom.setCustomValidity('Увеличьте количество комнат!');
          filterQuests.setCustomValidity('Увеличьте количество комнат!');
        } else {
          filterRoom.setCustomValidity('');
          filterQuests.setCustomValidity('');
        }
      });

    form.addEventListener('submit', function (evnt) {
      evnt.preventDefault();

      // создать объект для формы
      var formData = new FormData(form);

      // отослать
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://js.dump.academy/keksobooking/');
      xhr.send(formData);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            treatSuccessMess();
            return;
          case 400:
            treatErrorMess('Неверный запрос');
            return;
          default:
            treatErrorMess(
                'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText
            );
            return;
        }
      });

      xhr.onerror = function () {
        treatErrorMess('Ошибка ' + this.status);
      };
    });
  });
})();
