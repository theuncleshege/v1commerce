import { createConnection, getConnection } from 'typeorm';

const dbConnection = {
  async create() {
    await createConnection();
  },

  async close() {
    await getConnection().close();
  },

  async emptyDBTables() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  },
};

beforeAll(async () => {
  await dbConnection.create();
});

afterAll(async () => {
  await dbConnection.emptyDBTables();
  await dbConnection.close();
});

beforeEach(async () => {
  await dbConnection.emptyDBTables();
});
