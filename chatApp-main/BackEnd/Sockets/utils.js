const { state } = require('../index')
// const axios = require('axios')
const pgClient = require('../DB')

const broadcast = async (senderId, recieverId, text) => {
    const connection = state.connections[recieverId];
    const sender = state.users[senderId];
    if (!sender) return;
    const payload = {
        from: sender,
        message: text
    };
    
    console.log(payload);
    if (connection && connection.readyState === 1) {
        connection.send(JSON.stringify(payload));
    }
    
    const sId = Number(senderId);
    const rId = Number(recieverId);
    const tableName = sId > rId ? `room_${rId}_${sId}` : `room_${sId}_${rId}`;
    const insertQuery = `INSERT INTO ${tableName} (s_id, s_username, message) VALUES ($1, $2, $3);`
    try {
        const result = await pgClient.query(insertQuery, [senderId, sender.username, text]);
        console.log(result.rows);
    } catch (error) {
        console.log(error);
    }
};

const handlemessage = (bytes, socket, user_id) => {
    const message = JSON.parse(bytes.toString());
    const persontosend = message.payload.to;
    const texttosend = message.payload.text;
    broadcast(user_id, persontosend, texttosend);
    console.log(message);
};

const handleclose = (uuid) => {
    delete state.connections[uuid];
    if (state.users[uuid]) state.users[uuid].isonline = false;
};

module.exports = {handleclose, handlemessage};