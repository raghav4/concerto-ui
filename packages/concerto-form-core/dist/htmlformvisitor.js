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
var _require = require('composer-concerto'),
    ModelManager = _require.ModelManager,
    ModelFile = _require.ModelFile,
    ClassDeclaration = _require.ClassDeclaration,
    Field = _require.Field,
    RelationshipDeclaration = _require.RelationshipDeclaration,
    EnumDeclaration = _require.EnumDeclaration,
    EnumValueDeclaration = _require.EnumValueDeclaration;

var util = require('util');

var Writer = require('composer-concerto').Writer;
/**
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @class
 * @memberof module:composer-common
 */


var HTMLFormVisitor =
/*#__PURE__*/
function () {
  function HTMLFormVisitor() {
    _classCallCheck(this, HTMLFormVisitor);
  }

  _createClass(HTMLFormVisitor, [{
    key: "visit",

    /**
     * Visitor design pattern
     * @param {Object} thing - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    value: function visit(thing, parameters) {
      if (!parameters.fileWriter) {
        parameters.fileWriter = new Writer();
      }

      if (thing instanceof ModelManager) {
        return this.visitModelManager(thing, parameters);
      } else if (thing instanceof ModelFile) {
        return this.visitModelFile(thing, parameters);
      } else if (thing instanceof EnumDeclaration) {
        return this.visitEnumDeclaration(thing, parameters);
      } else if (thing instanceof ClassDeclaration) {
        return this.visitClassDeclaration(thing, parameters);
      } else if (thing instanceof Field) {
        return this.visitField(thing, parameters);
      } else if (thing instanceof RelationshipDeclaration) {
        return this.visitRelationship(thing, parameters);
      } else if (thing instanceof EnumValueDeclaration) {
        return this.visitEnumValueDeclaration(thing, parameters);
      } else {
        throw new Error('Unrecognised type: ' + typeof thing + ', value: ' + util.inspect(thing, {
          showHidden: true,
          depth: 2
        }));
      }
    }
    /**
     * Visitor design pattern
     * @param {EnumDeclaration} enumDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */

  }, {
    key: "visitEnumDeclaration",
    value: function visitEnumDeclaration(enumDeclaration, parameters) {
      var _this = this;

      var styles = parameters.customClasses;
      var id = enumDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
      var div = "<div  class='".concat(styles.field, "' id=\"form-").concat(id, "\" >");
      var label = "<label for=\"".concat(enumDeclaration.getName(), "\">").concat(enumDeclaration.getName(), ":</label>");
      parameters.fileWriter.writeLine(1, div);
      parameters.fileWriter.writeLine(2, label);
      parameters.fileWriter.writeLine(2, '<select>');
      enumDeclaration.getOwnProperties().forEach(function (property) {
        property.accept(_this, parameters);
      });
      parameters.fileWriter.writeLine(2, '</select>');
      parameters.fileWriter.writeLine(1, '</div>');
      return null;
    }
    /**
     * Visitor design pattern
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */

  }, {
    key: "visitClassDeclaration",
    value: function visitClassDeclaration(classDeclaration, parameters) {
      var _this2 = this;

      if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
        var id = classDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
        var form = "<h4>".concat(classDeclaration.getName(), "</h4>\n            <div name=\"").concat(classDeclaration.getName(), "\" id=\"form-").concat(id, "\">");
        parameters.fileWriter.writeLine(0, form);
        classDeclaration.getOwnProperties().forEach(function (property) {
          property.accept(_this2, parameters);
        });
        parameters.fileWriter.writeLine(0, '</div>');
      }

      return null;
    }
    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */

  }, {
    key: "visitField",
    value: function visitField(field, parameters) {
      var styles = parameters.customClasses;
      var div = "<div class=\"".concat(styles.field, " ").concat(parameters.disabled ? 'disabled' : '', "\">");
      var label = "<label for=\"".concat(field.getName(), "\">").concat(field.getName(), ":</label>");
      parameters.fileWriter.writeLine(1, div);
      parameters.fileWriter.writeLine(2, label);
      var formField;

      if (field.isPrimitive()) {
        formField = "<input type=\"".concat(this.toFieldType(field.getType()), "\" class=\"").concat(styles.input, "\" id=\"").concat(field.getName(), "\">");
        parameters.fileWriter.writeLine(2, formField);
      } else {
        parameters.fileWriter.writeLine(2, '<fieldset class="form-group">');
        var type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
        type.accept(this, parameters);
        parameters.fileWriter.writeLine(2, '</fieldset>');
      }

      parameters.fileWriter.writeLine(1, '</div>');
      return null;
    }
    /**
     * Visitor design pattern
     * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */

  }, {
    key: "visitEnumValueDeclaration",
    value: function visitEnumValueDeclaration(enumValueDeclaration, parameters) {
      parameters.fileWriter.writeLine(2, "<option value=\"".concat(enumValueDeclaration.getName(), "\">").concat(enumValueDeclaration.getName(), "</option>"));
      return null;
    }
    /**
     * Visitor design pattern
     * @param {Relationship} relationship - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */

  }, {
    key: "visitRelationship",
    value: function visitRelationship(relationship, parameters) {
      var styles = parameters.customClasses;
      var div = "<div class=\"".concat("\">");
      var label = "<label for=\"".concat(relationship.getName(), "\">").concat(relationship.getName(), ":</label>");
      var formField = "<input type=\"".concat(this.toFieldType(relationship.getType()), "\" class='").concat(styles.input, "' id=\"").concat(relationship.getName(), "\">");
      parameters.fileWriter.writeLine(1, div);
      parameters.fileWriter.writeLine(2, label);
      parameters.fileWriter.writeLine(2, formField);
      parameters.fileWriter.writeLine(1, '</div>');
      return null;
    }
    /**
     * Converts a Composer type to a Form field type. Primitive types are converted
     * everything else is passed through unchanged.
     * @param {string} type  - the composer type
     * @return {string} the corresponding Form field type
     * @private
     */

  }, {
    key: "toFieldType",
    value: function toFieldType(type) {
      switch (type) {
        case 'DateTime':
          return 'datetime-local';

        case 'Boolean':
          return 'boolean';

        case 'String':
          return 'text';

        case 'Double':
          return 'number';

        case 'Long':
          return 'number';

        case 'Integer':
          return 'number';

        default:
          return type;
      }
    }
    /**
     * @param {object} result - the result of the visitor
     * @param {object} parameters - the visitor parameters
     * @returns {object} - a HTML string
     */

  }, {
    key: "wrapHtmlForm",
    value: function wrapHtmlForm(result, parameters) {
      var html = '<form>';
      var text = parameters.fileWriter.getBuffer();
      html += "".concat(text, "\n        </form>");
      return html;
    }
  }]);

  return HTMLFormVisitor;
}();

module.exports = HTMLFormVisitor;