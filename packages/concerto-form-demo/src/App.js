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
import {FormGenerator} from 'concerto-form-core'
import {ConcertoForm} from 'concerto-form-react'
import { Tab } from 'semantic-ui-react'

const generator = new FormGenerator();

class App extends Component {
  state = {
    types: [],
    form: null,
    json: null,
    modelUrl: '',
    modelFile: `namespace org.accordproject.acceptanceofdelivery

    import org.accordproject.cicero.contract.* from https://models.accordproject.org/cicero/contract.cto
    import org.accordproject.organization.Organization from https://models.accordproject.org/organization.cto
    
    /* A request is a transaction */
    transaction Request  identified by transactionId {
      o String transactionId
    }
    
    /* A response is a transaction */
    transaction Response  identified by transactionId {
      o String transactionId
    }
    
    /**
     * Sent by the receiver of the goods, indicates when the goods were
     * received, as well as if they passed inspection
     */
    transaction InspectDeliverable extends Request{
    
      o DateTime deliverableReceivedAt
      o Boolean inspectionPassed
    }
    
    /**
     * The inspection status
     */
    enum InspectionStatus {
      o PASSED_TESTING
      o FAILED_TESTING
      o OUTSIDE_INSPECTION_PERIOD
    }
    
    /**
     * The clause response
     */
    transaction InspectionResponse extends Response {
      o InspectionStatus status
      --> Organization shipper
      --> Organization receiver
    }
    
    /**
     * The template model
     */
    asset AcceptanceOfDeliveryClause extends AccordClause {
      /**
       * the shipper of the goods
       */
      --> Organization shipper
    
      /**
       * the receiver of the goods
       */
      --> Organization receiver
    
      /**
       * what are we delivering
       */
      o String deliverable
    
      /**
       * how long does the receiver have to inspect the goods
       */
      o Long businessDays
    
      /**
       * additional information
       */
      o String attachment
    }`,
  }

  async loadModel (file, type) {
    if  (type === 'text') {
      await generator.loadFromText(file);
    } else if (type === 'url') {
      await generator.loadFromUrl(file);
    }
    console.log('loaded model');
    const types = generator.getTypes();
    const state = { types };
    if(types.length > 0){
      state.fqn = types[0].getFullyQualifiedName();
    }
    this.setState(state);
  }

  async handleDeclarationSelectionChange(event) {
    this.setState({fqn: event.target.value});
    event.preventDefault();
  }

  async handleTextAreaSubmit(event) {
    this.loadModel(this.state.modelFile, 'text')
    event.preventDefault();
  }
  
  handleTextAreaChange(event) {
    this.setState({modelFile: event.target.value});
  }

  async handleUrlSubmit(event) {
    this.loadModel(this.state.modelUrl, 'url')
    event.preventDefault();
  }
  
  handleUrlChange(event) {
    this.setState({modelUrl: event.target.value});
    event.preventDefault();
  }

  render() {
    const {fqn} = this.state;

    const panes = [
      { menuItem: 'Model Editor', render: () => (<Tab.Pane>
        <form onSubmit={this.handleTextAreaSubmit.bind(this)}>
          <div className="ui form">
            <textarea 
              value={this.state.modelFile} 
              onChange={this.handleTextAreaChange.bind(this)}
              className={'form-control Text-area'}
              placeholder="Paste a model file"/>
            <input 
              type="submit" 
              value="Load Model" 
              className='btn btn-primary'/>
          </div>
        </form>
      </Tab.Pane>) },
       {menuItem: 'Import from URL', render: () => (<Tab.Pane>
        <form onSubmit={this.handleUrlSubmit.bind(this)}>
          <div className="ui form">
            <input type="text"
              value={this.state.modelUrl} 
              onChange={this.handleUrlChange.bind(this)}
              className={'form-control'}
              placeholder="https://"/>
            <input 
              type="submit" 
              value="Load Model"
              className='btn btn-primary'/>
          </div>
        </form>
      </Tab.Pane>) },
    ]

    let declSelection = null;
    if(this.state.types.length > 0){
      declSelection = (<div className="">
        <p>Choose a type from this dropdown to generate a form</p>
        <div className='field'>
          <label>Declaration Selection</label>
          <select className='ui fluid dropdown' 
            onChange={this.handleDeclarationSelectionChange.bind(this)}
            value={this.state.fqn}>
            {this.state.types.map((type)=>{
              return <option key={type.getFullyQualifiedName()} value={type.getFullyQualifiedName()}>{type.getFullyQualifiedName()}</option>
            })}
          </select>
      </div>
      <div className="ui segment">
        <h2>Form</h2>
        <ConcertoForm 
          model={fqn}
          generator={generator}
        />
      </div>
    </div>
    );
    }
        
    return (
      <div className="App container ui form">
        <h2>Concerto Form Generator - Demo Client</h2>
        <p>This tool demonstrates the <em>concerto-form</em> library to generate a form from a Hyperledger Composer, Concerto model.</p>
        <p>This demo produces a ReactJS form that is styled with Semantic UI.</p>
        <Tab panes={panes} />         
       {declSelection}
      </div>
    );
  }
}

export default App
