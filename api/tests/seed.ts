import bcrypt from 'bcryptjs';
import uuidv1 from "uuid";
import fs from 'fs';
import rimraf from "rimraf";

import { saveData, dataFolder, assetsFolder, saveImage } from "../src/utils";

const getPasswordHash = async(password: any) => {
    return await bcrypt.hash(password, 10);
}

export const users = [
    {
        id: uuidv1(),
        name: "Admininistrator",
        username: "admin",
        password: "AdminPassword",
        admin: true,
        createdAt: Date.now()
    },
    {
        id: uuidv1(),
        name: "User",
        username: "user",
        password: "UserPassword",
        admin: false,
        createdAt: Date.now()
    }
];

export const products = [
    {
        id: uuidv1(),
        name: "Samsung Galaxy J6",
        slug: "samsung-galaxy-j6",
        brand: "Samsung",
        price: 100,
        summary: "Samsung Galaxy J6 Summary",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: uuidv1(),
        name: "Apple iPhone X",
        slug: "apple-iphone-x",
        brand: "Apple",
        price: 200,
        summary: "Apple iPhone X Summary",
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

export const populateUsers = async (done: any) => {
    emptyUsers();
    const adminHash = await getPasswordHash(users[0].password);
    const userHash = await getPasswordHash(users[1].password);
    const users_ = [{ ...users[0], password: adminHash }, { ...users[1], password: userHash }];
    await saveData('users', users_);
    done();
};

export const populateProducts = async (done: any) => {
    emptyProducts();
    await saveData('products', products);
    await saveImage(products[0].slug);
    await saveImage(products[1].slug);
    done();
};

export const emptyUsers = () => {
    const file = `${dataFolder}/users.json`;
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
};

export const emptyProducts = () => {
    const file = `${dataFolder}/products.json`;
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    if (fs.existsSync(assetsFolder)) {
        rimraf.sync(assetsFolder);
    }
};
