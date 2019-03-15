import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';

import NewProduct from './NewProduct';

const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

it('should render new product page', async () => {
    const component = renderer.create(
        <MockedProvider addTypename={false}>
            <MemoryRouter>
                <NewProduct />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    const heading: any = tree.findByType('h4');
    expect(heading.children).toContain('Create');
});