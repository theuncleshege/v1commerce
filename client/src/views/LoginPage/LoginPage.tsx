import React from "react";
// Data and GraphQL
import { Mutation } from 'react-apollo';
import { ApolloError } from "apollo-client";
import { AUTH_TOKEN, IS_ADMIN } from "../../constants";
import { LOGIN, SIGNUP } from "../../queries";
// @material-ui/core components
import { WithStyles, CircularProgress, Theme, createStyles } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import Footer from "../../components/Footer/Footer";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import CardFooter from "../../components/Card/CardFooter";
import CustomInput from "../../components/CustomInput/CustomInput";
import SnackbarContent from "../../components/Snackbar/SnackbarContent";

import loginPageStyle from "../../assets/jss/material-kit-react/views/loginPage";

import image from "assets/img/bg7.jpg";

type LoginPageType = typeof loginPageStyle;

const styles = (theme: Theme) => createStyles({
    ...loginPageStyle,
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

type UserState = {
    [index: string] : string | number | boolean
    // login?: boolean
    username: string
    password: string
    name: string
};

class LoginPage extends React.Component<LoginPageType> {
    state: UserState = {
        login: true, // switch between Login and SignUp
        // login: this.props.login ? this.props.login : true,
        username: this.props.username ? this.props.username : '',
        password: this.props.password ? this.props.password : '',
        name: this.props.name ? this.props.name : '',
    };

    inputChangedHandler = (event: any, inputIdentifier: string) => {
        this.setState({ [inputIdentifier]: event.target.value });
    };

    updateErrorState = (error: any) => {
        this.setState({ error });
    }

    _confirm = async (data: any) => {
        const { token, user } = this.state.login ? data.login : data.signup;
        this._saveUserData(token, user.admin);
        this.props.history.push(`/`);
    };

    _saveUserData = (token: string, admin: boolean) => {
        localStorage.setItem(AUTH_TOKEN, token);
        if (admin) {
            localStorage.setItem(IS_ADMIN, 'Yes');
        }
    };

    render() {
        const { login, username, password, name } = this.state;
        const { classes, ...rest } = this.props as WithStyles<LoginPageType>;
        const headerLinks = {...this.props, classes: {}};
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
                              <h4>{login ? 'Login' : 'Sign Up'}</h4>
                            </CardHeader>
                            <CardBody>
                                {this.state.error &&
                                    <SnackbarContent
                                        message={<span><b>{this.state.error}</b></span>}
                                        color="danger"
                                        icon="warning_outline"
                                    />
                                }
                                <form className={classes.form}>
                                    {!login && (
                                        <CustomInput
                                            labelText="Full Name..."
                                            id="first"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "text",
                                                value: name,
                                                onChange: (e: any) => this.inputChangedHandler(e, 'name'),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                    <People className={classes.inputIconsColor} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                    <CustomInput
                                        labelText="Username..."
                                        id="username"
                                        formControlProps={{
                                        fullWidth: true
                                        }}
                                        inputProps={{
                                        type: "text",
                                            value: username,
                                            onChange: (e: any) => this.inputChangedHandler(e, 'username'),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                            <Email className={classes.inputIconsColor} />
                                            </InputAdornment>
                                        )
                                        }}
                                    />
                                    <CustomInput
                                        labelText="Password"
                                        id="pass"
                                        formControlProps={{
                                        fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "password",
                                            value: password,
                                            onChange: (e: any) => this.inputChangedHandler(e, 'password'),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon className={classes.inputIconsColor}>  lock_outline</Icon>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </form>
                            </CardBody>
                            <CardFooter className={classes.cardFooter}>
                                <Mutation
                                    mutation={login ? LOGIN : SIGNUP}
                                    variables={{ username, password, name }}
                                    onCompleted={ (data: any) => this._confirm(data)}
                                    onError={(error: ApolloError) => this.updateErrorState(error.message)}
                                >
                                    {(mutation: any, { loading }) => {
                                        if (loading) {
                                            return <CircularProgress color="primary" className={this.props.classes.progress} />;
                                        }
                                        return <Button color="primary" size="lg" onClick={mutation}>
                                            { login ? 'Login' : 'Get started' }
                                        </Button>
                                    }}
                                </Mutation>
                                <Button simple color="info" size="lg" onClick={() => this.setState({ login: !login })}>
                                    { login ? 'Need to create an account?' : 'Already have an account?' }
                                </Button>
                            </CardFooter>
                        </Card>
                      </GridItem>
                    </GridContainer>
                  </div>
                  {/*<Footer whiteFont />*/}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(LoginPage);
