const pgClient = require("../DB");

exports.insertMsg = async (req, res) => {
    const {user_id, username, rec_id, message} = req.body;
    const uId = Number(user_id);
    const rId = Number(rec_id);
    const tableName = uId > rId ? `room_${rId}_${uId}` : `room_${uId}_${rId}`;
    const insertQuery = `INSERT INTO ${tableName} (s_id, s_username, message) VALUES ($1, $2, $3);`
    try {
        const result = await pgClient.query(insertQuery, [user_id, username, message]);
        console.log(result.rows);
        res.json({
            success: true,
            response:  result.rows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: error,
            message: "try again later"
        })
    }
}

exports.fetchChats = async(req, res) => {
    const {rec_id} = req.query;
    const user_id = req.userData.id;
    const uId = Number(user_id);
    const rId = Number(rec_id);
    const tableName = uId > rId ? `room_${rId}_${uId}` : `room_${uId}_${rId}`;
    const fetchQuery = `SELECT * FROM ${tableName}`;
    try {
        const result = await pgClient.query(fetchQuery);
        res.json({
            success: true,
            response:  result.rows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: error,
            message: "try again later"
        })
    }
}