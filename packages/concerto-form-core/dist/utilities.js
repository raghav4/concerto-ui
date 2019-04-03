import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

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

/**
 *
 */
var Utilities =
/*#__PURE__*/
function () {
  function Utilities() {
    _classCallCheck(this, Utilities);
  }

  _createClass(Utilities, null, [{
    key: "normalizeLabel",

    /**
     * Inserts correct spacing and capitalization to a camelCase label
     * @param {string} labelName - the label text to be transformed
     * @returns {string} - The label text formatted for rendering
     */
    value: function normalizeLabel(labelName) {
      return labelName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([a-z])/g, ' $1$2').replace(/ +/g, ' ').replace(/^./, function (str) {
        return str.toUpperCase();
      }).trim();
    }
  }]);

  return Utilities;
}();

module.exports = Utilities;