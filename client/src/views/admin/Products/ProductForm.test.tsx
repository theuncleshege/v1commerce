import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';

import { getProduct as GetProduct } from './EditProduct';
import { PRODUCT } from '../../../queries';
import ProductForm from './ProductForm';

// declare global {
//     namespace JSX { 
//         interface IntrinsicElements {
//             getProduct: any & {
//                 id: string
//             }
//         }
//     } 
// }

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
            },
            error: new Error('aw shucks')
        }
    },
];

const mocksError = [
    {
        request: {
            query: PRODUCT,
            variables: {
                id: '1',
            },
        },
        error: new Error('aw shucks')
    },
];

it('should render loading state initially', () => {
    const component = renderer.create(
        <MockedProvider mocks={[]}>
            <GetProduct id="1" />
        </MockedProvider>
    );

    const tree: any = component.toJSON();
    expect(tree).toContain('Loading...');
});

it('should show error', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocksError} addTypename={false}>
            <MemoryRouter>
                <GetProduct id="1" />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.toJSON();
    expect(tree).toContain('Error!');
});

it('should render new product form', async () => {
    const component = renderer.create(
        <MockedProvider addTypename={false}>
            <MemoryRouter>
                <ProductForm type="Create" />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    const heading: any = tree.findByType('h4');
    expect(heading.children).toContain('Create');
});

it('should render edit product form', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
                <GetProduct id="1" />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const productForm: any = component.root.findByType(ProductForm);
    expect(productForm.props).toMatchObject(product);
    
    const tree: any = component.root;
    const heading: any = tree.findByType('h4');
    expect(heading.children).toContain('Edit');
});