const React = require('react');
const Component = require('react').Component;
const jsonpath = require('jsonpath');
const ReactFormVisitor = require('concerto-form-react').ReactFormVisitor;
const {Message} = require('semantic-ui-react');

let options = {
  customClasses : {
      field: 'field',
      declaration: 'field',
      declarationHeader: 'ui dividing header',
      enumeration: 'ui fluid dropdown',
      required: 'required',
      boolean: 'ui toggle checkbox',
      button: 'ui fluid button'
    },
    visitor: new ReactFormVisitor(),
};

class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = {
      json: null,
      form: null,
    };
    // this.baseState = this.state;
    options = Object.assign(options, {
      state: this.state,
      onChange: (e, key) => { 
        this.onChange(e, key);
      },
      addElement: (e, key, value) => { 
        this.addElement(e, key, value);
      },
      removeElement: (e, key, index) => { 
        this.removeElement(e, key, index);
      },
    }) 
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.model changes, update state.
    if (nextProps.model !== this.props.model) {
      this.renderForm(nextProps.model, true);
    }
  }

  componentDidMount(){
    this.renderForm(this.props.model);
  }

  removeElement(e, key, index){
    const array = jsonpath.value(this.state.json, key);
    array.splice(index, 1);

    this.renderForm(this.props.model);
  }

  addElement(e, key, value){
    const array = jsonpath.value(this.state.json, key);
    let newValue = value;
    if(typeof value === 'object'){
      newValue = JSON.parse(JSON.stringify(value));
    }
    jsonpath.value(this.state.json,`${key}.${array.length}`, newValue);

    this.renderForm(this.props.model);
  }

  onChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    jsonpath.value(this.state.json, key, value);
    this.setState({warning: this.props.generator.validateInstance(this.state.json) });

    this.renderForm(this.props.model);
  }

  renderForm(model, reset){
    if(this.props.generator){
      options.state = this.state;
      if(reset){
        options.state = {
          json: null,
          form: null,
        };
      }
      const {form, json} = this.props.generator.generateHTML(model, options);
      this.setState({form, json})

      return {form, json};
    }    
  }

  render() {
    let warning = null;
    let jsonArea = null;
    
    if(this.state.warning){
      warning = (<Message visible warning>
        <p>{this.state.warning}</p>
      </Message>);
    }

    if(this.state.json){
      jsonArea = (<div>
        <hr></hr>
        <h4>JSON</h4>     
        <div className='ui form field'>
          <pre>{JSON.stringify(this.state.json, null, 2)}</pre>
        </div>
      </div>
      );
    }
    
    return (<div>
        <form className="ui form">
          {warning}
          {this.state.form}
        </form> 
        {jsonArea}  
      </div>);
  }
}

module.exports = ConcertoForm;
