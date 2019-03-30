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

import React, { Component } from 'react';
import './App.css';
import {ConcertoForm} from 'concerto-form-react';
import { Tab } from 'semantic-ui-react';

class App extends Component {

  constructor(props){
    super(props);

    this.form = React.createRef();

    this.state = {
      // The JSON serialization of the model
      // json: {},

      // The Fully Qualified Name of the type that the form generates
      fqn: '',

      // The list of types in the model manager that can have a form generated
      types: [],

      // A source model file URL, e.g. https://models.accordproject.org/patents/patent.cto
      modelUrl: '',

      // Source model file text
      modelFile: '',

      // Rendering options
      options: {
        includeOptionalFields: true,

        // The default values for a generated form if a JSON serialization isn't provided
        // 'sample' uses random well-typed values
        // 'empty' provides sensible empty values
        includeSampleData: 'sample', // or 'empty'
      },
    };

    this.onModelChange = this.onModelChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  handleDeclarationSelectionChange(event) {
    this.setState({fqn: event.target.value});
  }

  handleJsonTextAreaChange(event) {
    this.setState({json: JSON.parse(event.target.value)});
  }

  handleModelTextAreaChange(event) {
    this.setState({modelFile: event.target.value});
  }

  handleUrlChange(event) {
    this.setState({modelUrl: event.target.value});
  }

  onModelChange(types){
    if(types !== this.state.types && types.length > 0){
      this.setState({
        types,
        fqn:types[0].getFullyQualifiedName(),
        json: null
      });
    }
  }

  onValueChange(json){
    this.setState({ json });
  }

  render() {
    const panes = [
      { menuItem: 'Model Editor', render: () => (<Tab.Pane>
        <form>
          <div className="ui form">
            <textarea
              value={this.state.modelFile}
              onChange={this.handleModelTextAreaChange.bind(this)}
              className={'form-control Text-area'}
              placeholder="Paste a model file"/>
          </div>
        </form>
      </Tab.Pane>) },
      {menuItem: 'Import from URL', render: () => (<Tab.Pane>
        <form>
          <div className="ui form">
            <input type="text"
              value={this.state.modelUrl}
              onChange={this.handleUrlChange.bind(this)}
              className={'form-control'}
              placeholder="https://"/>
          </div>
        </form>
      </Tab.Pane>) },
    ];

    return (
      <div className="App container ui form">
        <h2>Concerto Form Generator - Demo Client</h2>
        <p>This tool demonstrates the <em>concerto-form</em> library to generate a form from a Hyperledger Composer, Concerto model.</p>
        <p>This demo produces a ReactJS form that is styled with Semantic UI.</p>
        <Tab panes={panes} />
        <p>Choose a type from this dropdown to generate a form</p>
        <div className='field'>
          <label>Declaration Selection</label>
          <select className='ui fluid dropdown'
            onChange={this.handleDeclarationSelectionChange.bind(this)}
            value={this.state.fqn}>
            {this.state.types.map((type)=>{
              const fqn = type.getFullyQualifiedName();
              return <option key={fqn} value={fqn}>{fqn}</option>;
            })}
          </select>
        </div>
        <div className="ui segment">
          <h2>Form</h2>
          <div >
            <ConcertoForm ref={this.form}
              onModelChange={this.onModelChange}
              onValueChange={this.onValueChange}
              model={this.state.fqn}
              modelFile={this.state.modelFile}
              modelUrl={this.state.modelUrl}
              json={this.state.json}
              options={this.state.options}
            />
          </div>
        </div>
        <div className="ui segment">
          <h2>JSON</h2>
          <div className='ui form field'>
          {this.state.json &&
          <textarea
            value={JSON.stringify(this.state.json, null, 2)}
            onChange={this.handleJsonTextAreaChange.bind(this)}
          />
          }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
