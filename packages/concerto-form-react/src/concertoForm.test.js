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

import React from 'react';
import ConcertoForm from './concertoForm';
import renderer from 'react-test-renderer';
import {FormGenerator} from 'concerto-form-core';

test('Link changes the class when hovered',async () => {
  const generator = new FormGenerator();

  await generator.loadFromText(
    `namespace org.hyperledger.concerto.form.test

    concept Foo {
      o String s
      o Boolean b optional
      o DateTime dt
      o Integer i
      o Double d
      o Bar bar
      o String[] ss
      o Boolean[] bs
      o DateTime[] dts
      o Bar[] bars
      o Nums n
    }

    enum Nums {
      o ONE
      o TWO
    }

    abstract concept Bar {
      o String s
    }

    concept Baz extends Bar{
      o String t
    }


    `
  );

  const model = 'org.hyperledger.concerto.form.test.Foo';

  const component = renderer.create(
    <ConcertoForm
      model={model}
      generator={generator}
    />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});