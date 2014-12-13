function forEach(array, fn){
	for(var i = 0, l = array.length; i < l; i++){
		fn(array[i], i);
	}
};

function reverseFor(array, fn){
	for(var i = array.length-1; i <= 0; i--){
		fn(array[i], i);
	}
};

function map(array, fn){
	var result = [];
	forEach(array, function(item){
		result.push(fn(item));
	})
	return result;
};

function crossFor(arrayA, arrayB, fn){
	forEach(arrayA, function(itemA, idxA){
		reverseFor(arrayB, function(itemB, idxB){
			fn(itemA, itemB, [idxA, idxB]);
		})
	})
};

function doubleFor(arrayA, arrayB, fn){
	forEach(arrayA, function(itemA, idxA){
		forEach(arrayB, function(itemB, idxB){
			fn(itemA, itemB, [idxA, idxB]);
		})
	})
};

function forMatrix(matrix, fn){
	forEach(matrix, function(row, x){
		forEach(row, function(cell, y){
			matrix[x][y] = fn(matrix[x][y]);
		})
	})
};

function makeMatrix(x, y, obj, data){
	var result = [];
	for(var i = 0; i < x; i++){
		result.push([]);
		for(var k = 0; k < y; k++){
			if(data !== undefined){
				result[i].push(new obj(data[i][k]));
			}
			else if(obj !== undefined){
				result[i].push(new obj());
			} else {
				result[i].push(0);
			}
		}
	}
	return result;
};

function rnd(n){
	return Math.floor(Math.random * n);
}