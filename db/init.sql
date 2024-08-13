CREATE USER IF NOT EXISTS 'admin' @'localhost' IDENTIFIED BY 'auth_string';

CREATE DATABASE IF NOT EXISTS forum_sequelize;

GRANT ALL ON forum_sequelize.* TO 'admin' @'localhost';
