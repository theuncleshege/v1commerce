import React from "react";
// Data and GraphQL
import { Query } from 'react-apollo';
import { PRODUCTS } from "../../queries";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import {createStyles, WithStyles, CircularProgress, Theme, Grid} from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Parallax from "../../components/Parallax/Parallax";
// sections for this page
import HeaderLinks from "../../components/Header/HeaderLinks";
import SnackbarContent from "../../components/Snackbar/SnackbarContent.jsx";
import Clearfix from "../../components/Clearfix/Clearfix.jsx";

import productsStyle from "../../assets/jss/material-kit-react/views/products";

import Product, { Product as ProductType } from "./Product";
import { Link } from "react-router-dom";
import Button from "../../components/CustomButtons/Button";
import { NoteAdd } from "@material-ui/icons";
import { IS_ADMIN, AUTH_TOKEN } from "../../constants";

type ProductsPageContext = typeof productsStyle;

const styles = (theme: Theme) => createStyles({
    ...productsStyle,
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

export const products = (props: any) => {
    return <Query query={PRODUCTS}>
        {({loading, error, data}) => {
            if (loading) {
                return <GridItem>
                    <CircularProgress color="primary" className={props.classes.progress} />
                </GridItem>;
            }
            if (error) {
                return <GridItem>
                    <SnackbarContent
                        message={<span><b>{error.message}!!!</b></span>}
                        color="danger"
                        icon="warning_outline"
                    />
                </GridItem>;
            }

            const products = data.products;
            return transformProducts(products);
        }}
    </Query>
};

const transformProducts = (products: [ProductType]) => {
    return products.map((key) => {
        return <GridItem key={key.id} xs={12} sm={6} md={4}>
            <Product id={key.id} brand={key.brand} name={key.name} price={key.price} summary={key.summary}
                     slug={key.slug}/>
        </GridItem>;
    })
};

export class Products extends React.Component {
    render() {
        const isAdmin = localStorage.getItem(IS_ADMIN) && localStorage.getItem(AUTH_TOKEN);
        const { classes, ...rest } = this.props as WithStyles<ProductsPageContext>;
        const headerLinks = {...this.props, classes: {}};
        return (
            <div>
                <Header
                    fixed
                    color="transparent"
                    branding="V1Commerce"
                    rightLinks={<HeaderLinks {...headerLinks} />}
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />

                <Parallax image={require("assets/img/products-bg.jpg")}>
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem>
                                <div className={classes.brand}>
                                    <h1 className={classes.title}>Products</h1>
                                    <h3 className={classes.subtitle}>
                                        Free global delivery for all products. Use coupon 25summer for an extra 25% Off
                                    </h3>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>

                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div>
                        <div className={classes.container}>
                            <GridContainer justify="space-between" alignItems="center">
                                <GridItem>
                                    <h2>Latest Offers</h2>
                                </GridItem>

                                {isAdmin && (
                                    <GridItem>
                                        <Link to="/new-product">
                                            <Button color="success">
                                                <NoteAdd /> New Product
                                            </Button>
                                        </Link>
                                    </GridItem>
                                )}
                            </GridContainer>

                            

                            <GridContainer>
                                { products({...this.props}) }
                            </GridContainer>
                        </div>
                    </div>
                </div>

                <Clearfix />

                {/* <Footer /> */}
            </div>
        );
    }
}

export default withStyles(styles)(Products);