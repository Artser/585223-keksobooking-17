'use strict';
(function () {
  var arrayRealty = [
    {
      title: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'
      ]
    },
    // {
    //   author: {
    //     avatar: 'img/avatars/user0' + i + '.png'
    //   }
    // },
    {
      offer: ['flat', 'house', 'bungalo']
    }
  ];
  // {
  // for (var i = 1; i <= 8; i++) {
  //  var locationX = generateRandomNumber(0, 0);
  //  var locationY = generateRandomNumber(130, 630);
  // }

  var data = [
    {
      author: {
        avatar: 'img/avatars/user01.png'
      },
      offer: {
        title: 'flat'
      },
      location: {
        x: 300,
        y: 300
      }
    }
  ];
  // //
  // // функция генерации случайных данных
  // var getRandomInteger = function (min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };
  // // DOM-элементы, соответствующие меткам на карте
  // var similarPinsElement = document.querySelector('.map__pins');
  // var similarPinTemplate = document
  //   .querySelector('template')
  //   .content.querySelector('.map__pin');

  // var renderPin = function (notice) {
  //   var pinElement = similarPinTemplate.cloneNode(true);
  //   var pinX = notice.location.x - 65;
  //   var pinY = notice.location.y - 65;
  //   pinElement.style = 'left: ' + pinX + 'px; top: ' + pinY + 'px;';
  //   pinElement.querySelector('.map__pin img').src = notice.author.avatar;
  //   pinElement.querySelector('.map__pin img').alt = notice.offer.title;
  //   return pinElement;
  // };
  var drawPin = function (template, dataobj) {
    var pin = template.cloneNode(true);
    var pinWidth = 46;
    var pinHeight = 62;
    pin.style.left = dataobj.location.x + pinWidth / 2 + 'px';
    pin.style.top = dataobj.location.y + pinHeight + 'px';
    pin.querySelector('img').src = dataobj.author.avatar;
    pin.querySelector('img').alt = 'Большая уютная квартира';

    return pin;
  };

  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  var pinsFragment = document.createDocumentFragment();
  var template = document.querySelector('#pin').content; // ищем тег template и берем всего содержимое
  var pinTemplate = template.querySelector('.map__pin'); // ищем элемент
  pinsFragment.appendChild(drawPin(pinTemplate, data[0])); // обращаемся к созданному элементу pinsFragment и создем потомков
})();
