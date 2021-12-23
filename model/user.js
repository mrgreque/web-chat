/*const Sequelize = require('sequelize');
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

module.exports = User;*/

const supabase = require('../database/online_db');

async function userAuth( {user, password} ) {
    let { result, error } = await supabase
        .from('usersv1')
        .select('*')
        .eq('username', user)
        .eq('password', password)

    result ? console.log(result) : console.log(error);
};

async function createUser ( {user, password, name} ) {
    let { result, error } = await supabase
        .from('usersv1')
        .insert([
            {
                username: user,
                password: password,
                name: name,
                active: 1
            }
        ]);

    return {result, error};
}

module.exports = {
    userAuth,
    createUser
}