angular.module('sudoku-app', []);

angular.module('sudoku-app').controller('MatrixController', ['$scope', 'socket', function($scope, socket) {
    $scope._ = _;
    $scope.matrix = [];
    $scope.revealed_matrix = [];
    $scope.gameCompleted = false;
    $scope.playerCount = 1;

    socket.on('initial', function (startMatrix, revealedMatrix) {
        $scope.matrix = startMatrix;
        $scope.revealed_matrix = revealedMatrix;
        $scope.gameCompleted = false;
    });

    socket.on('update_cell', function (update) {
        $scope.matrix[update.row][update.col] = update.value;
    });

    socket.on('update_player_count', function (count) {
        $scope.playerCount = count;
    });

    socket.on('completed', function () {
        $scope.gameCompleted = true;
    });

    $scope.changeCellValue = function (row, col) {
        socket.emit('input', {row: row, col: col, value: $scope.matrix[row][col]});
    }

    $scope.requestNewGame = function () {
        socket.emit('new_game');
    }
}]);
