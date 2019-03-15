import React from 'react';
import renderer from 'react-test-renderer';

import Product from './Product';

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

it('should render product successfully', () => {
    const component = renderer.create(
        <Product {...product} />
    );

    const tree: any = component.root;
    // const img: any = tree.findByProps({ alt: product.name });
    const img: any = tree.findByType('img');
    const name: any = tree.findByType('h4');
    const price: any = tree.findByType('h5');
    const summary = component.root.findByType('p');

    expect(img.props.alt).toMatch(product.name);
    expect(name.children).toContain(product.name);
    expect(price.children).toContain(product.price.toFixed(2));
    expect(summary.children).toContain(product.summary);
});