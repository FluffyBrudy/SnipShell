import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const datasource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL!,
  entities: [
    __dirname + '//**/*.entity{.ts,.js}',
    process.cwd() + '/dist/**/*.entity.js',
  ],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migration',
});

export default datasource;
