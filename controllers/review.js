const pool = require('../database/mysql.db');

exports.addReview = async (req, res) => {
    const { game_id, comment, stars, username } = req.body;

    try {
        // get the user id from the username
        const [user] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
        if (!user[0]) return res.status(404).json({ 'message': 'User not found' });

        if (!game_id || !comment || !stars || !username) return res.status(400).json({ 'message': 'Missing fields' });

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
    const { game_id } = req.params;

    try {
        if (!game_id) return res.status(400).json({ 'message': 'Game ID is required' });

        const [result] = await pool.query('SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.game_id = ?', [game_id]);
        
        if (result.length === 0) {
            return res.status(200).json({ result: [] });
        }

        return res.status(200).json({ result });

    } catch (err) {
        console.error('Error fetching reviews:', err);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.updateReview = async (req, res) => {

    const { review_id } = req.params;
    const { comment, stars, username } = req.body;

    if (!comment || !stars || !username) {
        return res.status(400).json({ 'message': 'Missing fields' });
    }

    try {
        // First verify the user exists and get their ID
        const [user] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
        if (!user[0]) return res.status(404).json({ 'message': 'User not found' });

        // Check if the review exists and belongs to the user
        const [review] = await pool.query(
            'SELECT * FROM reviews WHERE review_id = ? AND user_id = ?',
            [review_id, user[0].user_id]
        );

        if (!review[0]) {
            return res.status(404).json({ 'message': 'Review not found or you do not have permission to modify it' });
        }

        // Update the review
        const [result] = await pool.query(
            'UPDATE reviews SET comment = ?, stars = ? WHERE review_id = ?',
            [comment, stars, review_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Review not found' });
        }

        return res.status(200).json({ 
            message: 'Review updated successfully',
            review: {
                review_id,
                comment,
                stars,
                username
            }
        });

    } catch (err) {
        console.error('Error updating review:', err);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.deleteReview = async (req, res) => {

    const { review_id } = req.params;


    try {
        const [result] = await pool.query('DELETE FROM reviews WHERE review_id = ?', [review_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Review not found' });
        }

        return res.status(200).json({ 
            message: 'Review deleted successfully'
        });

    } catch (err) {
        console.error('Error deleting review:', err);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}