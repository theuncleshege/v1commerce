import React, {ComponentProps} from "react";
// Data and GraphQL
import { Query } from 'react-apollo';
import { PRODUCT, GET_DOG_QUERY } from "../../../queries";

import ProductForm from "./ProductForm";

/* export const getProduct = (id: string) => {
    console.log(id)
    return <Query query={PRODUCT} variables={{ id }}>
        {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ::: ${error}`;

            const product = data.product;
            console.log(product);
            return (
                <ProductForm {...product} type="Edit" />
            );
        }}
    </Query>
}; */

export const getProduct = ({ id }: { id: string }) => {
    return <Query query={PRODUCT} variables={{ id }}>
        {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ::: ${error}`;

            const product = data.product;
            return (
                <ProductForm {...product} type="Edit" />
            );
        }}
    </Query>
};

class EditProduct extends React.Component<ComponentProps<any>> {
    render() {
        const id = this.props.match.params.id;
        return (
            getProduct({ id })
        )
    }
}

export default EditProduct;
