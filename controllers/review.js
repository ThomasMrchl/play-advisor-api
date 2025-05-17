const pool = require('../database/mysql.db');

exports.addReview = async (req, res) => {

    const { game_id, comment, stars, username } = req.body;

    try {
        // get the user id from the username
        const [user] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
        if (!user[0]) return res.status(404).json({ 'message': 'User not found' });

        if (!game_id || !comment || !stars, !username) return res.status(400).json({ 'message': 'Missing fields' });

        try {
            const [result] = await pool.query('INSERT INTO reviews (comment, stars, game_id, user_id) VALUES (?, ?, ?, ?)', [comment, stars, game_id, user[0].user_id]);
            if (!result) return res.status(404).json({ 'message': 'Review not found' });

            return res.status(201).json({ result });

        } catch (err) {
            return res.status(500).json({ 'message': 'Internal server error' });
        }
    }
    catch (err) {
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.getReviews = async (req, res) => {

    const { game_id } = req.body;

    try {
        if (!game_id) return res.status(400).json({ 'message': 'Missing fields' });

        const [result] = await pool.query('SELECT * FROM reviews WHERE game_id = ?', [game_id]);
        if (!result) return res.status(404).json({ 'message': 'Review not found' });

        return res.status(200).json({ result });

    } catch (err) {
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}