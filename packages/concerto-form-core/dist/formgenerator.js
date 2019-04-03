import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
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
var ModelManager = require('composer-concerto').ModelManager;

var Factory = require('composer-concerto').Factory;

var Serializer = require('composer-concerto').Serializer;

var HTMLFormVisitor = require('./htmlformvisitor');
/**
* Used to generate a web from from a given composer model. Accepts string or file
* and assets.
*
* @class
* @memberof module:composer-form
*/


var FormGenerator =
/*#__PURE__*/
function () {
  /**
  * Create the FormGenerator.
  *
  * @param {object} options - form options
  * @param {boolean} options.includeOptionalFields - if true, optional fields will be generated
  * @param {boolean} options.includeSampleData - if set, this defines the kind of default values for a generated form
  * 'sample' uses random well-typed values
  * 'empty' provides sensible empty values
  * @param {object} options.disabled - if true, all form fields will be disabled
  * @param {object} options.visitor - a class that extends HTMLFormVisitor that generates HTML, defaults to HTMLFormVisitor
  * @param {object} options.customClasses - a custom CSS classes that can be applied to generated HTML
  * @param {ModelManager} options.modelManager - An optional custom model manager
  */
  function FormGenerator(options) {
    _classCallCheck(this, FormGenerator);

    this.modelManager = new ModelManager();
    this.modelManager.addModelFile("namespace org.accordproject.base\n        abstract asset Asset {  }\n        abstract participant Participant {  }\n        abstract transaction Transaction identified by transactionId {\n          o String transactionId\n        }\n        abstract event Event identified by eventId {\n          o String eventId\n        }", 'org.accordproject.base.cto', false, true);
    this.options = Object.assign({
      includeSampleData: 'empty'
    }, options); // this.modelManager = options.modelManager ? new options.modelManager() : new ModelManager();

    this.factory = new Factory(this.modelManager);
    this.serializer = new Serializer(this.factory, this.modelManager);
    this.loaded = false;
  }
  /**
  * Load a model from text.
  * @param {String} text  - the model
  * @returns {array} - A list of the types in the loaded model
  */


  _createClass(FormGenerator, [{
    key: "loadFromText",
    value: function () {
      var _loadFromText = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(text) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.loaded = false;
                this.modelManager.clearModelFiles();
                this.modelManager.addModelFile(text, undefined, true);
                _context.next = 5;
                return this.modelManager.updateExternalModels();

              case 5:
                this.loaded = true;
                return _context.abrupt("return", this.getTypes());

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadFromText(_x) {
        return _loadFromText.apply(this, arguments);
      }

      return loadFromText;
    }()
    /**
     * @returns {array} A list of types stored in the model manager
     */

  }, {
    key: "getTypes",
    value: function getTypes() {
      if (this.loaded) {
        return this.modelManager.getModelFiles().reduce(function (classDeclarations, modelFile) {
          return classDeclarations.concat(modelFile.getAllDeclarations());
        }, []).filter(function (classDeclaration) {
          return !classDeclaration.isEnum() && !classDeclaration.isAbstract();
        });
      }

      return [];
    }
    /**
     * Returns a validation error message if the provided JSON object is not a valid instance of a model
     * @param {object} json - a JSON instance of a model
     * @returns {string} - the validation message, or null if the object is valid
     */

  }, {
    key: "validateInstance",
    value: function validateInstance(json) {
      try {
        this.modelManager.getSerializer().fromJSON(json);
      } catch (error) {
        return error.message;
      }

      return null;
    }
    /**
     * Returns true if the provided JSON object is an instance a specified type
     * @param {object} model - a JSON instance of a model
     * @param {string} type - a fully qualified type name
     * @returns {boolean} - true if the provided JSON object is an instance a specified type
     */

  }, {
    key: "isInstanceOf",
    value: function isInstanceOf(model, type) {
      if (!model || !type) {
        return false;
      }

      try {
        return this.modelManager.getSerializer().fromJSON(model).instanceOf(type);
      } catch (error) {
        return false;
      }
    }
    /**
    * @param {Object} type - The type from the model source to generate a JSON for
    * @return {object} the generated JSON instance
    */

  }, {
    key: "generateJSON",
    value: function generateJSON(type) {
      if (this.loaded) {
        var classDeclaration = this.modelManager.getType(type);

        if (!classDeclaration) {
          throw new Error(type + ' not found');
        }

        if (classDeclaration.isEnum()) {
          throw new Error('Cannot generate JSON for an enumerated type directly, the type should be contained in Concept, Asset, Transaction or Event declaration');
        }

        if (classDeclaration.isAbstract()) {
          throw new Error('Cannot generate JSON for abstract types');
        }

        if (!this.options.includeSampleData) {
          throw new Error('Cannot generate form values when the component is configured not to generate sample data.');
        }

        var ns = classDeclaration.getNamespace();
        var name = classDeclaration.getName();
        var factoryOptions = {
          includeOptionalFields: this.options.includeOptionalFields,
          generate: this.options.includeSampleData
        };

        if (classDeclaration.isConcept()) {
          var concept = this.factory.newConcept(ns, name, factoryOptions);
          return this.serializer.toJSON(concept);
        } else {
          var resource = this.factory.newResource(ns, name, 'resource1', factoryOptions);
          return this.serializer.toJSON(resource);
        }
      }
    }
    /**
    * @param {Object} type - The type from the model source to generate a form for
    * @param {Object} json - A JSON instance that provides values for the form fields
    * @return {object} the generated HTML string
    */

  }, {
    key: "generateHTML",
    value: function generateHTML(type, json) {
      if (this.loaded) {
        var classDeclaration = this.modelManager.getType(type);

        if (!classDeclaration) {
          throw new Error(type + ' not found');
        }

        if (classDeclaration.isEnum()) {
          throw new Error('Cannot generate forms for an enumerated type directly, the type should be contained in Concept, Asset, Transaction or Event declaration');
        }

        if (classDeclaration.isAbstract()) {
          throw new Error('Cannot generate forms for abstract types');
        }

        var params = Object.assign({
          customClasses: {},
          timestamp: Date.now(),
          modelManager: this.modelManager,
          json: json,
          stack: []
        }, this.options);
        var visitor = params.visitor;

        if (!visitor) {
          visitor = new HTMLFormVisitor();
          params.wrapHtmlForm = true;
        }

        var form = classDeclaration.accept(visitor, params);

        if (params.wrapHtmlForm) {
          return visitor.wrapHtmlForm(form, params);
        }

        return classDeclaration.accept(params.visitor, params);
      }

      return null;
    }
  }]);

  return FormGenerator;
}();

module.exports = FormGenerator;