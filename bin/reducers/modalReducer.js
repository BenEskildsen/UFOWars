'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var modalReducer = function modalReducer(state, action) {
  switch (action.type) {
    case 'DISMISS_MODAL':
      return _extends({}, state, {
        modal: null
      });
    case 'SET_MODAL':
      return _extends({}, state, {
        modal: {
          title: action.title,
          text: action.text,
          buttons: [].concat(_toConsumableArray(action.buttons))
        }
      });
  }
};

module.exports = { modalReducer: modalReducer };