const express = require('express');
// const cors = require('cors');
// const corsOptions = require('./config/corsOptions');
// const cookieParser = require('cookie-parser');
// const path = require('path');

// const postRoutes = require('./routes/post');
// const likeRoutes = require('./routes/like');
// const userRoutes = require('./routes/user');
// const followRoutes = require('./routes/follow');
// const clubRoutes = require('./routes/club');
// const memberRoutes = require('./routes/member');

// const credentials = require('./middleware/credentials');
// const verifyJWT = require('./middleware/verifyJWT');

// require('./databases/mysql.db');

const app = express();

// app.use(credentials);
// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/avatars', express.static(path.join(__dirname, './public/avatars')));
// app.use('/images', express.static(path.join(__dirname, './public/images')));
// app.use('/banners', express.static(path.join(__dirname, './public/banners')))

// app.use(verifyJWT);
// app.use('/api/user', userRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/like', likeRoutes);
// app.use('/api/follow', followRoutes);
// app.use('/api/club', clubRoutes);
// app.use('/api/member', memberRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

module.exports = app; 