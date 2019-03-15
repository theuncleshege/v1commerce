import gql from 'graphql-tag';

export const LOGIN_QUERY = `
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token,
            user {
                name,
                username,
                password,
                admin
            }
        }
    }
`;
export const LOGIN = gql`{LOGIN_QUERY}`;

export const SIGNUP_QUERY = `
    mutation signup($username: String!, $password: String!, $name: String!) {
        signup(username: $username, password: $password, name: $name) {
            token,
            user {
                name,
                username,
                password,
                admin
            }
        }
    }
`;
export const SIGNUP = gql`{SIGNUP_QUERY}`;

export const PRODUCTS_QUERY = `
    query Products {
        products(orderBy: createdAt_DESC) {
            id
            name
            slug
            brand
            price
            summary
            createdAt
            updatedAt
        }
    }
`;
export const PRODUCTS = gql`${PRODUCTS_QUERY}`;

export const PRODUCTS_FILTER_QUERY = `
    query Products($filter: String!) {
        products(filter: $filter) {
            id
            name
            slug
            brand
            price
            summary
            createdAt
            updatedAt
        }
    }
`;
export const PRODUCTS_FILTER = gql`${PRODUCTS_FILTER_QUERY}`;

export const PRODUCT_QUERY = `
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            slug
            brand
            price
            summary
            createdAt
            updatedAt
        }
    }
`;
export const PRODUCT = gql`${PRODUCT_QUERY}`;

export const CREATE_PRODUCT_QUERY = `
    mutation CreateProduct($name: String!, $brand: String!, $price: Float!, $summary: String!) {
        createProduct(name: $name, brand: $brand, price: $price, summary: $summary) {
            id
            name
            slug
            brand
            price
            summary
            createdAt
            updatedAt
        }
    }
`;
export const CREATE_PRODUCT = gql`${CREATE_PRODUCT_QUERY}`;

export const UPDATE_PRODUCT_QUERY = `
    mutation UpdateProduct($id: ID!, $name: String, $brand: String, $price: Float, $summary: String) {
        updateProduct(id: $id, name: $name, brand: $brand, price: $price, summary: $summary) {
            id
            name
            slug
            brand
            price
            summary
            createdAt
            updatedAt
        }
    }
`;
export const UPDATE_PRODUCT = gql`${UPDATE_PRODUCT_QUERY}`;

export const DELETE_PRODUCT_QUERY = `
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`;
export const DELETE_PRODUCT = gql`${DELETE_PRODUCT_QUERY}`;