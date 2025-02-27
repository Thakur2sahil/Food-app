const db = require("../../db");
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

const  login = async(req,res)=>{
    
        const { email, password } = req.body;
       
    
        // Check if the user exists with the provided email and password
        const select = "SELECT * FROM sahil.users WHERE email=$1 AND password=$2";
    
        db.query(select, [email, password], (err, data) => {
            if (err) {
                console.error({ err: "Database error" });
                return res.status(500).json('Database error');
            }           
    
            if (data.rows.length > 0) {
                const user = data.rows[0];
    
                // Check if the user is approved
                // if (user.approved === false) { // Assuming approved is a boolean
                //     return res.status(403).json({ error: 'Your account is not approved by the admin. Please wait for approval.' });
                // }
    
                // Create a JWT payload with user's role (admin/user)
                const payload = {
                    id: user.id,
                    email: user.email,
                    role: user.role // 'admin' or 'user'
                };
    
                // Sign the token with the secret key
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                console.log("token",token);
                
    
                return res.status(200).json({
                    message: "Successful Login",
                    user: user,
                    token: token // Return the JWT token
                });
            } else {
                return res.status(404).json({ error: 'Invalid email or password' });
            }
        });

}

module.exports = {login}