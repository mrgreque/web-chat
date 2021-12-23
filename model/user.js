const supabase = require('../database/db');

async function userAuth( {user, password} ) {
    let { data, error } = await supabase
        .from('usersv1')
        .select('*')
        .eq('username', user)
        .eq('password', password)

    return {data, error};
};

async function createUser ( {user, password, name} ) {
    let { data, error } = await supabase
        .from('usersv1')
        .insert([
            {
                username: user,
                password: password,
                name: name,
                active: 1
            }
        ]);

    return {data, error};
}

module.exports = {
    userAuth,
    createUser
}