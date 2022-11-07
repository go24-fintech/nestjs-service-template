import { CoreConfigModel, load as coreLoad } from 'be-core';
import { merge } from 'lodash';
import * as config from './config/config.json';

export class AuthenConfig {
    host: string
    endpointCheckLogin: string
    endpointRolePermission: string
}
export class KafkaConfig {
    enable: boolean
    brokers: string []
    consumerGroupId: string
}
export class ConnectionConfig {
    type: 'mongodb' | 'mysql' | 'mssql';
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
}

export class MongoDbConnectionConfig extends ConnectionConfig {
    authSource: string;
    replicaSet: string;
    ssl: boolean
    retryWrites: boolean
}

export class MysqlConnection extends ConnectionConfig {
}

export class ConfigModel extends CoreConfigModel {
    // add more config properties here
    mongoDbConnection: MongoDbConnectionConfig
    mysqlConnection: MysqlConnection
    authen: AuthenConfig
    kafka: KafkaConfig
}

const defaultConfig = () => {
    const defaultConfig = new ConfigModel();
    return defaultConfig;
};

const envConfig = () => {
    return require(`./config/config${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}.json`)
};

export const load = (): ConfigModel => {
    return merge(coreLoad(), defaultConfig(), config, envConfig()) as ConfigModel;
};

export const get = (key: string) => {
    const config = load();
    return config[key] as Record<string, any>;
};

console.log(load())