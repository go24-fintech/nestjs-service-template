import { CoreConfigModel, load as coreLoad } from 'be-core';
import { MailOption } from 'be-core/dist/src/modules/mail/type';
import { merge } from 'lodash';
import * as config from './config/config.json'

export class AuthenConfig {
    authBrandUri: string
    authPlatformUri: string
}

export class ConnectionConfig {
    type: 'mongodb' | 'mysql' | 'mssql';
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
    authSource: string;
    replicaSet: string;
    ssl: boolean
    retryWrites: boolean
}

export class ConfigModel extends CoreConfigModel {
    // add more config properties here
    connection: ConnectionConfig
    authen: AuthenConfig
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