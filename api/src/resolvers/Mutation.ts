import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import slug from 'slug';
import uuidv1 from 'uuid';

import { APP_SECRET, getUserId, fetchData, saveData, deleteProductImage } from '../utils';
import { Product, User } from '../types';
import { pubsub, PRODUCT_ADDED, PRODUCT_UPDATED, PRODUCT_REMOVED } from './Subscription';

slug.defaults.mode ='rfc3986';

const signup = async (parent: any, args: any, context: any, info: any) => {
    const users: [User] = fetchData('users');
    const id = uuidv1();
    const password = await bcrypt.hash(args.password, 10);
    const user = {
        id,
        name: args.name,
        username: args.username,
        password,
        admin: args.username == "admin" ? true : false,
        createdAt: Date.now()
    };
    const existingUsers = users.filter( (user: User) => user.username === args.username);
    if ( existingUsers.length > 0 ) {
        throw new Error('User already exists! Kindly use another username.');
    }
    users.push(user);
    saveData('users', users);
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    }
};
const login = async (parent: any, args: any, context: any, info: any) => {
    const users: [User] = fetchData('users');
    const user = users.find( (x: User) => x.username === args.username);
    if (!user) {
        throw new Error('No such user found');
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    }
};
const createProduct = (parent: any, args: any, context: any) => {
    getUserId(context);
    const products: [Product] = fetchData('products');
    const id = uuidv1();
    const productSlug = slug(args.name);
    const product = {
        id,
        name: args.name,
        slug: productSlug,
        brand: args.brand,
        price: args.price,
        summary: args.summary,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const existingProducts = products.filter( (product: Product) => product.id === id || product.slug === productSlug );
    if ( existingProducts.length > 0 ) {
        throw new Error('Product already exists!');
    }
    products.push(product);
    saveData('products', products, productSlug);
    pubsub.publish(PRODUCT_ADDED, { productChanged: product });
    return product;
};
const updateProduct = (parent: any, args: any, context: any) => {
    getUserId(context);
    const products: [Product] = fetchData('products');
    const productIndex = products.findIndex((x: Product) => x.id === args.id);
    if (productIndex < 0) {
        throw new Error('Product not found!');
    }
    args.slug = slug(args.name);
    const existingProducts = products.filter( (product: Product) => product.slug === args.slug && product.id !== args.id );
    if ( existingProducts.length > 0 ) {
        throw new Error('Product already exists! Please choose another name');
    }
    if (args.slug != products[productIndex].slug) {
        deleteProductImage(products[productIndex].slug);
    }
    args.updatedAt = Date.now();
    const product = Object.assign(products[productIndex], args);
    products.splice(productIndex, 1, product);
    saveData('products', products, args.slug);
    pubsub.publish(PRODUCT_UPDATED, { productChanged: product });
    return product;
};
const deleteProduct = (parent: any, args: any, context: any) => {
    getUserId(context);
    const products: [Product] = fetchData('products');
    const productIndex = products.findIndex((x: Product) => x.id === args.id);
    if (productIndex < 0) {
        throw new Error('Product not found!');
    }
    const product = products[productIndex];
    products.splice(productIndex, 1);
    saveData('products', products);
    deleteProductImage(product.slug);
    pubsub.publish(PRODUCT_REMOVED, { productChanged: product });
};

const Mutation = {
    signup,
    login,
    createProduct,
    updateProduct,
    deleteProduct
};

export default Mutation;