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
    const styles = parameters.customClasses;
    const id = enumDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
    return React.createElement("div", {
      className: styles.field,
      key: id
    }, React.createElement("label", null, Utilities.normalizeLabel(enumDeclaration.getName()), ":"), React.createElement("select", {
      className: styles.enumeration
    }, enumDeclaration.getOwnProperties().map(property => {
      return property.accept(this, parameters);
    })));
  }
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitClassDeclaration(classDeclaration, parameters) {
    const styles = parameters.customClasses;

    if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
      const id = classDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
      return React.createElement("fieldset", {
        key: id
      }, React.createElement("h4", {
        className: styles.declarationHeader
      }, Utilities.normalizeLabel(classDeclaration.getName())), React.createElement("div", {
        name: classDeclaration.getName()
      }, classDeclaration.getOwnProperties().map(property => {
        return property.accept(this, parameters);
      })));
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


  visitField(field, parameters) {
    const styles = parameters.customClasses;
    let style = styles.field;

    if (!field.isOptional()) {
      style += ' ' + styles.required;
    }

    if (field.isArray()) {
      return React.createElement("div", {
        className: style,
        key: field.getName()
      }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("textarea", {
        rows: "4"
      }));
    }

    if (field.isPrimitive()) {
      if (field.getType() === 'Boolean') {
        return React.createElement("div", {
          className: styles.field,
          key: field.getName()
        }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("div", {
          className: styles.boolean
        }, React.createElement("input", {
          type: "checkbox"
        }), React.createElement("label", null)));
      }

      return React.createElement("div", {
        className: style,
        key: field.getName()
      }, React.createElement("label", null, Utilities.normalizeLabel(field.getName())), React.createElement("input", {
        type: this.toFieldType(field.getType()),
        className: styles.input,
        id: field.getName()
      }));
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      return React.createElement("div", {
        className: style,
        key: field.getName()
      }, type.accept(this, parameters));
    }
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
    const styles = parameters.customClasses;
    let fieldStyle = styles.field;

    if (!relationship.isOptional()) {
      fieldStyle += ' ' + styles.required;
    }

    return React.createElement("div", {
      className: fieldStyle,
      key: relationship.getName()
    }, React.createElement("label", null, Utilities.normalizeLabel(relationship.getName())), React.createElement("input", {
      type: "text",
      className: styles.input,
      id: relationship.getName()
    }));
  }
  /**
   * @param {object} result - the result of the visitor
   * @param {object} parameters - the visitor parameters
   * @returns {object} - a HTML string
   */


  wrapHtmlForm(result, parameters) {
    return React.createElement("form", null, parameters.fileWriter.getBuffer());
  }

}

module.exports = ReactFormVisitor;