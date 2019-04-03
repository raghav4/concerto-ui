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
import React from 'react';
import jsonpath from 'jsonpath';
import { Utilities, HTMLFormVisitor } from 'concerto-form-core';
/**
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @private
 * @class
 * @memberof module:composer-common
 */

var ReactFormVisitor =
/*#__PURE__*/
function (_HTMLFormVisitor) {
  _inherits(ReactFormVisitor, _HTMLFormVisitor);

  function ReactFormVisitor() {
    _classCallCheck(this, ReactFormVisitor);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReactFormVisitor).apply(this, arguments));
  }

  _createClass(ReactFormVisitor, [{
    key: "visitClassDeclaration",

    /**
     * Visitor design pattern
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    value: function visitClassDeclaration(classDeclaration, parameters) {
      var _this = this;

      var component = null;

      if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
        var id = classDeclaration.getName().toLowerCase();

        if (parameters.stack.length === 0) {
          component = React.createElement("div", {
            key: id
          }, React.createElement("div", {
            name: classDeclaration.getName()
          }, classDeclaration.getProperties().map(function (property) {
            return property.accept(_this, parameters);
          })));
        } else {
          component = React.createElement("fieldset", {
            key: id
          }, React.createElement("div", {
            name: classDeclaration.getName()
          }, classDeclaration.getProperties().map(function (property) {
            return property.accept(_this, parameters);
          })));
        }
      }

      return component;
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
      var _this2 = this;

      var component = null;
      var key = jsonpath.stringify(parameters.stack);
      var value = jsonpath.value(parameters.json, key);
      var styles = parameters.customClasses;
      var id = enumDeclaration.getName().toLowerCase();
      component = React.createElement("div", {
        className: styles.field,
        key: id
      }, React.createElement("select", {
        className: styles.enumeration,
        value: value,
        onChange: function onChange(e) {
          return parameters.onFieldValueChange(e, key);
        },
        key: key
      }, enumDeclaration.getProperties().map(function (property) {
        return property.accept(_this2, parameters);
      })));
      return component;
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
      var _this3 = this;

      parameters.stack.push(field.getName());
      var key = jsonpath.stringify(parameters.stack);
      var value = jsonpath.value(parameters.json, key);
      var component = null;
      var styles = parameters.customClasses;
      var style = styles.field;

      if (!field.isOptional()) {
        style += ' ' + styles.required;
      }

      if (parameters.disabled) {
        style += ' readonly transparent';
      }

      if (field.isArray()) {
        var arrayField = function arrayField(field, parameters) {
          var key = jsonpath.stringify(parameters.stack);
          var value = jsonpath.value(parameters.json, key);

          if (field.isPrimitive()) {
            if (field.getType() === 'Boolean') {
              return React.createElement("div", {
                className: styles,
                key: field.getName() + '_wrapper'
              }, React.createElement("div", {
                className: styles.boolean
              }, React.createElement("input", {
                type: "checkbox",
                checked: value,
                value: value,
                onChange: function onChange(e) {
                  return parameters.onFieldValueChange(e, key);
                },
                key: key
              }), React.createElement("label", null)));
            } else if (_this3.toFieldType(field.getType()) === 'datetime-local') {
              return React.createElement("div", {
                className: style,
                key: field.getName() + '_wrapper'
              }, React.createElement("input", {
                type: _this3.toFieldType(field.getType()),
                className: styles.input,
                value: new Date(value).toDatetimeLocal(),
                onChange: function onChange(e) {
                  return parameters.onFieldValueChange(e, key);
                },
                key: key
              }));
            } else {
              return React.createElement("div", {
                className: style,
                key: field.getName() + '_wrapper'
              }, React.createElement("input", {
                type: _this3.toFieldType(field.getType()),
                className: styles.input,
                value: value,
                onChange: function onChange(e) {
                  return parameters.onFieldValueChange(e, key);
                },
                key: key
              }));
            }
          } else {
            var type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
            type = _this3.findConcreteSubclass(type);
            return type.accept(_this3, parameters);
          }
        };

        var defaultValue = null;

        if (field.isPrimitive()) {
          defaultValue = this.convertToJSON(field);
        } else {
          var type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
          type = this.findConcreteSubclass(type);

          if (type.isConcept()) {
            var concept = parameters.modelManager.getFactory().newConcept(type.getNamespace(), type.getName(), {
              includeOptionalFields: true,
              generate: 'sample'
            });
            defaultValue = parameters.modelManager.getSerializer().toJSON(concept);
          } else {
            var resource = parameters.modelManager.getFactory().newResource(type.getNamespace(), type.getName(), 'resource1', {
              includeOptionalFields: true,
              generate: 'sample'
            });
            defaultValue = parameters.modelManager.getSerializer().toJSON(resource);
          }
        }

        component = React.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("fieldset", null, value.map(function (element, index) {
          parameters.stack.push(index);
          var arrayComponent = React.createElement("div", {
            key: field.getName() + '_wrapper[' + index + ']'
          }, arrayField(field, parameters), React.createElement("input", {
            type: "button",
            className: styles.button,
            value: "Delete",
            onClick: function onClick(e) {
              parameters.removeElement(e, key, index);
            }
          }));
          parameters.stack.pop();
          return arrayComponent;
        })), React.createElement("input", {
          type: "button",
          className: styles.button,
          value: "Add",
          onClick: function onClick(e) {
            parameters.addElement(e, key, defaultValue);
          }
        }));
      } else if (field.isPrimitive()) {
        if (field.getType() === 'Boolean') {
          component = React.createElement("div", {
            className: style,
            key: field.getName() + '_wrapper'
          }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("div", {
            className: styles.boolean
          }, React.createElement("input", {
            type: "checkbox",
            checked: value,
            value: value,
            onChange: function onChange(e) {
              return parameters.onFieldValueChange(e, key);
            },
            key: key
          }), React.createElement("label", null)));
        } else if (this.toFieldType(field.getType()) === 'datetime-local') {
          component = React.createElement("div", {
            className: style,
            key: field.getName() + '_wrapper'
          }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("input", {
            type: this.toFieldType(field.getType()),
            className: styles.input,
            value: new Date(value).toDatetimeLocal(),
            onChange: function onChange(e) {
              return parameters.onFieldValueChange(e, key);
            },
            key: key
          }));
        } else {
          component = React.createElement("div", {
            className: style,
            key: field.getName() + '_wrapper'
          }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("input", {
            type: this.toFieldType(field.getType()),
            className: styles.input,
            value: value,
            onChange: function onChange(e) {
              return parameters.onFieldValueChange(e, key);
            },
            key: key
          }));
        }
      } else {
        var _type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());

        _type = this.findConcreteSubclass(_type);
        component = React.createElement("div", {
          className: style,
          key: field.getName()
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), _type.accept(this, parameters));
      }

      parameters.stack.pop();
      return component;
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
      return React.createElement("option", {
        key: enumValueDeclaration.getName(),
        value: enumValueDeclaration.getName()
      }, enumValueDeclaration.getName());
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
      parameters.stack.push(relationship.getName());
      var styles = parameters.customClasses;
      var fieldStyle = styles.field;

      if (!relationship.isOptional()) {
        fieldStyle += ' ' + styles.required;
      }

      if (parameters.disabled) {
        fieldStyle += ' readonly transparent';
      }

      var key = jsonpath.stringify(parameters.stack);
      var value = jsonpath.value(parameters.json, key);
      var component;

      if (typeof value === 'object') {
        var type = parameters.modelManager.getType(value.$class);
        type = this.findConcreteSubclass(type);
        component = React.createElement("div", {
          className: fieldStyle,
          key: relationship.getName()
        }, React.createElement("label", null, Utilities.normalizeLabel(relationship.getName())), type.accept(this, parameters));
      } else {
        component = React.createElement("div", {
          className: fieldStyle,
          key: relationship.getName()
        }, React.createElement("label", null, Utilities.normalizeLabel(relationship.getName())), React.createElement("input", {
          type: "text",
          className: styles.input,
          value: value,
          onChange: function onChange(e) {
            return parameters.onFieldValueChange(e, key);
          },
          key: key
        }));
      }

      parameters.stack.pop();
      return component;
    }
    /**
     * Find a concrete type that extends the provided type. If the supplied type argument is
     * not abstract then it will be returned.
     * TODO: work out whether this has to be a leaf node or whether the closest type can be used
     * It depends really since the closest type will satisfy the model but whether it satisfies
     * any transaction code which attempts to use the generated resource is another matter.
     * @param {ClassDeclaration} declaration the class declaration.
     * @return {ClassDeclaration} the closest extending concrete class definition.
     * @throws {Error} if no concrete subclasses exist.
     */

  }, {
    key: "findConcreteSubclass",
    value: function findConcreteSubclass(declaration) {
      if (!declaration.isAbstract()) {
        return declaration;
      }

      var concreteSubclasses = declaration.getAssignableClassDeclarations().filter(function (subclass) {
        return !subclass.isAbstract();
      }).filter(function (subclass) {
        return !subclass.isSystemType();
      });

      if (concreteSubclasses.length === 0) {
        throw new Error('No concrete subclasses found');
      }

      return concreteSubclasses[0];
    }
    /**
     * Converts to JSON safe format.
     *
     * @param {Field} field - the field declaration of the object
     * @return {Object} the text JSON safe representation
     */

  }, {
    key: "convertToJSON",
    value: function convertToJSON(field) {
      switch (field.getType()) {
        case 'DateTime':
          {
            return new Date().toISOString();
          }

        case 'Integer':
          return 0;

        case 'Long':
        case 'Double':
          return 0.0;

        case 'Boolean':
          return false;

        default:
          return '';
      }
    }
  }]);

  return ReactFormVisitor;
}(HTMLFormVisitor);

Date.prototype.toDatetimeLocal = function toDatetimeLocal() {
  var date = this,
      ten = function ten(i) {
    return (i < 10 ? '0' : '') + i;
  },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds());

  return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II + ':' + SS;
};

export default ReactFormVisitor;