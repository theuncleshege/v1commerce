import { GraphQLServer } from 'graphql-yoga';
import express from 'express';
import path from 'path';

import setConfig from './config';
import typeDefs from './schema';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';


setConfig();

export const resolvers = {
    Query,
    Mutation,
    Subscription
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: request => request
});

server.express.use("/images", express.static(path.join(__dirname, "../images")));
server.start(() => console.log(`API is running...`));

export default server;