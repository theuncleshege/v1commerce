# v1commerce

This is a simple e-commerce application. It has been built with service-oriented architecture and is broken down into 3 major parts namely:

- The Client - a `react` app which is what users see
- The API - an `apollo-graphql engine` server which is responsible for data and images
- The Webserver -  an `nginx` server responsible for routing requests to either the `client` or the `api` depending on the route

**_Because this is a simple application, `json` files are used as the datasource as opposed to a real database server such as MySQL or MongoDB..._**

There are two ways of running this application locally;

- Using Docker **(This is the preferred and recommended method)**
- Running each part of the application (client and api) separately

## 1. Using Docker (Recommended)

- Clone the repository
- Open your `terminal/command prompt/powershell` window and navigate to the `v1commerce` folder
- Then run `yarn start`
- Open your browser and navigate to `http://localhost:81` to see the running application

**_Please note that port `81` must be free on your system for this to work. The port number is configurable inside the `docker-compose.yml` file._**

## 2. Running Separately

- Clone the repository
- Open your `terminal/command prompt/powershell` window and navigate to the `v1commerce` folder
- Navigate further into the `api` folder and run `yarn install` or `npm install`
- Then run `yarn start` or `npm start` to start the API server
- Open your browser and navigate to `http://localhost:4000` to see the running GraphQL playground.(Optional)
- Open another `terminal/command prompt/powershell` window and navigate to the `v1commerce` folder
- Then navigate further into the `client` folder and run `yarn install` or `npm install`
- Then run `yarn start` or `npm start` to start the API server
- Open your browser and navigate to `http://localhost:3000` to see the running application

To run unit tests, please navigate into any of the `api` or `client` folders and run `yarn test` or `yarn test:coverage` (which generates test coverage reports). Kindly make sure that you have run `yarn install` inside the `api` and `client` folders first before trying to run unit tests.

## About the application

The application allows `create`, `update` and `delete` of products by an admin user. A regular user can only view products. Changes made by an admin are replicated on the user side.

The application also allows `create` of new **regular users**.

By default, one admin user and one regular user are available. Please see their credentials below:

### Admin User

> username: admin

> password: 123456

### Regular User

> username: user

> password: 123456

Please note that this is by no means a production ready app. It was just a simple project to demonstrate mastery of GraphQL and the Apollo Engine. It can also be used as seed project for more serious projects.

Credits to [creativetimofficial](https://github.com/creativetimofficial/material-kit-react) for the UI. The sample images used were sourced on the internet.

## Thank you