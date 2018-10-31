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

Date.prototype.toDatetimeLocal =
  function toDatetimeLocal() {
    var
      date = this,
      ten = function (i) {
        return (i < 10 ? '0' : '') + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds())
    ;
    return YYYY + '-' + MM + '-' + DD + 'T' +
             HH + ':' + II + ':' + SS;
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
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitClassDeclaration(classDeclaration, parameters) {
        let component = null;

        const styles = parameters.customClasses;
        if(!classDeclaration.isSystemType() &&
        !classDeclaration.isAbstract()) {
            const id = classDeclaration.getName().toLowerCase();
            if(parameters.stack.length === 0) {
                component = (
                    <div key={id}>
                        <div name={classDeclaration.getName()}>
                        
                        {classDeclaration.getProperties().map((property) => {
                            return property.accept(this,parameters);
                        })}
                        </div>
                    </div>
                    );
            } else {
                component = (
                <fieldset key={id}>
                    <div name={classDeclaration.getName()}>
                    
                    {classDeclaration.getProperties().map((property) => {
                        return property.accept(this,parameters);
                    })}
                    </div>
                </fieldset>
                );
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
    visitEnumDeclaration(enumDeclaration, parameters) {
        let component = null;

        // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
        // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']
        const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
        const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator+'.'+index);
        if(!parameters.state.json[jsonReference]){
            parameters.state.json[jsonReference] = jsonValue;
        }

        const styles = parameters.customClasses;
        const id = enumDeclaration.getName().toLowerCase();
        component = (<div className={styles.field} key={id}>
          <select className={styles.enumeration}
            value={parameters.state.json[jsonReference]}
            onChange={(e)=>parameters.onChange(e, jsonReference)}
            key={jsonReference} >
          {enumDeclaration.getOwnProperties().map((property) => {
              return property.accept(this,parameters);
          })}
          </select>
        </div>);

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
        parameters.stack.push(field.getName());

        // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
        // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']
        const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
        const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator+'.'+index);
        if(!parameters.state.json[jsonReference]){
            parameters.state.json[jsonReference] = jsonValue;
        }
                
        let component = null;

        const styles = parameters.customClasses;
        let style = styles.field;
        if(!field.isOptional()){
          style += ' ' + styles.required;
        }

        if (field.isArray()) {
            component = (<div className={style} key={field.getName()+'_wrapper'}>
                <label>{Utilities.normalizeLabel(field.getName())}</label>
                <textarea rows='4'
                    value={parameters.state[jsonReference]}
                    onChange={(e)=>parameters.onChange(e, jsonReference)}
                    key={jsonReference} />               
            </div>);
        } else if (field.isPrimitive()) {
            if(field.getType() === 'Boolean'){
                component = (<div className={styles.field} key={field.getName()+'_wrapper'}>
                    <label>{Utilities.normalizeLabel(field.getName())}</label>
                    <div className={styles.boolean}>
                        <input type="checkbox"
                        checked={parameters.state.json[jsonReference]}
                        value={parameters.state.json[jsonReference]}
                        onChange={(e)=>parameters.onChange(e, jsonReference)}
                        key={jsonReference} />   
                        <label/>
                    </div>
                </div>);
            } else if(this.toFieldType(field.getType()) === 'datetime-local'){
                component = (<div className={style} key={field.getName()+'_wrapper'}>
                    <label>{Utilities.normalizeLabel(field.getName())}</label>
                    <input type={this.toFieldType(field.getType())}
                        className={styles.input}
                        value={new Date(parameters.state.json[jsonReference]).toDatetimeLocal()}
                        onChange={(e)=>parameters.onChange(e, jsonReference)}
                        key={jsonReference} />            
                </div>);
            } else {
                component = (<div className={style} key={field.getName()+'_wrapper'}>
                    <label>{Utilities.normalizeLabel(field.getName())}</label>
                    <input type={this.toFieldType(field.getType())}
                        className={styles.input}
                        value={parameters.state.json[jsonReference]}
                        onChange={(e)=>parameters.onChange(e, jsonReference)}
                        key={jsonReference} />            
                </div>);
            }
        } else {
            let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
            type = this.findConcreteSubclass(type);
            component = (<div className={style} key={field.getName()}>
                <label>{Utilities.normalizeLabel(field.getName())}</label>
                {type.accept(this, parameters)}
            </div>);
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
        parameters.stack.push(relationship.getName());

        const styles = parameters.customClasses;
        let fieldStyle = styles.field;
        if(!relationship.isOptional()){
            fieldStyle += ' ' + styles.required;
        }

        // Use the current stack i.e. ['bond', 'currency', 'currencyCode'] to resolve the value
        // in the JSON serialization of the declaration, i.e. json['bond']['currency']['currencyCode']
        const jsonValue = parameters.stack.reduce((accumulator, index) => accumulator[index], parameters.json);
        const jsonReference = '$.' + parameters.stack.reduce((accumulator, index) => accumulator+'.'+index);
        if(!parameters.state.json[jsonReference]){
            parameters.state.json[jsonReference] = jsonValue;
        }
        const component = (<div className={fieldStyle} key={relationship.getName()}>
            <label>{Utilities.normalizeLabel(relationship.getName())}</label>
            <input 
                type='text'
                className={styles.input}
                value={parameters.state.json[jsonReference]}
                onChange={(e)=>parameters.onChange(e, jsonReference)}
                key={jsonReference}
                />
        </div>);

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
    findConcreteSubclass(declaration) {
        if (!declaration.isAbstract()) {
            return declaration;
        }

        const concreteSubclasses = declaration.getAssignableClassDeclarations()
            .filter(subclass => !subclass.isAbstract())
            .filter(subclass => !subclass.isSystemType());

        if (concreteSubclasses.length === 0) {
            throw new Error('No concrete subclasses found');
        }

        return concreteSubclasses[0];
    }
}

module.exports = ReactFormVisitor;
