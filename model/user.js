const Sequelize = require('sequelize');
const database = require('../database/db');

const User = database.define('user', {
    user: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    passwd: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ativo: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = User;