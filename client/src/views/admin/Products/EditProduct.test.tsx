import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';

import EditProduct from './EditProduct';
import { PRODUCT } from '../../../queries';

const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

const product = {
    id: '1',
    brand: 'Samsung',
    name: 'Samsung Galaxy J6',
    slug: 'samsung-galaxy-j6',
    price: 100,
    summary: 'Samsung Galaxy J6 Summary',
    createdAt: Date.now(),
    updatedAt: Date.now()
}

const mocks = [
    {
        request: {
            query: PRODUCT,
            variables: {
                id: '1',
            },
        },
        result: {
            data: {
                product: product
            }
        }
    }
];

const params = {
    params: {
        id: '1'
    }
};

it('should render edit product page', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
                <EditProduct match={params} />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    const heading: any = tree.findByType('h4');
    expect(heading.children).toContain('Edit');
});