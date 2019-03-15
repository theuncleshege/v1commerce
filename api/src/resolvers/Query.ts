import { Product } from '../types';
import { fetchData, getUserId } from '../utils';

const Query = {
    products: (parent: any, args: any, context: any) => {
        const products: [Product] = fetchData('products');
        let results = args.filter ? products.filter((product: Product) => product.name.toLowerCase().includes(args.filter.toLowerCase()) || product.summary.toLowerCase().includes(args.filter.toLowerCase())) : products;
        if (args.orderBy) {
            const orderBy = args.orderBy;
            if (orderBy == "name_ASC") {
                results = results.sort((a: Product, b: Product) => a.name > b.name ? 1 : -1);
            } else if (orderBy == "name_DESC") {
                results = results.sort((a: Product, b: Product) => a.name > b.name ? -1 : 1);
            } else if (orderBy == "createdAt_ASC") {
                results = results.sort((a: Product, b: Product) => a.createdAt - b.createdAt);
            } else if (orderBy == "createdAt_DESC") {
                results = results.sort((a: Product, b: Product) => b.createdAt - a.createdAt);
            }
        }
        results = args.skip ? results.slice(args.skip) : results;
        results = args.count ? results.slice(0, args.count) : results;

        return results;
    },
    product: (parent: any, args: any, context: any) => {
        getUserId(context);
        const products: [Product] = fetchData('products');
        const product = products.filter((product: Product) => product.id === args.id)[0];
        return product;
    }
};

export default Query;