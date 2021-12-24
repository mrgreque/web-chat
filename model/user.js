const supabase = require('../database/db');

async function userAuth( {user} ) {
    let { data, error } = await supabase
        .from('tb_users')
        .select('name, password')
        .eq('username', user)

    return {data, error};
};

async function createUser ( {email, user, password, name} ) {
    let dataStr = new Date(Date.now());
    let { data, error } = await supabase
        .from('tb_users')
        .insert([
            {
                email: email,
                username: user,
                password: password,
                name: name,
                active: 1,
                inserted_at: dataStr
            }
        ]);

    return {data, error};
}

module.exports = {
    userAuth,
    createUser
}