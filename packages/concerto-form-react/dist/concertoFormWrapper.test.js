import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";

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
import React from 'react';
import ConcertoFormWrapper from './concertoFormWrapper';
import { mount } from 'enzyme';
import waitUntil from 'async-wait-until';
var options = {
  includeOptionalFields: true,
  includeSampleData: 'sample'
};
var model = "namespace org.hyperledger.concerto.form.test\n\nconcept Foo {\n  o String s\n  o Boolean b optional\n  o DateTime dt\n  o Integer i\n  o Double d\n  o Bar bar\n  o String[] ss\n  o Boolean[] bs\n  o DateTime[] dts\n  o Bar[] bars\n  o Nums n\n  --> MyAsset ref\n}\n\nenum Nums {\n  o ONE\n  o TWO\n}\n\nabstract concept Bar {\n  o String s\n}\n\nconcept Baz extends Bar{\n  o String t\n}\n\nasset MyAsset identified by id {\n  o String id\n}\n";
var type = 'org.hyperledger.concerto.form.test.Foo';
var json = {
  '$class': 'org.hyperledger.concerto.form.test.Foo',
  's': 'Ullamco eiusmod laborum.',
  'b': true,
  'dt': '2019-04-03T10:26:11.168+01:00',
  'i': 27587,
  'd': 70.808,
  'bar': {
    '$class': 'org.hyperledger.concerto.form.test.Baz',
    't': 'Enim.',
    's': 'Magna amet sit.'
  },
  'ss': ['Consectetur enim laborum Lorem fugiat.'],
  'bs': [false],
  'dts': ['2019-04-03T10:26:11.168+01:00'],
  'bars': [{
    '$class': 'org.hyperledger.concerto.form.test.Baz',
    't': 'Laborum.',
    's': 'Ut mollit.'
  }],
  'n': 'ONE',
  'ref': 'resource:org.hyperledger.concerto.form.test.MyAsset#2256'
};
test('Render form, default',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee() {
  var component, onModelChange, onValueChange;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          onModelChange = jest.fn(function (modelProps) {
            component.setProps(modelProps);
          });
          onValueChange = jest.fn();
          component = mount(React.createElement(ConcertoFormWrapper, {
            onModelChange: onModelChange,
            onValueChange: onValueChange,
            type: type,
            model: model,
            json: json,
            options: options
          }));
          _context.next = 5;
          return waitUntil(function () {
            return onModelChange.mock.calls.length > 0;
          }, 500);

        case 5:
          expect(onModelChange.mock.calls[0][0].types).toHaveLength(3);
          expect(component.html()).toMatchSnapshot();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test('Render form, no JSON provided',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee2() {
  var component, onModelChange, onValueChange;
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          onModelChange = jest.fn(function (modelProps) {
            component.setProps(modelProps);
          });
          onValueChange = jest.fn();
          component = mount(React.createElement(ConcertoFormWrapper, {
            onModelChange: onModelChange,
            onValueChange: onValueChange,
            type: type,
            model: model,
            options: options
          }));
          _context2.next = 5;
          return waitUntil(function () {
            return onModelChange.mock.calls.length > 0;
          }, 500);

        case 5:
          expect(onModelChange.mock.calls[0][0].types).toHaveLength(3);
          expect(component.html()).toMatchSnapshot();

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));