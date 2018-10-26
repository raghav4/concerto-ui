# Concerto Form Generator

This library generates web-form generator for models written in the [Concerto Modelling Language](https://github.com/hyperledger/composer-concerto).

<!--[![Coverage Status](https://coveralls.io/repos/github/uchibeke/composer-form/badge.svg?branch=master)](https://coveralls.io/github/uchibeke/composer-form?branch=master)

[![Build Status](https://travis-ci.com/uchibeke/composer-form.svg?branch=master)](https://travis-ci.com/uchibeke/composer-form)--> 

The Concerto Modelling Language is used by both Hyperledger Composer and Accord Project Cicero as an object-oriented data description (schema) language, based on a textual domain-specific language. Both communities would benefit from improved tooling for the modelling language, including the ability to generate UML style diagrams and web-forms from class descriptions described using the Hyperledger Composer modelling language.

## Web Form Generator

A web-form generated from model types would allow transactions to be submitted (or assets/participants created) by filling out a web-form, as opposed to submitting JSON formatted text, easing ease of use and guiding the user. The web form generator dynamically creates form elements based on a root type from a Concerto model. Some simplifying assumptions are made to solve the issue of data-binding from arbitrarily complex object models to web forms. The generated web form generator is an embeddable, modular, component that can be easily embedded in web-based tools, such as Hyperledger Composer Playground, or similar.

## How this project is structured

Packages: 
- `concerto-form-core`, includes the base visitor class and utility functions
- `concerto-form-react`, extends the base visitor to provide a ReactJS form
- `concerto-form-demo`, uses the react visitor and applies SemanticUI styling

### More Information

Modeling Language | Hyperledger Composer: https://hyperledger.github.io/composer/reference/cto_language.html
GitHub - https://github.com/hyperledger/composer-concerto

## What does this do

- **Web-form Generator:** A functional dynamic web component, that generates a web-form based on the fully-qualified name of a type from a Concerto Model. A sample web application that shows the dynamic web component in action.

- Ask a question on [Stack Overflow](http://stackoverflow.com/questions/tagged/hyperledger-composer)
- Chat on the Rocket.Chat [discussion channels](https://chat.hyperledger.org/channel/composer)

Suggested reading list is:

- [Introduction](https://hyperledger.github.io/composer/latest/introduction/introduction.html)
- [Introduction Video](https://www.youtube.com/watch?v=fdFUsrsv5iw&t=23s)
- [Quick Start](https://hyperledger.github.io/composer/latest/installing/installing-index.html)
- [Tutorials](https://hyperledger.github.io/composer/latest/tutorials/tutorials.html)

## Getting started

If not already installed, install lerna

```
npm i -g lerna
```

Install all of the project's dependencies

```
lerna bootstrap
```

Run the demo app and experiment with the form generator

```
cd packages/concerto-form-demo
npm run start
```



## Getting in touch

If you have a *question on using Hyperledger Composer*
  - Rocket.Chat [discussion channels](https://chat.hyperledger.org/channel/composer)
  - [Stack Overflow](http://stackoverflow.com/questions/tagged/hyperledger-composer), where the question should be tagged with 'hyperledger-composer'.

If you have found a defect or want to raise a feature requests
  - All tracked on GitHub - please read [how to raise](./contrib-notes/raising-issues.md)

If you want to contribute to the develop of Hyperledger Composer
  - Come introduce yourself on the contributors [RocketChat channel](https://chat.hyperledger.org/channel/composer-dev)
  - Please read the [contributing guide](./CONTRIBUTING.md)

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
