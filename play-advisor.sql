CREATE DATABASE gameadvisor;

USE gameadvisor;


CREATE TABLE games(
   game_id INT,
   game_name VARCHAR(50),
   game_year INT,
   game_description VARCHAR(200),
   game_minplayers INT,
   game_maxplayers INT,
   game_category VARCHAR(50),
   popularity_score DECIMAL(15,2),
   PRIMARY KEY(game_id)
);

CREATE TABLE users(
   user_id INT,
   username VARCHAR(50),
   email VARCHAR(50),
   password VARCHAR(50),
   country VARCHAR(50),
   admin BOOLEAN,
   PRIMARY KEY(user_id)
);

CREATE TABLE reviews(
   review_id INT,
   comment VARCHAR(50),
   stars INT,
   game_id INT NOT NULL,
   user_id INT NOT NULL,
   PRIMARY KEY(review_id),
   FOREIGN KEY(game_id) REFERENCES games(game_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE likes(
   review_id INT,
   user_id INT,
   PRIMARY KEY(review_id, user_id),
   FOREIGN KEY(review_id) REFERENCES reviews(review_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id)
);


INSERT INTO games VALUES
(30549, 'Pandemic', 2008, 'In Pandemic, several virulent diseases have broken out simultaneously all over the world! The players are disease-fighting specialists whose mission is to treat disease hotspots while researching', 2, 4, '[''Medical'']', 0),
(822, 'Carcassonne', 2000, 'Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or so', 2, 5, '[''City Building'']', 0),
(13, 'Catan', 1995, 'In CATAN (formerly The Settlers of Catan), players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what r', 3, 4, '[''Economic'']', 0),
(68448, '7 Wonders', 2010, 'You are the leader of one of the 7 great cities of the Ancient World. Gather resources, develop commercial routes, and affirm your military supremacy. Build your city and erect an architectural w', 2, 7, '[''Ancient'']', 0),
(36218, 'Dominion', 2008, '&quot;You are a monarch, like your parents before you, a ruler of a small pleasant kingdom of rivers and evergreens. Unlike your parents, however, you have hopes and dreams! You want a bigger and', 2, 4, '[''Card Game'']', 0);


INSERT INTO users VALUES
(1, 'alice', 'alice@example.com', 'password123', 'France', false),
(2, 'bob', 'bob@example.com', 'passw0rd', 'USA', false),
(3, 'charlie', 'charlie@example.com', '123456', 'UK', false),
(4, 'diana', 'diana@example.com', 'mypassword', 'Canada', false),
(5, 'edward', 'edward@example.com', 'edwardpass', 'Germany', true);


INSERT INTO reviews VALUES
(1, 'Cooperative masterpiece!', 5, 30549, 1),
(2, 'Great tile-laying mechanics.', 4, 822, 2),
(3, 'Classic and accessible.', 4, 13, 3),
(4, 'Fast and strategic.', 5, 68448, 4),
(5, 'Simple but very deep.', 5, 36218, 5);


INSERT INTO likes VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 4),
(4, 5),
(5, 1);

-- Views 

-- View 1: List of available games (basic game info)
CREATE VIEW view_available_games AS
SELECT game_name, game_year, game_category
FROM games;

-- View 2: User Review History
CREATE VIEW view_user_review_history AS
SELECT u.username, g.game_name, r.stars, r.comment
FROM users u
JOIN reviews r ON u.user_id = r.user_id
JOIN games g ON r.game_id = g.game_id;

-- View 3: Top Rated Games (average stars >= 4)
CREATE VIEW view_top_rated_games AS
SELECT g.game_id, g.game_name, AVG(r.stars) AS avg_rating
FROM games g
JOIN reviews r ON g.game_id = r.game_id
GROUP BY g.game_id, g.game_name
HAVING AVG(r.stars) >= 4;

-- Index
-- Index 1: For faster search by category
CREATE INDEX idx_games_category ON games(game_category);

-- Index 2: For faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- Index 3: For quick review filtering by star rating
CREATE INDEX idx_reviews_stars ON reviews(stars);


-- Triggers

DELIMITER $$

-- Trigger 1: Update popularity score when a new review is inserted
CREATE TRIGGER trg_update_popularity_on_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE games
    SET popularity_score = popularity_score + 1
    WHERE game_id = NEW.game_id;
END;
$$

-- Trigger 2: Ensure reviews stars are between 1 and 5
CREATE TRIGGER trg_validate_review_stars
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.stars < 1 THEN
        SET NEW.stars = 1;
    ELSEIF NEW.stars > 5 THEN
        SET NEW.stars = 5;
    END IF;
END;
$$

-- Trigger 3: Auto-delete likes if a review is deleted
CREATE TRIGGER trg_delete_likes_on_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    DELETE FROM likes WHERE review_id = OLD.review_id;
END;
$$

DELIMITER ;



Procedure: 

-- Function 1: Get average star rating for a game
DELIMITER //
CREATE FUNCTION fn_get_average_rating(p_game_id INT)
RETURNS DECIMAL(3,2)
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    SELECT AVG(stars) INTO avg_rating
    FROM reviews
    WHERE game_id = p_game_id;
    RETURN avg_rating;
END;
//
DELIMITER ;

-- Procedure 2 : Add a new review on a game
DELIMITER //
CREATE PROCEDURE sp_add_review (
    IN p_comment VARCHAR(50),
    IN p_stars INT,
    IN p_game_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE game_exists INT;
    DECLARE user_exists INT;

    SELECT COUNT(*) INTO game_exists FROM games WHERE game_id = p_game_id;
    SELECT COUNT(*) INTO user_exists FROM users WHERE user_id = p_user_id;

    IF game_exists = 1 AND user_exists = 1 THEN
        INSERT INTO reviews (comment, stars, game_id, user_id)
        VALUES (p_comment, p_stars, p_game_id, p_user_id);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid game_id or user_id';
    END IF;
END;
//

DELIMITER ;

-- Function 3 : Returns the number of likes on a review
DELIMITER //
CREATE FUNCTION fn_count_review_likes(p_review_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE like_count INT;
    SELECT COUNT(*) INTO like_count FROM likes WHERE review_id = p_review_id;
    RETURN like_count;
END;
//
DELIMITER ;
