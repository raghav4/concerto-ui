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
import {ReactFormVisitor} from 'concerto-form-react'
import {Tabs, Tab} from 'react-bootstrap-tabs'

const options = {
    customClasses : {
        field: 'field',
        declaration: 'field',
        declarationHeader: 'ui dividing header',
        enumeration: 'ui fluid dropdown',
        required: 'required',
        boolean: 'ui toggle checkbox'
    },
    visitor: new ReactFormVisitor(),
};

const generator = new FormGenerator(options);

class App extends Component {
  state = {
    types: [],
    form: null,
    modelFile: `namespace org.accordproject.finance.bond

    import org.accordproject.organization.Organization from https://models.accordproject.org/organization.cto
    import org.accordproject.time.Duration from https://models.accordproject.org/time.cto
    import org.accordproject.money.CurrencyCode from https://models.accordproject.org/money.cto
    
    enum CouponType {
      o FIXED
      o FLOATING
    }
    
    concept PaymentFrequency {
        o Integer periodMultiplier
        o Duration period
    }
    
    /**
     * Definition of a Bond, based on the FpML schema:
     * http://www.fpml.org/spec/fpml-5-3-2-wd-2/html/reporting/schemaDocumentation/schemas/fpml-asset-5-3_xsd/elements/bond.html
     *
     */
    concept Bond {
        o String[] instrumentId
        o Boolean isIssued
        o String description optional
        o CurrencyCode currency optional
        o String[] exchangeId
        o String clearanceSystem optional
        o String definition optional
        o String seniority optional
        o CouponType couponType optional
        o Double couponRate optional
        o DateTime maturity
        o Double parValue
        o Double faceAmount
        o PaymentFrequency paymentFrequency
        o String dayCountFraction
        --> Organization issuer
    }
    
    asset BondAsset identified by ISINCode {
        o String ISINCode
        o Bond bond
    }`
  }

  componentDidMount () {
  }

  async loadModel (file, type) {
    if  (type === 'text') {
      await generator.loadFromText(file);
    } else if (type === 'url') {
      await generator.loadFromUrl(file);
    }
    console.log('loaded model');
    this.setState({types: generator.getTypes()})
  }

  async handleDeclarationSelectionChange(event) {
    const form = generator.generateHTML(event.target.value);
    this.setState({
      form, 
      types: generator.getTypes(),
    })
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
  }


  render() {
    const {form} = this.state
    const {customClasses} = options

    return (
      <div className="App container">
        <div className="row">
          <div className="col">
          <br></br>
              
              <Tabs
                headerStyle={{background:'#efefef'}} activeHeaderStyle={{background: 'white', 'borderTop':'2px solid blue'}}
              >
                <Tab  
                  label="Paste model file"
                >
                  <br></br>
                  <form onSubmit={this.handleTextAreaSubmit.bind(this)}>
                    <div className="form-group">
                      <textarea 
                        value={this.state.modelFile} 
                        onChange={this.handleTextAreaChange.bind(this)}
                        className={'form-control Text-area'}
                        placeholder="Paste a model file"/>
                      <br></br>
                      <input 
                        type="submit" 
                        value="Load Model" 
                        className={customClasses.button || 'btn btn-primary'}/>
                    </div>
                  </form>
                </Tab>
                <Tab
                  label="Enter the url for .cto file"
                >
                  <br></br>
                  <form onSubmit={this.handleUrlSubmit.bind(this)}>
                    <div className="form-group">
                      <input 
                        value={this.state.modelUrl} 
                        onChange={this.handleUrlChange.bind(this)}
                        className={'form-control'}
                        placeholder="https://"/>
                      <br></br>
                      <input 
                        type="submit" 
                        value="Load Model"
                        className={customClasses.button || 'btn btn-primary'}/>
                    </div>
                  </form>
                </Tab>
                <Tab
                  label="Upload model file"
                  disabled
                >
                  Currently disabled
                </Tab>
              </Tabs>
              <div className='field'>
                <label>Declaration Selection</label>
                <select className='ui fluid dropdown' 
                  onChange={this.handleDeclarationSelectionChange.bind(this)}
                  value={this.state.type}>
                  {this.state.types.map((type)=>{
                    return <option key={type.getFullyQualifiedName()} value={type.getFullyQualifiedName()}>{type.getFullyQualifiedName()}</option>
                  })}
                </select>
              </div>              
              <hr></hr>
              <h2>Form</h2>
              <form className="ui form">
              {form}
              </form>
            </div>
        </div>
      </div>
    );
  }
}

export default App
