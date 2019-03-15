/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import { Shop, Lock, ExitToApp } from "@material-ui/icons";
// core components
import Button from "components/CustomButtons/Button";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle";

import { AUTH_TOKEN, IS_ADMIN } from '../../constants'

const HeaderLinks = ({ ...props }) => {
  const { classes } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  // const isAdmin = localStorage.getItem(IS_ADMIN) && authToken;
  const isAdmin = localStorage.getItem(IS_ADMIN) != null && authToken != null;

  let account = <Link to={"/login"} className={classes.navLinkColor}>
    <Button
      color="transparent"
      className={classes.navLink}
    >
      <Lock className={classes.icons} /> Login
    </Button>
  </Link>;

  if (authToken) {
      account = <Button
            color="transparent"
            className={classes.navLink}
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              localStorage.getItem(IS_ADMIN) ? localStorage.removeItem(IS_ADMIN) : '';
              props.action();
              props.history.push(`/`);
            }}
        >
            <ExitToApp className={classes.icons} /> Logout
        </Button>;
  }
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link to={"/"} className={classes.navLinkColor}>
          <Button
            color="transparent"
            className={classes.navLink}
          >
              <Shop className={classes.icons} /> Products
          </Button>
        </Link>
      </ListItem>
      {
        isAdmin && (
          <ListItem className={classes.listItem}>
            <Link to={"/new-product"} className={classes.navLinkColor}>
              <Button
                color="transparent"
                className={classes.navLink}
              >
                <Shop className={classes.icons} /> New Product
              </Button>
            </Link>
          </ListItem>
        )
      }

      <ListItem className={classes.listItem}>
          { account }
      </ListItem>
    </List>
  );
};

export default withStyles(headerLinksStyle)(HeaderLinks);
