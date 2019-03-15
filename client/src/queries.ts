// Data and GraphQL
import gql from 'graphql-tag';

export const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

export const LOGIN = gql`
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

export const SIGNUP = gql`
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

// products(skip: 1, count: 1, filter: "j6") {
//     products(orderBy: createdAt_ASC) ${cache} {
//         products(orderBy: createdAt_ASC) {

export const PRODUCTS = gql`
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

export const PRODUCT = gql`
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

export const CREATE_PRODUCT = gql`
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

export const UPDATE_PRODUCT = gql`
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

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`;