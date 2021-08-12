const mysql = require("mysql");
const util = require("util");

// const connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
const connection = mysql.createConnection({
  host: "sql10.freemysqlhosting.net",
  database: "sql10429924",
  user: "sql10429924",
  password: "3ENUVuyce3"
});
const query = util.promisify(connection.query.bind(connection));

const usersCreate = query(
  "CREATE TABLE `users` (\n" +
    "  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `userId` int(11) NOT NULL,\n" +
    "  `email` text NOT NULL,\n" +
    "  `username` text,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `userId` (`userId`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n"
);

const storesCreate = query(
  "CREATE TABLE `stores` (\n" +
    "  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `storeHash` varchar(10) NOT NULL,\n" +
    "  `accessToken` text,\n" +
    "  `scope` text,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `storeHash` (`storeHash`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;"
);

const storeUsersCreate = query(
  "CREATE TABLE `storeUsers` (\n" +
    "  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `userId` int(11) NOT NULL,\n" +
    "  `storeHash` varchar(10) NOT NULL,\n" +
    "  `isAdmin` boolean,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `userId` (`userId`,`storeHash`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n"
);

Promise.all([usersCreate, storesCreate]).then(() => {
  connection.end();
});
