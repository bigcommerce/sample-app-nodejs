const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
const query = util.promisify(connection.query.bind(connection));

const usersCreate = query('CREATE TABLE `users` (\n' +
    '  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n' +
    '  `userId` int(11) NOT NULL,\n' +
    '  `storeId` int(11) NOT NULL,\n' +
    '  `email` text NOT NULL,\n' +
    '  `username` text,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `userId` (`userId`,`storeId`)\n' +
    ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n'
);

const storesCreate = query('CREATE TABLE `stores` (\n' +
    '  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n' +
    '  `storeId` int(11) NOT NULL,\n' +
    '  `accessToken` text,\n' +
    '  `scope` text,\n' +
    '  PRIMARY KEY (`id`),\n' +
    '  UNIQUE KEY `storeId` (`storeId`)\n' +
    ') ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;'
);

Promise.all([usersCreate, storesCreate]).then(() => {
    connection.end();
});
