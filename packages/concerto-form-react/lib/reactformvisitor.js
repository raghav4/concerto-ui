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
'use strict';

const React = require('react');

const {
  ClassDeclaration,
  Field,
  EnumDeclaration,
  EnumValueDeclaration
} = require('composer-concerto');

const {
  Utilities,
  HTMLFormVisitor
} = require('concerto-form-core');

Date.prototype.toDatetimeLocal = function toDatetimeLocal() {
  var date = this,
      ten = function (i) {
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


class ReactFormVisitor extends HTMLFormVisitor {
  /**
   * Visitor design pattern
   * @param {EnumDeclaration} enumDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitEnumDeclaration(enumDeclaration, parameters) {
    let component = null; // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
    // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']

    const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
    const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator + '.' + index);

    if (!parameters.state[jsonReference]) {
      parameters.state[jsonReference] = jsonValue;
    }

    const styles = parameters.customClasses;
    const id = enumDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
    component = React.createElement("div", {
      className: styles.field,
      key: id
    }, React.createElement("label", null, Utilities.normalizeLabel(enumDeclaration.getName()), ":"), React.createElement("select", {
      className: styles.enumeration,
      value: parameters.state[jsonReference],
      onChange: e => parameters.onChange(e, jsonReference),
      key: jsonReference
    }, enumDeclaration.getOwnProperties().map(property => {
      return property.accept(this, parameters);
    })));
    return component;
  }
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitClassDeclaration(classDeclaration, parameters) {
    let component = null;
    const styles = parameters.customClasses;

    if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
      const id = classDeclaration.getName().toLowerCase();
      component = React.createElement("fieldset", {
        key: id
      }, React.createElement("h4", {
        className: styles.declarationHeader
      }, Utilities.normalizeLabel(classDeclaration.getName())), React.createElement("div", {
        name: classDeclaration.getName()
      }, classDeclaration.getOwnProperties().map(property => {
        return property.accept(this, parameters);
      })));
    }

    parameters.stack.pop();
    return component;
  }
  /**
   * Visitor design pattern
   * @param {Field} field - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitField(field, parameters) {
    parameters.stack.push(field.getName()); // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
    // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']

    const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
    const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator + '.' + index);

    if (!parameters.state[jsonReference]) {
      parameters.state[jsonReference] = jsonValue;
    }

    let component = null;
    const styles = parameters.customClasses;
    let style = styles.field;

    if (!field.isOptional()) {
      style += ' ' + styles.required;
    }

    if (field.isArray()) {
      component = React.createElement("div", {
        className: style,
        key: field.getName() + '_wrapper'
      }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("textarea", {
        rows: "4",
        value: parameters.state[jsonReference],
        onChange: e => parameters.onChange(e, jsonReference),
        key: jsonReference
      }));
    } else if (field.isPrimitive()) {
      if (field.getType() === 'Boolean') {
        component = React.createElement("div", {
          className: styles.field,
          key: field.getName() + '_wrapper'
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("div", {
          className: styles.boolean
        }, React.createElement("input", {
          type: "checkbox",
          value: parameters.state[jsonReference],
          onChange: e => parameters.onChange(e, jsonReference),
          key: jsonReference
        }), React.createElement("label", null)));
      } else if (this.toFieldType(field.getType()) === 'datetime-local') {
        component = React.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("input", {
          type: this.toFieldType(field.getType()),
          className: styles.input,
          value: new Date(parameters.state[jsonReference]).toDatetimeLocal(),
          onChange: e => parameters.onChange(e, jsonReference),
          key: jsonReference
        }));
      } else {
        component = React.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("input", {
          type: this.toFieldType(field.getType()),
          className: styles.input,
          value: parameters.state[jsonReference],
          onChange: e => parameters.onChange(e, jsonReference),
          key: jsonReference
        }));
      }
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      component = React.createElement("div", {
        className: style,
        key: field.getName()
      }, type.accept(this, parameters));
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


  visitEnumValueDeclaration(enumValueDeclaration, parameters) {
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


  visitRelationship(relationship, parameters) {
    parameters.stack.push(relationship.getName());
    const styles = parameters.customClasses;
    let fieldStyle = styles.field;

    if (!relationship.isOptional()) {
      fieldStyle += ' ' + styles.required;
    } // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
    // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']


    const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
    const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator + '.' + index);

    if (!parameters.state[jsonReference]) {
      parameters.state[jsonReference] = jsonValue;
    }

    const component = React.createElement("div", {
      className: fieldStyle,
      key: relationship.getName()
    }, React.createElement("label", null, Utilities.normalizeLabel(relationship.getName())), React.createElement("input", {
      type: "text",
      className: styles.input,
      value: parameters.state[jsonReference],
      onChange: e => parameters.onChange(e, jsonReference),
      key: jsonReference
    }));
    parameters.stack.pop();
    return component;
  }
  /**
   * @param {object} result - the result of the visitor
   * @param {object} parameters - the visitor parameters
   * @returns {object} - a HTML string
   */


  wrapHtmlForm(result, parameters) {
    return React.createElement("form", null, result);
  }

}

module.exports = ReactFormVisitor;