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

const React = require('react');
const Component = require('react').Component;
const jsonpath = require('jsonpath');
const ReactFormVisitor = require('./reactformvisitor');
const PropTypes = require('prop-types');
const {FormGenerator} = require('concerto-form-core');

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onFieldValueChange = this.onFieldValueChange.bind(this);

    this.state = {
      // A mutable copy of this.props.json
      // This is needed so that we can use the jsonpath library to change object properties by key
      // using the jsonpath module, without modifying the props object
      value: null,

      form: null,

    };

    // Default values which can be overridden by parent components
    this.options = Object.assign({
      includeOptionalFields: true,
      includeSampleData: null,
      disabled: props.readOnly,
      visitor: new ReactFormVisitor(),
      // CSS Styling, specify classnames
      customClasses : {
        field: 'ui field',
        declaration: 'ui field',
        declarationHeader: 'ui dividing header',
        enumeration: 'ui fluid dropdown',
        required: 'ui required',
        boolean: 'ui toggle checkbox',
        button: 'ui fluid button'
      },
      onFieldValueChange: (e, key) => {
        this.onFieldValueChange(e, key);
      },
      addElement: (e, key, field) => {
        this.addElement(e, key, field);
      },
      removeElement: (e, key, index) => {
        this.removeElement(e, key, index);
      },
    }, props.options);
    this.generator = new FormGenerator(this.options);
  }

  async loadModelFile(file, type) {
    try {
      let types;
      if  (type === 'text') {
        types = await this.generator.loadFromText(file);
      } else if (type === 'url') {
        types = await this.generator.loadFromUrl(file);
      }
      this.props.onModelChange(types);
    } catch (error) {
      console.error(error);
    }
  }

  static getDerivedStateFromProps(props, state){
    return { value: props.json || {}, warning: null};
  }

  async componentDidMount(){
    if (this.props.modelFile) {
      await this.loadModelFile(this.props.modelFile, 'text');
    }

    if (this.props.modelUrl) {
      await this.loadModelFile(this.props.modelUrl, 'url');
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.modelFile !== this.props.modelFile) {
      await this.loadModelFile(this.props.modelFile, 'text');
    }
    if (prevProps.modelUrl !== this.props.modelUrl) {
      await this.loadModelFile(this.props.modelUrl, 'url');
    }
  }

  removeElement(e, key, index){
    const array = jsonpath.value(this.state.value, key);
    array.splice(index, 1);
    this.props.onValueChange(this.state.value);
  }

  addElement(e, key, value){
    const array = jsonpath.value(this.state.value, key);
    jsonpath.value(this.state.value,`${key}.${array.length}`, value);
    this.props.onValueChange(this.state.value);
  }

  isInstanceOf(model, type){
    return this.generator.isInstanceOf(model, type);
  }

  generateJSON(type){
    return this.generator.generateJSON(type);
  }

  onFieldValueChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    jsonpath.value(this.state.value, key, value);
    this.props.onValueChange(this.state.value);
  }

  renderForm(){
    if (this.props.model && this.state.value) {
      return this.generator.generateHTML(this.props.model, this.state.value);
    }
    return null;
  }

  render() {
    return (
        <form className="ui form">
          {this.renderForm()}
        </form>
    );
  }
}

ConcertoForm.propTypes = {
  modelFile: PropTypes.string,
  modelUrl: PropTypes.string,
  model: PropTypes.string,
  json: PropTypes.object,
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
};

module.exports = ConcertoForm;
