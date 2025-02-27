const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';
const nodemailer = require('nodemailer');
const { sendEmail } = require('../../emailService');
const fs = require('fs');
const db = require('../../db'); 

const signup = async (req, res) => {
    
    try {
        
        const imgpath = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
        const { fullName, username, email, password, role } = req.body;
        console.log(req.body);
        

        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM sahil.users WHERE email=$1';
        const emailResult = await db.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert the user data
        const insertQuery = `
            INSERT INTO sahil.users (full_name, username, email, password, role, image)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const insertResult = await db.query(insertQuery, [fullName, username, email, password, role, imgpath]);

        const newUser = insertResult.rows[0];

        // Create a JWT token with the user's role
        const payload = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Prepare the HTML email content
        const userHtmlTable = `
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                    <tr><th colspan="2">Registration Details</th></tr>
                </thead>
                <tbody>
                    <tr><td>Username:</td><td>${username}</td></tr>  <!-- Fixed variable name -->
                    <tr><td>Email:</td><td>${email}</td></tr>
                    <tr><td>Full Name:</td><td>${fullName}</td></tr>
                    <tr><td>Role:</td><td>${role}</td></tr>
                </tbody>
            </table>`;

        // await sendEmail(
        //     email,
        //     'Registration Details',
        //     `Hello ${fullName},<br><br>You have successfully registered with the following details:<br>${userHtmlTable}<br>Please wait for login until the admin approves you.`
        // );

        return res.json({
            success: 'User registered successfully',
            user: newUser,
            token: token,
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {signup}