import React from 'react';
import { MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';

import App from './App';

it('renders without crashing', () => {
    renderer.create(
        <MockedProvider>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </MockedProvider>
    );
});
