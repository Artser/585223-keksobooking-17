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

    // валидация комнат гостей
    var filterRoom = document.querySelector('#room_number');
    var filterQuests = document.querySelector('#capacity');

    filterRoom.addEventListener('change', function (evt) {
      var value = evt.target.value;
      var qtyQuests = filterQuests.options[filterQuests.selectedIndex].value;
      if (value !== qtyQuests) {
        filterRoom.setCustomValidity('Wrong!');
        console.log('гости ' + qtyQuests);
      } else {
        filterRoom.setCustomValidity('Wrong');
      }
    });
    filterQuests.addEventListener('change', function (evt) {
      var value = evt.target.value;
      var qtyRoom = filterQuests.options[filterRoom.selectedIndex].value;
      if (value !== qtyRoom) {
        filterQuests.setCustomValidity('Wrong!');
        console.log('комнаты' + qtyRoom);
      } else {
        filterQuests.setCustomValidity('Wrong');
      }
    });
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
  });
})();
