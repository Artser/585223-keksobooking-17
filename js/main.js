'use strict';

var arrayRealty = [
  {
    title: {
      "Большая уютная квартира" ,
      "Маленькая неуютная квартира" ,
      'Огромный прекрасный дворец' ,
      'Маленький ужасный дворец' ,
      'Красивый гостевой домик' ,
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    }
  },
  {
    author: {
      avatar: 'img/avatars/user0' + i + '.png'
    }
  },
  {
    offer: {
      'flat',
      'house',
      'bungalo'
    }
  },
  {
    for (var i = 1; i <= 8; i++) {
      var locationX = generateRandomNumber(0, 0);
      var locationY = generateRandomNumber(130, 630);
    }
  ]
var notices = [];
notices[i] = {
    author: {
      avatar: 'img/avatars/user0' + randomAvatar[i] + '.png'
    },
    offer: {
      title: randomTitle[i],
      address: x + ', ' + y,
    },
    location: {
      x: x,
      y: y
    }
};
}
//функция генерации случайных данных
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
//DOM-элементы, соответствующие меткам на карте
var similarPinsElement = document.querySelector('.map__pins');
var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderPin = function (notice) {
  var pinElement = similarPinTemplate.cloneNode(true);
  var pinX = notice.location.x - 65;
  var pinY = notice.location.y - 65;
  pinElement.style = 'left: ' + pinX + 'px; top: ' + pinY + 'px;';
  pinElement.querySelector('.map__pin img').src = notice.author.avatar;
  pinElement.querySelector('.map__pin img').alt = notice.offer.title;
  return pinElement;
};
