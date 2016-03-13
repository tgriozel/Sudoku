var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sudoku = require('./sudoku.js');

app.get('/', function (req, res) {
  app.use(express.static(__dirname, + '/style.css'));
  res.sendFile( __dirname + '/index.html');
});

// Difficulty setting, how many cells will be revealed from the start
const revealed_cells_count = 18;

// Shared data structures
var player_count = 0;
var matrix = [];
var revealed_matrix = [];
var solution;

getRandomNumber = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

initializeData = function () {
	solution = sudoku.generate_sudoku();

  for (i = 0; i < 9; ++i)
    revealed_matrix[i] = [];

	for (i = 0; i < revealed_cells_count; ++i) {
		var row = getRandomNumber(0, 8);
		var col = getRandomNumber(0, 8);
		if (revealed_matrix[row][col] == null)
			revealed_matrix[row][col] = solution[row][col];
		else
			--i;
	}

  for (i = 0; i < 9; ++i)
    matrix[i] = revealed_matrix[i].slice();
}

initializeData();

// Socket creation, transfer initial matrix and revealed cells, set event handlers
io.on('connection', function (socket) {
	socket.emit('initial', matrix, revealed_matrix);
	io.emit('update_player_count', ++player_count);
	socket.on('input', function (row, col, value) {
		matrix[row][col] = value;
		io.emit('update_cell', row, col, matrix[row][col]);
		if (sudoku.verify_matrix_equality(matrix, solution))
			io.emit('completed');
	});
	socket.on('new_game', function () {
		initializeData();
		socket.emit('initial', matrix, revealed_matrix);
	});
	socket.on('disconnect', function () {
		io.emit('update_player_count', --player_count);
	});
});

// listen on port 8000
http.listen(8000);
