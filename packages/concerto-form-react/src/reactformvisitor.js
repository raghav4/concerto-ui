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
    EnumValueDeclaration,
  } = require('composer-concerto');
const {Utilities, HTMLFormVisitor} = require('concerto-form-core');

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
        return (<div className={styles.field} key={id}>
          <label>{Utilities.normalizeLabel(enumDeclaration.getName())}:</label>
          <select className={styles.enumeration}>
          {enumDeclaration.getOwnProperties().map((property) => {
              return property.accept(this,parameters);
          })}
          </select>
        </div>);
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
        if(!classDeclaration.isSystemType() &&
        !classDeclaration.isAbstract()) {
            const id = classDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
            return (
              <fieldset key={id}>
                <h4 className={styles.declarationHeader}>{Utilities.normalizeLabel(classDeclaration.getName())}</h4>
                <div name={classDeclaration.getName()}>
                
                {classDeclaration.getOwnProperties().map((property) => {
                    return property.accept(this,parameters);
                })}
                </div>
              </fieldset>
            );
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
        if(!field.isOptional()){
          style += ' ' + styles.required;
        }

        if (field.isArray()) {
            return (<div className={style} key={field.getName()}>
                <label>{Utilities.normalizeLabel(field.getName())}</label>
                <textarea rows='4'/>                
            </div>);
        }

        if (field.isPrimitive()) {
            if(field.getType() === 'Boolean'){
                return (<div className={styles.field} key={field.getName()}>
                    <label>{Utilities.normalizeLabel(field.getName())}</label>
                    <div className={styles.boolean}>
                        <input type="checkbox"/>
                        <label/>
                    </div>
                </div>);
            }
            return (<div className={style} key={field.getName()}>
                <label>{Utilities.normalizeLabel(field.getName())}</label>
                <input type={this.toFieldType(field.getType())} className={styles.input} id={field.getName()}/>                
            </div>);
        } else {
            let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
            return (<div className={style} key={field.getName()}>
                {type.accept(this, parameters)}
            </div>);
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
        return <option key={enumValueDeclaration.getName()} value={enumValueDeclaration.getName()}>{enumValueDeclaration.getName()}</option>
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
        if(!relationship.isOptional()){
            fieldStyle += ' ' + styles.required;
        }
        return (<div className={fieldStyle} key={relationship.getName()}>
            <label>{Utilities.normalizeLabel(relationship.getName())}</label>
            <input type='text' className={styles.input} id={relationship.getName()} />
        </div>);

    }

    /**
     * @param {object} result - the result of the visitor
     * @param {object} parameters - the visitor parameters
     * @returns {object} - a HTML string
     */
    wrapHtmlForm(result, parameters) {
      return (<form>{parameters.fileWriter.getBuffer()}</form>);
  }
}

module.exports = ReactFormVisitor;
