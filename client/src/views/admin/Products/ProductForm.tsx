import React from "react";
import { Link, Redirect } from "react-router-dom";
// Data and GraphQL
import { Mutation } from 'react-apollo';
import { ApolloError } from "apollo-client";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../../queries";
// @material-ui/core components
import {createStyles, Theme, WithStyles, CircularProgress} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import { ShoppingBasket, Business, Money, Description, Save, Cancel } from "@material-ui/icons";
// core components
import Header from "../../../components/Header/Header";
import HeaderLinks from "../../../components/Header/HeaderLinks";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import Button from "../../../components/CustomButtons/Button";
import Card from "../../../components/Card/Card";
import CardBody from "../../../components/Card/CardBody";
import CardHeader from "../../../components/Card/CardHeader";
import CardFooter from "../../../components/Card/CardFooter";
import CustomInput from "../../../components/CustomInput/CustomInput";
import SnackbarContent from "../../../components/Snackbar/SnackbarContent.jsx";

import productFormStyle from "../../../assets/jss/material-kit-react/views/loginPage";

import image from "assets/img/bg7.jpg";

type ProductFormContext = typeof productFormStyle;

type ProductState = {
    [index: string] : string | number
    name: string
    brand: string
    price: number
    summary: string
}

const styles = (theme: Theme) => createStyles({
    ...productFormStyle,
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

const createProduct = (name: string, brand: string, price: number, summary: string, props: ProductFormContext, callback: Function) => {
    price = Number(price);
    return <Mutation
        mutation={CREATE_PRODUCT}
        variables={{ name, brand, price, summary }}
        refetchQueries={['Products']}
        onCompleted={() => callback('')}
        onError={(error: ApolloError) => callback(error.message)}
    >
        {(postMutation, { loading, error, data }) => {
            if (loading) {
                return <CircularProgress color="primary" className={props.classes.progress} />;
            }

            if (typeof data != "undefined") {
                return <Redirect to="/" />;
            }
            return <Button color="info" onClick={postMutation}><Save /> Create</Button>;
        }}
    </Mutation>
};

const updateProduct = (id: string, name: string, brand: string, price: number, summary: string, props: ProductFormContext, callback: Function) => {
    price = Number(price);
    return <Mutation
        mutation={UPDATE_PRODUCT}
        variables={{ id, name, brand, price, summary }}
        refetchQueries={['Products']}
        onCompleted={() => callback('')}
        onError={(error: ApolloError) => callback(error.message)}
    >
        {(postMutation, { loading, error, data }) => {
            if (loading) {
                return <CircularProgress color="primary" className={props.classes.progress} />;
            }

            if (typeof data != "undefined") {
                return <Redirect to="/" />;
            }
            return <Button color="info" onClick={postMutation}><Save /> Update</Button>;
        }}
    </Mutation>
};

class ProductForm extends React.Component<ProductFormContext> {
    state: ProductState = {
        name: this.props.name ? this.props.name : '',
        brand: this.props.brand ? this.props.brand : '',
        price: this.props.price ? this.props.price : '',
        summary: this.props.summary ? this.props.summary : ''
    };

    /*state: ProductState;
    constructor(props: ProductState) {
        super(props);
        this.state = {
            name: this.props.name ? this.props.name : '',
            brand: this.props.brand ? this.props.brand : '',
            price: this.props.price ? this.props.price : '',
            summary: this.props.summary ? this.props.summary : ''
        };
    }*/

    inputChangedHandler = (event: any, inputIdentifier: string) => {
        this.setState({ [inputIdentifier]: event.target.value });
    };

    updateErrorState = (error: string) => {
        this.setState({error});
    }

    render() {
        const { classes, ...rest } = this.props as WithStyles<ProductFormContext>;
        const headerLinks = {...this.props, classes: {}};
        const { id } = this.props;
        const { name, brand, price, summary } = this.state as ProductState;

        return (
            <div>
                <Header
                    absolute
                    color="transparent"
                    branding="V1Commerce"
                    rightLinks={<HeaderLinks {...headerLinks} />}
                    {...rest}
                />
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + image + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "top center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={6}>
                                <Card>
                                    <CardHeader color="primary" className={classes.cardHeader}>
                                        <h4>{ id ? "Edit" : "Create" } Product</h4>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.error &&
                                            <SnackbarContent
                                                message={<span><b>{this.state.error}!!!</b></span>}
                                                color="danger"
                                                icon="warning_outline"
                                            />
                                        }
                                        <form className={classes.form}>
                                            <CustomInput
                                                labelText="Name"
                                                id="name"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    value: name,
                                                    onChange: (e: any) => this.inputChangedHandler(e, 'name'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <ShoppingBasket className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Brand"
                                                id="brand"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    value: brand,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Business className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    ),
                                                    onChange: (e: any) => this.inputChangedHandler(e, 'brand')
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Price"
                                                id="price"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number",
                                                    value: price,
                                                    onChange: (e: any) => this.inputChangedHandler(e, 'price'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Money className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Summary"
                                                id="summary"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    value: summary,
                                                    onChange: (e: any) => this.inputChangedHandler(e, 'summary'),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Description className={classes.inputIconsColor} />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </form>
                                    </CardBody>
                                    <CardFooter className={classes.cardFooter}>
                                        {id ?
                                            updateProduct(id, name, brand, price, summary, this.props, this.updateErrorState)
                                            :
                                            createProduct(name, brand, price, summary, this.props, this.updateErrorState)
                                        }
                                        <Link to={`/`}>
                                            <Button>
                                                <Cancel /> Cancel
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ProductForm);
