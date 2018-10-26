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
   * @param {ModelManager} modelManager - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitModelManager(modelManager, parameters) {
    return modelManager.getModelFiles().map(modelFile => {
      return modelFile.accept(this, parameters);
    });
  }
  /**
   * Visitor design pattern
   * @param {ModelFile} modelFile - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitModelFile(modelFile, parameters) {
    const styles = parameters.customClasses;
    return modelFile.getAllDeclarations().map(decl => {
      return React.createElement("div", {
        key: decl.getName(),
        className: styles.declaration
      }, React.createElement("div", {
        className: styles.declarationHeader
      }, Utilities.normalizeLabel(decl.getName())), decl.accept(this, parameters));
    });
  }
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
    return null;
  }
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitClassDeclaration(classDeclaration, parameters) {
    if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
      const id = classDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
      return React.createElement("fieldset", {
        key: id
      }, React.createElement("legend", null, Utilities.normalizeLabel(classDeclaration.getName())), React.createElement("div", {
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
    let formField;

    if (field.isPrimitive()) {
      formField = React.createElement("input", {
        type: this.toFieldType(field.getType()),
        className: styles.input,
        id: field.getName()
      });
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      formField = type.accept(this, parameters);
    }

    let style = styles.field;

    if (!field.isOptional()) {
      style += ' ' + styles.required;
    }

    return React.createElement("div", {
      className: style,
      id: field.getName()
    }, React.createElement("label", null, Utilities.normalizeLabel(field.getName()), ":"), formField);
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
    }, Utilities.normalizeLabel(enumValueDeclaration.getName()));
  }
  /**
   * Visitor design pattern
   * @param {Relationship} relationship - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitRelationship(relationship, parameters) {
    // const styles = parameters.customClasses;
    // const div = `<div className="${''}">`;
    // const label = `<label for="${relationship.getName()}">${relationship.getName()}:</label>`;
    // let formField = `<input type="${this.toFieldType(relationship.getType())}" className='${styles.input}' id="${relationship.getName()}">`;
    // parameters.fileWriter.writeLine(1, div);
    // parameters.fileWriter.writeLine(2, label);
    // parameters.fileWriter.writeLine(2, formField);
    // parameters.fileWriter.writeLine(1, '</div>' );
    return null;
  }

}

module.exports = ReactFormVisitor;