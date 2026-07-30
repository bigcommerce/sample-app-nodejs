import { Db } from '../types';

const { DB_TYPE } = process.env;

let db: Db;
const dbType = DB_TYPE || 'firebase';

switch (dbType) {
    case 'firebase':
        // Use require for conditional import
        db = require('./dbs/firebase');
        break;
    case 'mysql':
        db = require('./dbs/mysql');
        break;
    default:
        db = require('./dbs/firebase');
        break;
}

export default db;
