# Hyperledger Composer Form Generator

Hyperledger Composer Form is a form generator for Hyperledger composer.

The Hyperledger Composer modelling language is used by both Hyperledger Composer and Accord Project Cicero as an object-oriented data description (schema) language, based on a textual domain-specific language. Both communities would benefit from improved tooling for the modelling language, including the ability to generate UML style diagrams and web-forms from class descriptions described using the Hyperledger Composer modelling language.

## Web Form Generator

A web-form generated from model types would allow transactions to be submitted (or assets/participants created) by filling out a web-form, as opposed to submitting JSON formatted text, easing ease of use and guiding the user. The web form generator dynamically creates form elements based on a root type from a Hyperledger Composer model. Some simplifying assumptions are made to solve the issue of data-binding from arbitrarily complex object models to web forms. The generated web form generator is an embeddable, modular, component that can be easily embedded in web-based tools, such as Hyperledger Composer Playground, or similar.

## How to use

- Import and set up `composer-form` and generate a form
    ```js
        import {FormGenerator} from `composer-form`
        form = await FormGenerator.loadFromText(model);
    ```
- `model` is the source of the Concerto model
- `form` is the generated html form
- `options` format

    ```js
        const options = {
            customClasses : {
                field: 'form-group',
                input: 'form-control',
                label: 'control-label'
            }
        };
    ```

## Getting Started

- Clone this repository
- `yarn install`
- `yarn test`

### More Information

Modeling Language | Hyperledger Composer: https://hyperledger.github.io/composer/reference/cto_language.html
GitHub - accordproject/cicero: Open Source implementation of Accord Protocol Template Specification: https://github.com/accordproject/cicero
Hyperledger Composer: https://composer-playground.mybluemix.net

## What does this do

- **Web-form Generator:** A functional dynamic web component, that generates a web-form based on the fully-qualified name of a type from a Hyperledger Composer Model. A sample web application that shows the dynamic web component in action.

Suggested reading list is:

- [Introduction](https://hyperledger.github.io/composer/latest/introduction/introduction.html)
- [Introduction Video](https://www.youtube.com/watch?v=fdFUsrsv5iw&t=23s)
- [Quick Start](https://hyperledger.github.io/composer/latest/installing/installing-index.html)
- [Tutorials](https://hyperledger.github.io/composer/latest/tutorials/tutorials.html)

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
