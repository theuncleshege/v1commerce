import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import typeDefs from '~/schema';
import Query from '~/resolvers/Query';
import Mutation from '~/resolvers/Mutation';
import Subscription from '~/resolvers/Subscription';

export const resolvers = {
  Query,
  Mutation,
  Subscription,
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: request => request,
});

async function startServer() {
  await createConnection();
  server.start(() => console.log(`API is running...`));
}

startServer();

export default server;
