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
const axios = require('axios');
const fs = require('fs');
const ModelManager = require('composer-concerto').ModelManager;
const Factory = require('composer-concerto').Factory;
const Serializer = require('composer-concerto').Serializer;

const HTMLFormVisitor = require('./htmlformvisitor');
/**
* Used to generate a web from from a given composer model. Accepts string or file
* and assets.
*
* @class
* @memberof module:composer-form
*/
class FormGenerator {
    /**
    * Create the FormGenerator.
    *
    * @param {object} options - form options
    * @param {object} options.visitor - a class that extends HTMLFormVisitor that generates HTML, defaults to HTMLFormVisitor
    * @param {object} options.customClasses - a custom CSS classes that can be applied to generated HTML
    * @param {boolean} options.wrapHtmlForm - if true, the result will be wrapped in a <form> tag
    */
    constructor(options) {
        this.modelManager = new ModelManager();
        this.options = options;
        this.factory = new Factory(this.modelManager);
        this.serializer = new Serializer(this.factory, this.modelManager);
    }

    /**
    * Load a model from a file.
    * @param {String} path  - the path to a file
    */
    async loadFromFile(path) {
        this.modelManager.clearModelFiles();
        const model = await fs.readFileSync(path, 'utf8');
        this.modelManager.addModelFile(model, undefined, true);
        await this.modelManager.updateExternalModels();
    }

    /**
    * Load a model from text.
    * @param {String} text  - the model
    */
    async loadFromText(text) {
        this.modelManager.clearModelFiles();
        this.modelManager.addModelFile(text, undefined, true);
        await this.modelManager.updateExternalModels();
    }

    /**
    * Load a model from an URL.
    * @param {String} url  - the URL to a zip or cto archive
    */
    async loadFromUrl(url) {
        const request = {};
        request.url = url;
        request.method = 'get';
        request.responseType = 'text';
        request.timeout = 5000;

        try {
            const response = await axios(request);
            let text = await response.data.toString('utf8');
            this.modelManager.clearModelFiles();
            this.modelManager.addModelFile(text, undefined, true);
            await this.modelManager.updateExternalModels();
        } catch (error) {
            if (error.response) {
                throw new Error('Request to URL ['+ url +'] returned with error code: ' + error.response.status);
            } else if (error.request) {
                throw new Error('Server did not respond for URL ['+ url +']');
            } else {
                throw new Error('Error when accessing URL ['+ url +'] ' + error.message);
            }
        }
    }

    /**
     * @returns {array} A list of types stored in the model manager
     */
    getTypes(){
        return this.modelManager.getModelFiles()
            .reduce((classDeclarations, modelFile) => {
                return classDeclarations.concat(modelFile.getAllDeclarations());
            }, [])
            .filter(classDeclaration => {
                return !classDeclaration.isEnum() && !classDeclaration.isAbstract();
            });
    }

    /**
     * Returns a validation error message if the provided JSON object is not a valid instance of a model
     * @param {object} json - a JSON instance of a model
     * @returns {string} - the validation message, or null if the object is valid
     */
    validateInstance(json){
        try {
            this.modelManager.getSerializer().fromJSON(json);
        } catch (error) {
            return error.message;
        }
        return null;
    }

    /**
    * @param {Object} type - The type from the model source to generate a form for
    * @return {object} the generated HTML string
    */
    generateHTML (type, options) {
        const classDeclaration = this.modelManager.getType(type);
        if(!classDeclaration){
            throw new Error(type + ' not found');
        }

        if(classDeclaration.isEnum()){
            throw new Error('Cannot generate forms for an enumerated type directly, the type should be contained in Concept, Asset, Transaction or Event declaration');
        }

        if(classDeclaration.isAbstract()){
            throw new Error('Cannot generate forms for abstract types');
        }

        const ns = classDeclaration.getNamespace();
        const name = classDeclaration.getName();
        const factoryOptions =  { includeOptionalFields: true, generate: 'sample'};

        let json = options.json;
        if(classDeclaration.isConcept()){
            const concept = this.factory.newConcept(ns, name, factoryOptions);
            json = this.serializer.toJSON(concept);
        } else {
            const resource = this.factory.newResource(ns, name, 'resource1', factoryOptions);
            json = this.serializer.toJSON(resource);
        }

        const params = Object.assign({
            customClasses: {},
            timestamp: Date.now(),
            modelManager: this.modelManager,
            json,
            stack: [],
            handleChanged: () => {}
        }, options);

        let visitor = params.visitor;
        if(!visitor){
            visitor = new HTMLFormVisitor();
            params.wrapHtmlForm = true;
        }

        const html = classDeclaration.accept(visitor, params);
        if(params.wrapHtmlForm){
            return { html: visitor.wrapHtmlForm(html, params), json};
        }
        return { form: html, json };
    }

}

module.exports = FormGenerator;
