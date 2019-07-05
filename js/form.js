('use strict');
(function () {
  window.showForm = function () {
    var form = document.querySelector('.ad-form');
    document.querySelector('.map__filters').disabled = true;
    form.classList.remove('ad-form--disabled');

    document
      .querySelectorAll('form.ad-form fieldset, .map__filters select, .map__filters fieldset')
      .forEach(function (element) {
        element.removeAttribute('disabled');
      });
  };

  window.disabledForm = function () {
    document.querySelectorAll('form.ad-form fieldset, .map__filters select, .map__filters fieldset').forEach(function (evt) {
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
    // timeIn.addEventListener('change', function (evt) {
    //   var value = evt.target.value;
    //   if (value === '12:00') {
    //     timeOut.value = '12:00';
    //   } else if (value === '13:00') {
    //     timeOut.value = '13:00';
    //   } else if (value === '14:00') {
    //     timeOut.value = '14:00';
    //   }
    // });
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
