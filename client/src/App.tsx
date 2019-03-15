import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import indexRoutes from './routes';
import { IS_ADMIN, AUTH_TOKEN } from './constants';


const PrivateRoute: any = ({ component: Component, ...rest }: { component: any }) => {
  const isLoggedIn: boolean = localStorage.getItem(AUTH_TOKEN) != null;
  const isAdmin: boolean = isLoggedIn && localStorage.getItem(IS_ADMIN) != null;
  return <Route {...rest} render={(props) => (
    isAdmin
      ? <Component {...props} />
      : isLoggedIn ? <Redirect to='/' /> : <Redirect to='/login' />
  )} />
};

const LoginRoute: any = ({ component: Component, ...rest }: { component: any }) => {
  const isLoggedIn: boolean = localStorage.getItem(AUTH_TOKEN) != null;
  return <Route {...rest} render={(props) => (
    isLoggedIn
      ? <Redirect to='/' />
      : <Component {...props} />
  )} />
};

const privateRoutes = [
  "Add Product",
  "Edit Product"
]

class App extends Component {
  render() {
    return (
      indexRoutes.map((prop: any, key: any) => {
        if (prop.name == "Login") {
          return <LoginRoute exact path={prop.path} key={key} component={prop.component} />;
        } else if (privateRoutes.indexOf(prop.name) != -1) {
          return <PrivateRoute exact path={prop.path} key={key} component={prop.component} />;
        } else {
          return <Route exact path={prop.path} key={key} component={prop.component} />;
        }
      })
    );
  }
}
export default App;
