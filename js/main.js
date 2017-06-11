'use strict';

var _vitaminp = require('vitaminp');

var _workify = require('workify');

var _workify2 = _interopRequireDefault(_workify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worker = 1 ? (0, _workify2.default)('./app') : require('./app').default;
var dispatch = (0, _vitaminp.createApp)(document.body, worker);

dispatch({ type: null });
