import {Dialect, Options} from "sequelize/types";
import dotenv from 'dotenv';
dotenv.config();

export const development: Options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Dialect
};

export const test: Options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Dialect
};

export const production: Options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Dialect
};


  // export default {
  //   development: {
  //     username: process.env.DB_USERNAME,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_DATABASE,
  //     host: process.env.DB_HOST,
  //     dialect: process.env.DB_DIALECT as Dialect
  //   },
  //   test: {
  //     username: "root",
  //     password: 'nodejsbook',
  //     database: "nodebird_test",
  //     host: "127.0.0.1",
  //     dialect: "mysql" as const
  //   },
  //   production: {
  //     username: 'root',
  //     password: 'nodejsbook',
  //     database: 'nodebird',
  //     host: '127.0.0.1',
  //     dialect: 'mysql' as const,
  //     logging: false,
  //   },
  // };