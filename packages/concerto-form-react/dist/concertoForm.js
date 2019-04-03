import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
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
import ReactFormVisitor from './reactformvisitor';
import './concertoForm.css';
import jsonpath from 'jsonpath';
import { FormGenerator } from 'concerto-form-core';
/**
 * This React component generates a React object for a bound model.
 */

var ConcertoForm =
/*#__PURE__*/
function (_Component) {
  _inherits(ConcertoForm, _Component);

  function ConcertoForm(props) {
    var _this;

    _classCallCheck(this, ConcertoForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConcertoForm).call(this, props));
    _this.onFieldValueChange = _this.onFieldValueChange.bind(_assertThisInitialized(_this));
    _this.state = {
      // A mutable copy of this.props.json
      // This is needed so that we can use the jsonpath library to change object properties by key
      // using the jsonpath module, without modifying the props object
      value: null
    }; // Default values which can be overridden by parent components

    _this.options = Object.assign({
      includeOptionalFields: true,
      includeSampleData: 'sample',
      disabled: props.readOnly,
      visitor: new ReactFormVisitor(),
      // CSS Styling, specify classnames
      customClasses: {
        field: 'ui field',
        declaration: 'ui field',
        declarationHeader: 'ui dividing header',
        enumeration: 'ui fluid dropdown',
        required: 'ui required',
        boolean: 'ui toggle checkbox',
        button: 'ui fluid button'
      },
      onFieldValueChange: function onFieldValueChange(e, key) {
        _this.onFieldValueChange(e, key);
      },
      addElement: function addElement(e, key, field) {
        _this.addElement(e, key, field);
      },
      removeElement: function removeElement(e, key, index) {
        _this.removeElement(e, key, index);
      }
    }, props.options);
    _this.generator = new FormGenerator(_this.options);
    return _this;
  }

  _createClass(ConcertoForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this._loadAsyncData().then(function (modelProps) {
        _this2.props.onModelChange(modelProps);
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      if (this.props.model !== prevProps.model) {
        this._loadAsyncData().then(function (modelProps) {
          _this3.props.onModelChange(modelProps);
        });
      }
    }
  }, {
    key: "loadModelFile",
    value: function () {
      var _loadModelFile = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(file, type) {
        var types, json, fqn;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fqn = this.props.type;
                _context.prev = 1;
                _context.next = 4;
                return this.generator.loadFromText(file);

              case 4:
                types = _context.sent;
                _context.next = 11;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);
                console.error(_context.t0); // Set default values to avoid trying to render a bad model
                // Don't change the JSON, it might be valid once the model file is fixed

                return _context.abrupt("return", {
                  types: []
                });

              case 11:
                if (types.map(function (t) {
                  return t.getFullyQualifiedName();
                }).includes(this.props.type)) {
                  _context.next = 15;
                  break;
                }

                fqn = types[0].getFullyQualifiedName();
                json = this.generateJSON(fqn);
                return _context.abrupt("return", {
                  types: types,
                  json: json,
                  fqn: fqn
                });

              case 15:
                json = this.generateJSON(this.props.type);
                return _context.abrupt("return", {
                  types: types,
                  json: json
                });

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7]]);
      }));

      function loadModelFile(_x, _x2) {
        return _loadModelFile.apply(this, arguments);
      }

      return loadModelFile;
    }()
  }, {
    key: "_loadAsyncData",
    value: function _loadAsyncData() {
      return this.loadModelFile(this.props.model, 'text');
    }
  }, {
    key: "removeElement",
    value: function removeElement(e, key, index) {
      var array = jsonpath.value(this.state.value, key);
      array.splice(index, 1);
      this.props.onValueChange(this.state.value);
    }
  }, {
    key: "addElement",
    value: function addElement(e, key, value) {
      var array = jsonpath.value(this.state.value, key);
      jsonpath.value(this.state.value, "".concat(key, ".").concat(array.length), value);
      this.props.onValueChange(this.state.value);
    }
  }, {
    key: "isInstanceOf",
    value: function isInstanceOf(model, type) {
      return this.generator.isInstanceOf(model, type);
    }
  }, {
    key: "generateJSON",
    value: function generateJSON(type) {
      // The type changed so we have to generate a new instance
      if (this.props.json && !this.isInstanceOf(this.props.json, type)) {
        return this.generator.generateJSON(type); // The instance is null so we have to create a new instance
      } else if (!this.props.json) {
        return this.generator.generateJSON(type);
      } // Otherwise, just use what we already have


      return this.props.json;
    }
  }, {
    key: "onFieldValueChange",
    value: function onFieldValueChange(e, key) {
      var value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      jsonpath.value(this.state.value, key, value);
      this.props.onValueChange(this.state.value);
    }
  }, {
    key: "renderForm",
    value: function renderForm() {
      if (this.props.type && this.state.value) {
        return this.generator.generateHTML(this.props.type, this.state.value);
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", {
        className: "ui form"
      }, this.renderForm());
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      return {
        value: props.json,
        warning: null
      };
    }
  }]);

  return ConcertoForm;
}(Component);

export default ConcertoForm;