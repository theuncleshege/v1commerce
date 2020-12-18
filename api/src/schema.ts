const schema = `type Product {
    id: ID!
    name: String!
    slug: String!
    brand: String!
    price: Float!
    image: String!
    summary: String!
    createdAt: String!
    updatedAt: String!
}

type User {
    id: ID!
    name: String!
    username: String!
    password: String!
    admin: Boolean!
    createdAt: Float!
}

type AuthPayload {
    token: String
    user: User
}

enum ProductOrderByInput {
    name_ASC
    name_DESC
    createdAt_ASC
    createdAt_DESC
}

type Query {
    products(filter: String, skip: Int, count: Int, orderBy: ProductOrderByInput): [Product!]!
    # Fetch a single product by its id
    product(id: ID!): Product
    users: [User!]!
}

type Mutation {
    signup(username: String!, password: String!, name: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    # Create a product
    createProduct(name: String!, brand: String!, price: Float!, image: String!, summary: String!): Product!
    # Update a product
    updateProduct(id: ID!, name: String, brand: String, price: Float, image: String, summary: String): Product
    # Delete a product
    deleteProduct(id: ID!): Product
}

type Subscription {
    productChanged: Product
}`;

export default schema;
