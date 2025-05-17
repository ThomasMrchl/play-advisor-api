const pool = require('../database/mysql.db');

exports.getUsers = async (req, res) => {
    try{
  
      const [result] = await pool.query('SELECT username, email, country, admin FROM users');
  
      return res.status(200).json({ result });
  
    } catch (err) {
      return res.status(500).json({'message': 'Internal server error'});
    }
  
}

exports.addUser = async (req, res) => {
    if (!req.user) return res.status(401).json({'message': 'Authentification issue'});
  
    const { username, email, password, country } = req.body;
  
    if (!username || !email || !password || !country) return res.status(400).json({'message': 'Missing fields'});
  
    try {
      const [result] = await pool.query('INSERT INTO users (username, email, country) VALUES (?, ?, ?, ?)', [username, email, country]);
  
      return res.status(201).json({ result });
  
    } catch (err) {
      return res.status(500).json({'message': 'Internal server error'});
    }
  
}