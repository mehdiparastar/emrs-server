import { DataSource } from 'typeorm';

const dbConfig: IDBConfig = {
  development: {
    type: 'mysql',
    host: 'localhost',
    port: 3366,
    username: 'admin',
    password: 'admin',
    database: 'dev_db',
    entities: [
    ],
    synchronize: true,
    // synchronize: false,
    // migrations: ['src/migration_dev/*.js'],
    logging: false,
  }
}

const nodeENV = process.env.NODE_ENV || 'production';
console.log('node env is : ', nodeENV);
export const AppDataSource = new DataSource(dbConfig[`${nodeENV}`]);