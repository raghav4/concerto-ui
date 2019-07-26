"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _errorBoundary = _interopRequireDefault(require("./errorBoundary"));

var _concertoForm = _interopRequireDefault(require("./concertoForm"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoFormWrapper extends _react.Component {
  constructor(props) {
    super(props);
    this.form = _react.default.createRef();
  }

  getForm() {
    return this.form.current;
  }

  render() {
    return _react.default.createElement(_errorBoundary.default, null, _react.default.createElement(_concertoForm.default, _extends({
      key: this.props.type,
      ref: this.form
    }, this.props)));
  }

}

ConcertoFormWrapper.propTypes = {
  models: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  type: _propTypes.default.string,
  json: _propTypes.default.object,
  onModelChange: _propTypes.default.func.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  options: _propTypes.default.object,
  readOnly: _propTypes.default.bool
};
var _default = ConcertoFormWrapper;
exports.default = _default;