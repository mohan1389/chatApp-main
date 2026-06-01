const pgClient = require('../DB');
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.jwtSecret;
console.log("JWT SECRET =", jwtSecret);

exports.fetchUser = async (req, res) => {
    const userData = req.userData;
    const sqlQuery = `SELECT id, username, email FROM users WHERE username = $1`
    try {
        const response = await pgClient.query(sqlQuery, [userData.username])
        if(response.rows[0]){
            res.json({
                success: true,
                user: response.rows[0],
            })
        }
    } catch (error) {
       console.log(error),
       res.json({
        success: false,
        message: 'try again later',
        error: error
       }) 
    }
}

const genToken = (data, key) => {
    const token = jwt.sign(data, key, {
        expiresIn: '1h'
    }) 
    return token;
}

// exports.signinUser = async (req, res) => {
//     const {username, email, password} = req.body;
//     console.log(username, email, password)
//     const selectQuery = `SELECT id, username, email, password FROM users WHERE username = $1`
//     try {
//         const response = await pgClient.query(selectQuery, [username])
//         if(response.rows[0].password == password){
//             try {
//                 const payload = {
//                         username: username,
//                         id: response.rows[0].id,
//                         email: email
//                     }
//                 const webToken = genToken(payload, jwtSecret);

//                 res.status(200).json({
//                     message: 'signin successful',
//                     success: true,
//                     token: webToken,
//                 });

//             } catch (error) {
//                 console.log(error)
//                 res.json({
//                     message: 'jsonWebToken error, while decoding',
//                     success: false
//                 }) 
//             }
//         }else{
//             res.json({
//                 message: "not correct password",
//                 success: false,
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({
//             message: 'DB error',
//             success: false
//         })    
//     }
// }

exports.signinUser = async (req, res) => {
    const {username, email, password} = req.body;

    const selectQuery = `
        SELECT id, username, email, password 
        FROM users 
        WHERE username = $1
    `;

    try {
        const response = await pgClient.query(selectQuery, [username]);

        // USER EXISTS CHECK
        if (!response.rows[0]) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // PASSWORD CHECK
        if (response.rows[0].password !== password) {
            return res.json({
                success: false,
                message: "Incorrect password"
            });
        }

        const payload = {
            username: response.rows[0].username,
            id: response.rows[0].id,
            email: response.rows[0].email
        };

        const webToken = jwt.sign(payload, jwtSecret, {
            expiresIn: '1h'
        });

        return res.status(200).json({
            message: 'signin successful',
            success: true,
            token: webToken,
        });

    } catch (error) {
        console.log(error);

        return res.json({
            message: 'DB/server error',
            success: false,
            error: error.message
        });
    }
}

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    const sqlQuery = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id;`
    const selectQuery = `SELECT id, username, email FROM users WHERE username = $1`
    try {
        const res1 = await pgClient.query(selectQuery, [username]);
        if(res1.rows[0]){
            res.json({
                success: false,
                message: 'user already exists',
            })
            return;
        }else{
            const id = await pgClient.query(sqlQuery, [username, password, email]);
            res.json({
                success: true,
                message: "user created!",
                userId: id.rows[0].id
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "try again later"
        })
        return;
    }
    
}