const pool = require('../database/mysql.db');

exports.getGames = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT g.*, 
                   COALESCE(SUM(r.stars) / NULLIF(COUNT(r.stars), 0), 0) as stars,
                   COUNT(r.review_id) as review_count
            FROM games g
            LEFT JOIN reviews r ON g.game_id = r.game_id
            GROUP BY g.game_id
            ORDER BY g.game_id DESC
        `);

        return res.status(200).json({ result });

    } catch (err) {
        console.error('Error fetching games:', err);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.getGame = async (req, res) => {
    const { game_name } = req.params;

    if (!game_name) return res.status(400).json({ 'message': 'Game name is required' });

    try {
        // Get game details with average rating
        const [gameResult] = await pool.query(`
            SELECT g.*, 
                   COALESCE(SUM(r.stars) / NULLIF(COUNT(r.stars), 0), 0) as stars,
                   COUNT(r.review_id) as review_count
            FROM games g
            LEFT JOIN reviews r ON g.game_id = r.game_id
            WHERE LOWER(REPLACE(g.game_name, ' ', '-')) = LOWER(?)
            GROUP BY g.game_id
        `, [game_name]);

        if (gameResult.length === 0) {
            return res.status(404).json({ 'message': 'Game not found' });
        }

        // Get reviews for this game
        const [reviews] = await pool.query(`
            SELECT r.*, u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.game_id = ?
        `, [gameResult[0].game_id]);

        const result = {
            ...gameResult[0],
            reviews: reviews
        };

        return res.status(200).json({ result });

    } catch (err) {
        console.error('Error fetching game:', err);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.addGame = async (req, res) => {
    const { game_name, game_year, game_description, game_minplayers, game_maxplayers, game_category } = req.body;

    if (!game_name || !game_year || !game_description || !game_minplayers || !game_maxplayers || !game_category) return res.status(400).json({ 'message': 'Missing fields' });

    try {
        await pool.query('INSERT INTO games (game_name, game_year, game_description, game_minplayers, game_maxplayers, game_category) VALUES (?, ?, ?, ?, ?, ?)', [game_name, game_year, game_description, game_minplayers, game_maxplayers, game_category]);

        return res.status(201).json({ 'message': 'Game added successfully' });

    } catch (err) {
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}