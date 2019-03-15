import React from "react";

import ProductForm from "./ProductForm";

class NewProduct extends React.Component {
  render() {
    return (
        <ProductForm {...this.props} type="Create" />
    );
  }
}

export default NewProduct;
