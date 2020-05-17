const Sequelize = require("sequelize");

const connection = new Sequelize('guiaperguntas', 'root', 'NODE2020express', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;