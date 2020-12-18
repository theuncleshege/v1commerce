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

export const PRODUCTS_QUERY = `
  query Products($orderBy: ProductOrderByInput = createdAt_DESC, $skip: Int, $count: Int) {
    products(orderBy: $orderBy, skip: $skip, count: $count) {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;

export const PRODUCTS_FILTER_QUERY = `
  query Products($filter: String!) {
    products(filter: $filter) {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;

export const PRODUCT_QUERY = `
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT_QUERY = `
  mutation CreateProduct($name: String!, $brand: String!, $price: Float!, $image: String!, $summary: String!) {
    createProduct(name: $name, brand: $brand, price: $price, image: $image, summary: $summary) {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_QUERY = `
  mutation UpdateProduct($id: ID!, $name: String, $brand: String, $price: Float, $image: String, $summary: String) {
    updateProduct(id: $id, name: $name, brand: $brand, price: $price, image: $image, summary: $summary) {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT_QUERY = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const SUBSCRIPTION_QUERY = `
  subscription {
    productChanged {
      id
      name
      slug
      brand
      price
      image
      summary
      createdAt
      updatedAt
    }
  }
`;
