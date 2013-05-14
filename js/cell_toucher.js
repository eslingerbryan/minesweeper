/* cell_toucher.js */

var self = this;

// Touch all adjacent squares (there are 8)
// Setting to either a number OR open state
// If adjacent square results in OPEN state: TOUCH it also
// obj = memory representation
function touchAdjacent (obj, grid) {
    var squares = null, //self.get8AdjacentSquares(obj),
        x,
        max,
        num_mines = 0,
        stack = [],
        n = null;

    stack.push(obj);

    if (obj.mine) {
        // console.log(obj);
        throw "error: 'touched' a mine automatically";
    }

    while (stack.length > 0) {
        num_mines = 0;
        n = stack.pop();

        squares = get8AdjacentSquares(n, grid);

        // calc # of mines
        for (x = 0, max = squares.length; x < max; x++) {
            var sq = squares[x];
            if (sq.mine) {
                num_mines++;
            }
        }

        if (num_mines > 0) {
            n.state  = 'number';
            n.number = num_mines;
        }
        else {
            n.state  = 'open';
            n.number = 0;
        }

        for (x = 0, max = squares.length; x < max; x++) {
            var sq = squares[x];
            if (sq.state === 'open' || sq.state === 'number') {
                // ignore because already processed
            }
            else if (!sq.mine && num_mines === 0) {
                stack.push(sq);
            }
        }
    }

    return grid;
};

function get8AdjacentSquares (obj, grid) {
    var array = [],
        x = obj.x,
        y = obj.y;

    //  0  1  2
    //  3  .  4
    //  5  6  7

    try {
        array[0] = grid[y-1][x-1];
    } catch(e) {};
    try {
        array[1] = grid[y-1][x];
    } catch(e) {};
    try {
        array[2] = grid[y-1][x+1];
    } catch(e) {};
    try {
        array[3] = grid[y][x-1];
    } catch(e) {};
    try {
        array[4] = grid[y][x+1];
    } catch(e) {};
    try {
        array[5] = grid[y+1][x-1];
    } catch(e) {};
    try {
        array[6] = grid[y+1][x];
    } catch(e) {};
    try {
        array[7] = grid[y+1][x+1];
    } catch(e) {};

    var results = [];
    for (var i = 0; i < 8; i++) {
        if (array[i]) {
            results.push(array[i]);
        }
    }

    return results;
};

function minesweeperCalculateWin (grid) {
	var win = false;


	return win;
};

if (self.document === undefined) {
	self.addEventListener('message', function (e) {
	    var data = e.data,
	        resp = {},
	        cell = {},
	        grid = {};
	    data = JSON.parse(data);

	    if (data.type === 'touch_adjacent') {
		    grid = data.grid;
		    cell = grid[data.y][data.x];
		    // This takes 1-2 seconds
		    grid = touchAdjacent(cell, grid);
		    // After work is finished pass the grid state back to main
		    resp = {
		    	'type': data.type,
		        'grid': grid
		    };
	    }
	    else if (data.type === 'calc_win') {
	    	resp = {
	    		'type': data.type,
	    		'win': minesweeperCalculateWin(grid)
	    	};
	    }
	    self.postMessage(JSON.stringify(resp));
	}, false);
}