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
      } else if (value === 'flat') {
        price.setAttribute('min', 1000);
      } else if (value === 'house') {
        price.setAttribute('min', 5000);
      } else if (value === 'palace') {
        price.setAttribute('min', 10000);
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

    var ajaxSuccessMess = function () {
      var successTemplate = document
        .querySelector('#success')
        .content.querySelector('.success'); // ищем тег template и берем всего содержимое
      // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
      var successLog = successTemplate.cloneNode(true);

      successLog.addEventListener('click', function () {
        successLog.remove();
      });

      var closeEsc = function (evt) {
        var cl = document.querySelector('.success');
        if (evt.keyCode === 27) {
          cl.remove();
          var form1 = document.querySelector('.ad-form');
          form1.reset();
          document.removeEventListener('keydown', closeEsc);
          window.disabledForm();
          window.removePins();
          window.hiddenMap();
        }
      };
      document.addEventListener('keydown', closeEsc);
      // добавление элемента
      document.querySelector('main').appendChild(successLog);
    };

    var ajaxErrorMess = function (textM) {
      var errorTemplate = document
        .querySelector('#error')
        .content.querySelector('.error'); // ищем тег template и берем всего содержимое
      // создаст «глубокую» копию элемента – вместе с атрибутами, включая подэлементы
      var errorLog = errorTemplate.cloneNode(true);

      errorLog.querySelector('.error__message').textContent = textM;

      errorLog
        .querySelector('.error__button')
        .addEventListener('click', function () {
          errorLog.remove();
        });

      // добавление элемента
      document.querySelector('main').appendChild(errorLog);
    };

    window.clearPage = function () {
      var form1 = document.querySelector('.ad-form');
      form1.reset();

      window.disabledForm();
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

      xhr.onload = function () {
        switch (xhr.status) {
          case 200:
            ajaxSuccessMess();
            return;
          case 400:
            ajaxErrorMess('Неверный запрос');
            return;
          default:
            ajaxErrorMess(
                'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText
            );
            return;
        }
      };

      xhr.onerror = function () {
        ajaxErrorMess('Ошибка ' + this.status);
      };
    });
  });
})();
