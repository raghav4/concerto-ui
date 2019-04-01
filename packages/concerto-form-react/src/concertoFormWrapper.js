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
const ErrorBoundary = require('./errorBoundary');
const ConcertoForm = require('./concertoForm');
const PropTypes = require('prop-types');

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoFormWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    /** Using a key property, based on advice here https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key  */
    return (
      <ErrorBoundary>
        <ConcertoForm key={this.props.model} {...this.props} />
      </ErrorBoundary>
    );
  }
}

ConcertoFormWrapper.propTypes = {
  modelFile: PropTypes.string,
  modelUrl: PropTypes.string,
  model: PropTypes.string,
  json: PropTypes.object,
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
};

module.exports = ConcertoFormWrapper;
