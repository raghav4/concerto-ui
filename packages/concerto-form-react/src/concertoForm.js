const React = require('react');
const Component = require('react').Component;
const jsonpath = require('jsonpath');
const ReactFormVisitor = require('concerto-form-react').ReactFormVisitor;
const Message = require('semantic-ui-react').Message;

class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.fromJSON = this.fromJSON.bind(this);
    this.state = {json: {}};
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.model changes, update state.
    if (nextProps.model !== this.props.model) {
      this.setState({json: {}});
    }
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
        visitor: new ReactFormVisitor(),
    };
    if(this.props.generator && this.props.model){
      const {form} = this.props.generator.generateHTML(this.props.model, options);
      return form;
    }    
  } 

  toJSON(paths){
    const json = {
      $class: this.props.model
    };
    Object.keys(paths).map((key)=>{
      jsonpath.value(json, key, paths[key]);
    });
    return JSON.stringify(json, null, 2);
  }

  fromJSON(e){
    try {
      const instance = JSON.parse(e.target.value);
      const paths = jsonpath.paths(instance, '$..*');
      const json = {};
      paths.map((path)=>{
        const key = jsonpath.stringify(path);
        json[key] = jsonpath.value(instance,key);
      });
      const warning = this.props.generator.validateInstance(instance);
      if(warning){
        this.setState({
          instance: e.target.value,
          warning,
        });
      } else {
        this.setState({
          json,
          instance: this.toJSON(json),
          warning,
        });
      }
    } catch (error) {
      this.setState({instance: e.target.value, warning: error.message});
    }
  }

  onChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const state = this.state;
    state.json[key] = value;
    state.instance = this.toJSON(state.json);
    state.warning = this.props.generator.validateInstance(JSON.parse(state.instance)),
    this.setState(state);
  }

  render() {
    let warning = null;
    let jsonArea = null;
    if(this.state.warning){
      warning = (<Message warning>
        <p>{this.state.warning}</p>
      </Message>);
    }

    if(this.state.instance){
      jsonArea = (<div>
        <hr></hr>
        <h4>JSON</h4>     
        {warning}
        <div className='ui form field'>
          < textarea value={this.state.instance} onChange={this.fromJSON}/>
        </div>
      </div>
      );
    }
    
    return (<div>
        <form className="ui form">
          {this.renderForm()}
        </form>   
        {jsonArea}
      </div>);
  }
}

module.exports = ConcertoForm;
