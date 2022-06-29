import { Db } from '../types';
import * as firebaseDB from './dbs/firebase';
import * as sqlDB from './dbs/mysql';

const { DB_TYPE } = process.env;

let db: Db;

switch (DB_TYPE) {
    case 'firebase':
        db = firebaseDB;
        break;
    case 'mysql':
        db = sqlDB;
        break;
    default:
        db = firebaseDB;
        break;
}

export default db;
