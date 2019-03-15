import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

import setConfig from './config';
import { User, Product } from './types';

setConfig();

const testFolder = process.env.TEST_FOLDER as string;
export const dataFolder = path.join(__dirname, `../data`, testFolder);
export const srcAssetsFolder = path.join(__dirname, `../images`);
export const assetsFolder = path.join(srcAssetsFolder, testFolder);
const dataPath = (type: string) => path.join(dataFolder, `${type}.json`);
const getRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

// const isProduct = (arg: any): arg is Product => {
//     return arg.slug !== undefined;
// };

export const APP_SECRET = process.env.APP_SECRET as string;

export const getUserId = (context: any) => {
    // const authorization = context.request.get('authorization');
    if (typeof context.request == "undefined") {
        throw new Error('Undefined Request');
    }
    if (typeof context.request.headers == "undefined") {
        throw new Error('Undefined Headers');
    }

    const authorization = context.request.headers.authorization;
    if (typeof authorization != "undefined") {
        const token = authorization.replace('Bearer ', '');
        const { userId }: any = jwt.verify(token, APP_SECRET);
        return userId;
    } else {
        throw new Error('Not authenticated');
    }
};

export const fetchData = (type: string) => {
    if (type.toLowerCase() == "users" || type.toLowerCase() == "products") {
        try {
            const dataString: any = fs.readFileSync(dataPath(type));
            return JSON.parse(dataString);
        } catch (error) {
            return [];
        }
    }
    else {
        throw new Error("Type not supported");
    }
};

export const saveData = (type: string, data: Array<User | Product>, slug?: string) => {
    try {
        mkdirp.sync(dataFolder);
        if (type == "products") {
            mkdirp.sync(assetsFolder);
        }

        if (slug) {
            saveImage(slug);
        }

        fs.writeFileSync(dataPath(type), JSON.stringify(data));
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const saveImage = (slug: string) => {
    // Pick a random index from available pictures, copy and rename it to the slug of the product being saved
    const randomIndex = getRandomInteger(1, 10);
    const src = `${srcAssetsFolder}/${randomIndex}.jpg`;
    const dest = `${assetsFolder}/${slug}.jpg`;
    if (!fs.existsSync(dest)) {
        try {
            fs.copyFileSync(src, dest);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    return true;
}

export const deleteProductImage = (slug: string) => {
    const dest = `${assetsFolder}/${slug}.jpg`;
    try {
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error.message);
    }
    return true;
};
