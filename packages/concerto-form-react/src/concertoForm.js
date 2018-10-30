const React = require('react');
const Component = require('react').Component;
const jsonpath = require('jsonpath')

class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fromJSON = this.fromJSON.bind(this);
    this.state = {};
  }

  renderForm() {
    const options = {
      customClasses : {
          field: 'field',
          declaration: 'field',
          declarationHeader: 'ui dividing header',
          enumeration: 'ui fluid dropdown',
          required: 'required',
          boolean: 'ui toggle checkbox'
        },
        onChange: (e, key) => { 
          this.onChange(e, key);
        },
        state: this.state,
    };
    if(this.props.generator && this.props.model){
      const {form, json} = this.props.generator.generateHTML(this.props.model, options);
      return form;
    }
    
  } 

  toJSON(){
    const json = {
      $class: this.props.model
    };
    Object.keys(this.state).map((key)=>{
      jsonpath.value(json, key, this.state[key]);
    });
    return JSON.stringify(json);
  }

  fromJSON(e){
    const json = JSON.parse(e.target.value);
    const paths = jsonpath.paths(json, '$..*');
    const state = this.state;
    paths.map((path)=>{
      const key = jsonpath.stringify(path);
      state[key] = jsonpath.value(json,key);
    });
    this.setState(state);
  }

  onChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [key]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (<form className="ui form" onSubmit={this.handleSubmit}>
        {this.renderForm()}
        <div className=''>
          <button type='submit'>Validate</button>
        </div>
        <div className='ui form field'>
          <textarea value={this.toJSON()} onChange={this.fromJSON}/>
        </div>
    </form>);
  }
}

module.exports = ConcertoForm;
