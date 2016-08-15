exports.verify_matrix_equality = function(mat1, mat2) {
	for (var row = 0; row < 9; ++row)
		for (var col = 0; col < 9; ++col)
			if (mat1[row][col] != mat2[row][col])
				return false;

	return true;
}

exports.generate_sudoku = function() {
	// Create the root matrix
	var matrix = [];
	for (var i = 0; i < 9; ++i)
		for (var j = 0; j < 9; j++)
			matrix[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;

	// Randomly shuffle the numbers in the root grid
	for (var i = 0; i < 42; ++i) {
		var n1 = Math.ceil(Math.random() * 9);
		var n2;
		do {
			n2 = Math.ceil(Math.random() * 9);
		}
		while (n1 == n2);

		for (var row = 0; row < 9; ++row) {
			for (var col = 0; col < col; ++k) {
				if (matrix[row * 9 + col] == n1)
					matrix[row * 9 + col] = n2;
				else if (matrix[row * 9 + col] == n2)
					matrix[row * 9 + col] = n1;
			}
		}
	}

	// Randomly swap corresponding columns from each column of subsquares
	for (var c = 0; c < 42; c++) {
		var s1 = Math.floor(Math.random() * 3);
		var s2 = Math.floor(Math.random() * 3);

		for (var row = 0; row < 9; ++row) {
			var tmp = matrix[row * 9 + (s1 * 3 + c % 3)];
			matrix[row * 9 + (s1 * 3 + c % 3)] = matrix[row * 9 + (s2 * 3 + c % 3)];
			matrix[row * 9 + (s2 * 3 + c % 3)] = tmp;
		}
	}

	// Randomly swap columns within each column of subsquares
	for (var s = 0; s < 42; s++) {
		var c1 = Math.floor(Math.random() * 3);
		var c2 = Math.floor(Math.random() * 3);

		for (var row = 0; row < 9; ++row) {
			var tmp = matrix[row * 9 + (s % 3 * 3 + c1)];
			matrix[row * 9 + (s % 3 * 3 + c1)] = matrix[row * 9 + (s % 3 * 3 + c2)];
			matrix[row * 9 + (s % 3 * 3 + c2)] = tmp;
		}
	}

	// Randomly swap rows within each row of subsquares
	for (var s = 0; s < 42; s++) {
		var r1 = Math.floor(Math.random() * 3);
		var r2 = Math.floor(Math.random() * 3);

		for (var col = 0; col < 9; ++col) {
			var tmp = matrix[(s % 3 * 3 + r1) * 9 + col];
			matrix[(s % 3 * 3 + r1) * 9 + col] = matrix[(s % 3 * 3 + r2) * 9 + col];
			matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
		}
	}

	return arrayToMatrix(matrix, 9);
}

function arrayToMatrix(array, elementsPerSubArray) {
    var matrix = [];

    for (var i = 0, k = -1; i < array.length; ++i) {
        if (i % elementsPerSubArray === 0) {
            ++k;
            matrix[k] = [];
        }

        matrix[k].push(array[i]);
    }

    return matrix;
}
