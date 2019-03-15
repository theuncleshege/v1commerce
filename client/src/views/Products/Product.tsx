import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import { createStyles, WithStyles } from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import { AddShoppingCart, Edit } from "@material-ui/icons";
// core components
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";
import Button from "../../components/CustomButtons/Button";
import Info from "../../components/Typography/Info";

import imagesStyles from "../../assets/jss/material-kit-react/imagesStyles";
import { cardTitle } from "../../assets/jss/material-kit-react";

import DeleteProductButton from "../admin/Products/DeleteProductButton"
import {ASSETS_URL, AUTH_TOKEN, IS_ADMIN} from "../../constants";

const style = createStyles({
    ...imagesStyles,
    cardTitle
});

export type Product = {
    id: string
    name: string
    slug?: string
    brand: string
    price: number
    summary: string
    createdAt?: number
    updatedAt?: number
};

interface ProductProps extends WithStyles<typeof style>, Product {}

export const product = (props: Product) => {
    const { classes } = props as ProductProps;
    const isLoggedIn: boolean = localStorage.getItem(AUTH_TOKEN) != null;
    const isAdmin: boolean = isLoggedIn && localStorage.getItem(IS_ADMIN) != null;
    const button = isAdmin ? <div>
        <Link to={`/products/${props.id}`}>
            <Button color="info">
                <Edit /> Edit
            </Button>
        </Link>

        <DeleteProductButton id={props.id} />
    </div>
    :
    <Button color="primary" fullWidth>
        <AddShoppingCart /> Add to Cart
    </Button>;

    return (
        <Card>
            <img className={classes.imgCardTop} src={`${ASSETS_URL}/${props.slug}.jpg`} alt={props.name} />
            <CardBody>
                <h4 className={classes.cardTitle}>{props.name}</h4>
                <Info><h5>${props.price.toFixed(2)}</h5></Info>
                <p>{props.summary}</p>
            </CardBody>
            <CardFooter className={classes.cardFooter}>
                {button}
            </CardFooter>
        </Card>
    );
};

export default withStyles(style)(product);
