# Concerto UI Library

This library providers web UI components for models written in the [Concerto Modelling Language](https://github.com/accordproject/concerto).

[![Coverage Status](https://coveralls.io/repos/github/accordproject/concerto-ui/badge.svg?branch=master)](https://coveralls.io/github/accordproject/concerto-ui?branch=master)

[![Build Status](https://travis-ci.com/accordproject/concerto-uisvg?branch=master)](https://travis-ci.com/accordproject/concerto-ui)

The Concerto Modelling Language is an object-oriented data description (schema) language, based on a textual domain-specific language.

## How this project is structured

Packages: 
- `concerto-ui-core`, includes the base visitor class and utility functions
- `concerto-ui-react`, extends the base visitor to provide a ReactJS form
- `concerto-ui-demo`, uses the react visitor and applies SemanticUI styling

### More Information

Concerto Modeling Language | https://github.com/accordproject/concerto

## What does this do

- **Web-form Generator:** A functional dynamic web component, that generates a web-form based on the fully-qualified name of a type from a Concerto Model. A sample web application that shows the dynamic web component in action.

- Ask a question on [Stack Overflow](http://stackoverflow.com/questions/tagged/accordproject)

## Getting started

If not already installed, install lerna

```
npm i -g lerna
```

Install all of the project's dependencies and build each of the components

```
lerna bootstrap
npm run build
```

Run the demo app and experiment with the form generator

```
npm run demo:react
```

## License <a name="license"></a>
Accord Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
