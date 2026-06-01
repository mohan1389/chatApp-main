const pgClient = require('../DB')

exports.fetchSentRequests = async (req, res) => {
    const userData = req.userData;
    const status = req.query.status;
    const fetchQuery = `
        SELECT 
            fr.id AS request_id,
            fr.requester_id,
            fr.requestee_id,
            fr.timestamp,
            fr.status,
            u.username AS friend_username,
            u.id AS user_id
        FROM 
            friendRequests fr
        JOIN 
            users u 
            ON u.id = CASE 
                WHEN fr.requester_id = $1 THEN fr.requestee_id
                ELSE fr.requester_id
            END
        WHERE 
            (fr.requester_id = $1 OR fr.requestee_id = $1)
            AND fr.status = $2;
    `
    try {
       const result = await pgClient.query(fetchQuery, [userData.id, status]);
       res.json({
        success: true,
        requests: result.rows,
       }) 

    } catch (error) {
       res.json({
        success: false,
        error: error,
        message: "try again"
       }) 
    }
}

exports.sendRequest = async (req, res) => {
    let target = req.body.friendId;
    const userData = Number(req.userData.id);

    if (!target) {
        return res.json({
            success: false,
            message: "Username or User ID is required"
        });
    }

    let friendId;
    // Resolve friendId from target (could be a numeric string ID, a number, or a username string)
    if (isNaN(Number(target))) {
        // Target is a username
        try {
            const userRes = await pgClient.query("SELECT id FROM users WHERE LOWER(username) = LOWER($1)", [target]);
            if (userRes.rows.length === 0) {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }
            friendId = Number(userRes.rows[0].id);
        } catch (error) {
            console.error(error);
            return res.json({
                success: false,
                message: "Error searching user by username",
                error: error.message
            });
        }
    } else {
        // Target is a numeric ID
        friendId = Number(target);
        try {
            const userRes = await pgClient.query("SELECT id FROM users WHERE id = $1", [friendId]);
            if (userRes.rows.length === 0) {
                return res.json({
                    success: false,
                    message: "User with this ID not found"
                });
            }
        } catch (error) {
            console.error(error);
            return res.json({
                success: false,
                message: "Error verifying user ID",
                error: error.message
            });
        }
    }

    if (friendId === userData) {
        return res.json({
            success: false,
            message: "You cannot send a friend request to yourself"
        });
    }

    const checkExistingQuery = `
        SELECT id, status FROM friendRequests 
        WHERE (requester_id = $1 AND requestee_id = $2) 
           OR (requester_id = $2 AND requestee_id = $1)
    `;
    const sendQuery = `INSERT INTO friendRequests (requester_id, requestee_id, status) VALUES ($1, $2, 'pending')`;

    try {
        const response = await pgClient.query(checkExistingQuery, [userData, friendId]);
        if (response.rows.length > 0) {
            const existing = response.rows[0];
            return res.json({
                message: `Friend request already sent or exists! Status: ${existing.status}`,
                success: false,
            });
        }
    } catch (error) {
        console.error(error);
        return res.json({
            message: 'Error checking existing request',
            success: false,
            error: error.message
        });
    }

    try {
        const result = await pgClient.query(sendQuery, [userData, friendId]);
        console.log("Friend request sent successfully:", result.rowCount);
        return res.json({
            success: true,
            message: "Friend request sent successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            error: error.message,
            message: "Failed to send request. Try again later."
        });
    }
}

exports.handleRequest = async (req, res) => {
    const { req_id, isAccept } = req.body;
    const userData = req.userData;
    const status = isAccept ? "accepted" : "rejected"; 
    const checkReqQuery = `SELECT * FROM friendRequests WHERE id = $1 AND requestee_id = $2`;
    const handleQuery = `UPDATE friendRequests SET status = $1 WHERE id = $2;`;

    try {
        const checkResults = await pgClient.query(checkReqQuery, [req_id, userData.id]);
        if (!checkResults.rows[0]) {
            return res.json({
                success: false,
                message: 'No such friend request'
            });
        }

        if (checkResults.rows[0].status !== "pending") {
            return res.json({
                success: false,
                message: "The request is already handled"
            });
        }

        const senderUserid = Number(checkResults.rows[0].requester_id);
        const recieverUserId = Number(checkResults.rows[0].requestee_id);

        const sortedIds = [senderUserid, recieverUserId].sort((a, b) => a - b);
        const tableName = `room_${sortedIds[0]}_${sortedIds[1]}`;

        const setUpRoomQuery = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id SERIAL PRIMARY KEY,
                s_id INTEGER NOT NULL,
                s_username VARCHAR(255) NOT NULL,
                message VARCHAR(255) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (s_id) REFERENCES users(id) ON DELETE CASCADE      
            );
        `;

        await pgClient.query('BEGIN');
        await pgClient.query(handleQuery, [status, req_id]);
        if (isAccept) {
            await pgClient.query(setUpRoomQuery);
        }
        await pgClient.query('COMMIT');

        return res.json({ success: true });

    } catch (error) {
        console.log(error);
        await pgClient.query('ROLLBACK');
        return res.json({
            success: false,
            error: error.message,
            message: "Try again"
        });
    }
}
