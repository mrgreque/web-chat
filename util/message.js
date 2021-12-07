function messageModel(author, message) {
    const messageModel = {author: author, message: message, sendedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`};

    return messageModel;
};

function getPreviousTalks(user, rooms) {
    let talks = [];
    rooms.forEach(room => {
        if (room.users.includes(user) == true){
            talks.push({
                room: room.name,
                users: room.users
                //lastmessage
            })
        }
    });
    return talks;
};

function getIndexRoom (rooms, name) {
    let index = 0;

    for (let k = 0; k < rooms.length; k++){
        if (rooms[k].name == name){
            index = k;
        };
    };

    return index;
}

module.exports = {
    messageModel,
    getPreviousTalks,
    getIndexRoom
}