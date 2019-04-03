import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { Component } from 'react';
import ErrorBoundary from './errorBoundary';
import ConcertoForm from './concertoForm';

/**
 * This React component generates a React object for a bound model.
 */
var ConcertoFormWrapper =
/*#__PURE__*/
function (_Component) {
  _inherits(ConcertoFormWrapper, _Component);

  function ConcertoFormWrapper(props) {
    var _this;

    _classCallCheck(this, ConcertoFormWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConcertoFormWrapper).call(this, props));
    _this.form = React.createRef();
    return _this;
  }

  _createClass(ConcertoFormWrapper, [{
    key: "getForm",
    value: function getForm() {
      return this.form.current;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ErrorBoundary, null, React.createElement(ConcertoForm, Object.assign({
        key: this.props.type,
        ref: this.form
      }, this.props)));
    }
  }]);

  return ConcertoFormWrapper;
}(Component);

export default ConcertoFormWrapper;