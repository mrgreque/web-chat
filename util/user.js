let users = [];

function joinUser(id, username, room) {
    const usernameInit = {id: id, user: username, room: room};
    
    users.push(usernameInit);

    return usernameInit;
};

function getUser(id) {
    return users.find((user) => user.id == id);
};

function leaveUser(id) {
    const index = users.findIndex(user => user.id == id);

    users.pop(index);
};

module.exports = {
    joinUser,
    getUser,
    leaveUser
}