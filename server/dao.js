'use strict';

const db = require('./db');

exports.createGame = (game) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO games(
			username, 
			score, 
			)VALUES(?,?)`;
		db.run(sql, [
			game.username,
			game.score,
		], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
};

exports.getGames = (username) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM games WHERE username = ?';
		db.get(sql, [username], function (err, row) {
			if (err) {
				return reject(err);
			}
			const game = { username: row.username, score: row.score }
			return resolve(game);
		});
	});
};

exports.getHallOfFame = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT username, score FROM games ORDER BY score DESC LIMIT 5';
		db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			const hof = rows.map(e => ({
				username: e.username,
				score: e.score
			}))
			resolve(hof);
		})
	})
};


