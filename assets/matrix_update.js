var matrix = [], revealed_matrix = [];

var socket = io('http://localhost:8000');

gameInit = function () {
    socket.on('initial', function (startMatrix, revealedMatrix) {
        matrix = startMatrix;
        revealed_matrix = revealedMatrix;
        document.getElementById('game_status').innerHTML = '';
        updateMatrix();
    });

    socket.on('update_cell', function (changedRow, changedCol, value) {
        matrix[changedRow][changedCol] = value;
        updateMatrix();
    });

    socket.on('update_player_count', function (count) {
        document.getElementById('player_count').innerHTML = 'Players: ' + count;
    });

    socket.on('completed', function () {
        document.getElementById('game_status').innerHTML = 'Sudoku successfully completed!';
    });
}

requestNewGame = function () {
    socket.emit('new_game');
}

changeCellValue = function (cell, row, col) {
    socket.emit('input', row, col, cell.value);
}

updateMatrix = function() {
    var htmlMatrix = '<table>';
    for (row = 0; row < 9; ++row) {
        htmlMatrix += '<tr>';
        for (col = 0; col < 9; ++col) {
            htmlMatrix += '<td><select ';
            if (revealed_matrix[row][col] != null) {
                htmlMatrix += 'disabled="true">';
                htmlMatrix += '<option selected="selected">' + revealed_matrix[row][col] + '</option>';
            }
            else {
                htmlMatrix += 'onchange="changeCellValue(this, ' + row + ',' + col + ');">';
                htmlMatrix += '<option value="blank"> </option>';
                for (i = 1; i <= 9; ++i) {
                    var selected = '';
                    if (matrix[row][col] == i)
                        selected = 'selected="selected"';
                    htmlMatrix += '<option '+ selected + ' value="' + i + '">' + i + '</option>';
                }
            }
            htmlMatrix += '</select></td>';
        }
        htmlMatrix += '</tr>';
    }
    htmlMatrix += '</table>';
    document.getElementById('matrix').innerHTML = htmlMatrix;
}
