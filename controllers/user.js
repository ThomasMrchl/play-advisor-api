const pool = require('../database/mysql.db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try{
  
      const [result] = await pool.query('SELECT username, email, country, admin FROM users');
  
      return res.status(200).json({ result });
  
    } catch (err) {
      return res.status(500).json({'message': 'Internal server error'});
    }
  
}

exports.addUser = async (req, res) => {
    console.log("add user called");
  
    const { username, email, password, country } = req.body;
  
    if (!username || !email || !password || !country) return res.status(400).json({'message': 'Missing fields'});
  
    try {
      // Hash the password with a salt round of 10
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password, country, admin) VALUES (?, ?, ?, ?, false)', 
        [username, email, hashedPassword, country]
      );
  
      return res.status(201).json({ 
        message: 'User created successfully',
        userId: result.insertId 
      });
  
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({'message': 'Username or email already exists'});
      }
      return res.status(500).json({'message': 'Internal server error'});
    }
}