exports.getGames = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM games ORDER BY game_id DESC LIMIT 50');

        return res.status(200).json({ result });

    } catch (err) {
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}

exports.addGame = async (req, res) => {
    const { game_name, game_year, game_description, game_minplayers, game_maxplayers, game_category } = req.body;

    if (!game_name || !game_year || !game_description || !game_minplayers || !game_maxplayers || !game_category) return res.status(400).json({ 'message': 'Missing fields' });

    try {
        await pool.query('INSERT INTO games (game_name, game_year, game_description, game_minplayers, game_maxplayers, game_category) VALUES (?, ?, ?, ?, ?, ?)', [name, description, genre, release_date, developer, publisher]);

        return res.status(201).json({ 'message': 'Game added successfully' });

    } catch (err) {
        return res.status(500).json({ 'message': 'Internal server error' });
    }
}