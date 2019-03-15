import React, { Component } from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';

import { LOGIN, SIGNUP } from '../../queries';
import LoginPage from './LoginPage';

const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

const admin = {
    name: 'Administrator',
    username: 'admin',
    password: '123456',
    admin: true
}

const adminResponse = {
    token: "Token",
    user: {
        name: "Admininistrator",
        username: "admin",
        password: "123456",
        admin: true
    }
};

const user = {
    name: 'User',
    username: 'user',
    password: '123456',
    admin: false
}

const mocks = [
    {
        request: {
            query: LOGIN,
            variables: {
                username: admin.username,
                password: admin.password,
                name: admin.name
            },
        },
        result: {
            data: {
                login: adminResponse
            },
            error: new Error('aw shucks')
        }
    },
];

const mocksError = [
    {
        request: {
            query: LOGIN,
            variables: {
                username: admin.username,
                password: admin.password
            },
        },
        error: new Error('aw shucks')
    },
];

it('should render LoginPage without error', () => {
    renderer.create(
        <MockedProvider mocks={[]}>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </MockedProvider>,
    );
});

it('should render login or signup button loading state initially', () => {
    const component = renderer.create(
        <MockedProvider mocks={[]}>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </MockedProvider>
    );

    const button: any = component.root.findByProps({ "color": "primary", "size": "lg"});
    button.props.onClick(); // fires the mutation
    const tree: any = component.root;
    const loadingIcon: any = tree.findByType('circle');
    expect(loadingIcon).toBeTruthy();
});

it('should not log user in', async () => {
    const component = renderer.create(
        <MockedProvider mocks={mocksError} addTypename={false}>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </MockedProvider>
    );

    // find the button and simulate a click
    const button: any = component.root.findByProps({ "color": "primary", "size": "lg" });
    button.props.onClick(); // fires the mutation

    await wait(0);
    const errorDiv: any = component.root.findByProps({ "color": "danger", "icon": "warning_outline" });
    expect(errorDiv).toBeTruthy();
});