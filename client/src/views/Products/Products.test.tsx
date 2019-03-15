import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';

import { PRODUCTS } from '../../queries';
import Products from './Products';
import { IS_ADMIN, AUTH_TOKEN } from '../../constants';

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
            query: PRODUCTS
        },
        result: {
            data: {
                products: [product]
            },
            error: new Error('aw shucks')
        }
    },
];

const mocksError = [
    {
        request: {
            query: PRODUCTS
        },
        error: new Error('aw shucks')
    },
];

it('should render products page successfully', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    // const json: any = component.toJSON();
    // console.log(JSON.stringify(json, undefined, 2));
    const _product: any = tree.findByProps({ "id": product.id, "brand": product.brand});
    expect(_product).toBeTruthy();
});

it('should render products page loading state initially', () => {
    const component = renderer.create(
        <MockedProvider mocks={[]}>
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        </MockedProvider>
    );

    const tree: any = component.root;
    const loadingIcon: any = tree.findByType('circle');
    expect(loadingIcon).toBeTruthy();
});

it('should show products page error', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocksError} addTypename={false}>
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    const errorDiv: any = tree.findByProps({ "color": "danger", "icon": "warning_outline"});
    expect(errorDiv).toBeTruthy();
});

it('should show add new product button', async () => {
    localStorage.setItem(IS_ADMIN, 'Yes');
    localStorage.setItem(AUTH_TOKEN, 'Token');

    const component = renderer.create(
        <MockedProvider mocks={[]} addTypename={false}>
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        </MockedProvider>
    );

    await wait(0);

    const tree: any = component.root;
    const newProductButton: any = tree.findByProps({ "color": "success" });
    expect(newProductButton).toBeTruthy();
    localStorage.clear();
});