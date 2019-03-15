import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

import "./assets/scss/material-kit-react.css?v=1.3.0";
import './index.css';

import { AUTH_TOKEN, API_URI } from "./constants";
import App from './App';

const cache = new InMemoryCache();

const authLink = setContext((_: any, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const httpLink = createHttpLink({
    uri: API_URI
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <Switch>
                <App />
            </Switch>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
