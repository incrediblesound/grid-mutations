var Grid = function(x, y){
	this.grid = this.makeGrid(x, y);
	this.events = [];
	this.HEIGHT = x-1;
	this.WIDTH = y-1 || x-1;
};

Grid.prototype.makeGrid = function(x, y){
	if(y !== undefined){
		return makeMatrix(x, y, Cell);
	} else {
		return makeMatrix(x, x, Cell);	
	}
};

Grid.prototype.toggle = function(x, y){
	this.grid[x][y].toggle();
};

Grid.prototype.trigger = function(){
	var self = this;
	forEach(this.events, function(e){
		e(self);
	});
};

Grid.prototype.addEvent = function(e){
	this.events.push(e);
}

Grid.prototype.print = function(){
	var p;
	var div = document.getElementById('display');
	while(div.children.length > 0){
		div.children[0].remove();
	}
	forEach(this.grid, function(row){
		p  = document.createElement('p');
		row = map(row, function(cell){
			return cell.data;
		})
		p.textContent = p.textContent + row.toString();
		div.appendChild(p);
	})
};

Grid.prototype.inBounds = function(x, y){
	return (x >= 0 && x <= this.HEIGHT) &&
		   (y >= 0 && y <= this.WIDTH);
}

Grid.prototype.topLeftSweep = function(){
	var started = false;
	var pos = {x: 0, y: 0};
	var MR, MD;
	this.addEvent(function(context){
		if(!started){
			MR = moveRight(0, 0, context.grid);
			MR();
			started = true;
		} 
		else if(pos.y <= context.HEIGHT){
			MR();
			MD = moveDown(1, pos.y, context.grid);
			MD();
			context.addEvent(MD);
			pos.y++;
		}
	})
};

Grid.prototype.bottomLeftSweep = function(){
	var started = false;
	var pos = {x: this.WIDTH, y: 0};
	var MR, MD;
	this.addEvent(function(context){
		if(!started){
			MR = moveRight(context.HEIGHT, 0, context.grid);
			MR();
			started = true;
		} 
		else if(pos.y <= context.HEIGHT){
			MR();
			MU = moveUp(context.HEIGHT-1, pos.y, context.grid);
			MU();
			context.addEvent(MU);
			pos.y++;
		}
	})
};

Grid.prototype.topRightSweep = function(){
	var started = false;
	var pos = {x: 0, y: this.grid[0].length-1};
	var ML, MD;
	this.addEvent(function(context){
		if(!started){
			ML = moveLeft(0, pos.y, context.grid);
			ML();
			started = true;
		} 
		else if(pos.y >= 0){
			ML();
			MD = moveDown(1, pos.y, context.grid);
			MD();
			context.addEvent(MD);
			pos.y--;
		}
	})
};

Grid.prototype.bottomRightSweep = function(){
	var started = false;
	var pos = {x: this.HEIGHT, y: this.WIDTH};
	var ML, MU;
	this.addEvent(function(context){
		if(!started){
			ML = moveLeft(pos.x, pos.y, context.grid);
			ML();
			started = true;
		} 
		else if(pos.y >= 0){
			ML();
			MU = moveUp(pos.x-1, pos.y, context.grid);
			MU();
			context.addEvent(MU);
			pos.y--;
		}
	})
};

Grid.prototype.topLeftWave = function(width){
	var x = 0;
	this.addEvent(function(context){
		if(x === 0 || x === width){
			context.topLeftSweep();
		}
		x++;
	})
};

Grid.prototype.topRightWave = function(width){
	var x = 0;
	this.addEvent(function(context){
		if(x === 0 || x === width){
			context.topRightSweep();
		}
		x++;
	})
};

Grid.prototype.expandOutward = function(){
	var mid = {x: 0, y: 0};
	var UL, UR, DL, DR;
	mid.x = Math.floor(this.grid.length/2);
	mid.y = Math.floor(this.grid[0].length/2);
	var UL =    upLeft(mid.x,mid.y, this.grid);
	var UR =   upRight(mid.x,mid.y, this.grid);
	var DL =  downLeft(mid.x,mid.y, this.grid);
	var DR = downRight(mid.x,mid.y, this.grid);
	var started = false;
	this.addEvent(function(context){
		if(!started){
			context.grid[mid.x][mid.y].toggle();
			context.addEvent(moveUp   (mid.x-1, mid.y,   context.grid));
			context.addEvent(moveDown (mid.x+1, mid.y,   context.grid));
			context.addEvent(moveLeft (mid.x,   mid.y-1, context.grid));
			context.addEvent(moveRight(mid.x,   mid.y+1, context.grid));
			started = true;
		} else {
			UL(context);
			UR(context);
			DL(context);
			DR(context);
		}
	})
};

Grid.prototype.expandingWave = function(width){
	var x = 0;
	this.addEvent(function(context){
		if(x === 0 || x === width){
			context.expandOutward();
		}
		x++;
	})
}

var Cell = function(data){
	this.data = data || 0;
};

Cell.prototype.toggle = function(){
	this.data = (this.data === 0) ? 1 : 0;
};

function moveDown(x, y, grid){
	return function(){
		if(x <= grid.length-1){
			grid[x][y].toggle();
			x++;
		}
	}
};

function moveUp(x, y, grid){
	return function(){
		if(x >= 0){
			grid[x][y].toggle();
			x--;
		}
	}
};

function moveRight(x, y, grid){
	return function(){
		if(y <= grid[0].length-1){
			grid[x][y].toggle();
			y++;
		}
	}
};

function moveLeft(x, y, grid){
	return function(){
		if(y >= 0){
			grid[x][y].toggle();
			y--;
		}
	}
};

function upLeft(x, y, grid){
	var pos = {x: x, y: y};
	var ML, MU;
	return function(context){
		pos.x--;
		pos.y--;
		if(context.inBounds(pos.x, pos.y)){
			context.grid[pos.x][pos.y].toggle();
			ML = moveLeft(pos.x, pos.y-1, context.grid);
			MU = moveUp(pos.x-1, pos.y, context.grid);
			context.addEvent(ML);
			context.addEvent(MU);		
		}
	}
};

function upRight(x, y, grid){
	var pos = {x: x, y: y};
	var MR, MU;
	return function(context){
		pos.x--;
		pos.y++;
		if(context.inBounds(pos.x, pos.y)){
			context.grid[pos.x][pos.y].toggle();
			MR = moveRight(pos.x, pos.y+1, context.grid);
			MU = moveUp(pos.x-1, pos.y, context.grid);
			context.addEvent(MR);
			context.addEvent(MU);
		}
	}
};

function downLeft(x, y, grid){
	var pos = {x: x, y: y};
	var ML, MD;
	return function(context){
		pos.x++;
		pos.y--;
		if(context.inBounds(pos.x, pos.y)){
			context.grid[pos.x][pos.y].toggle();
			ML = moveLeft(pos.x, pos.y-1, context.grid);
			MD = moveDown(pos.x+1, pos.y, context.grid);
			context.addEvent(ML);
			context.addEvent(MD);
		}
	}
};

function downRight(x, y, grid){
	var pos = {x: x, y: y};
	var MR, MD;
	return function(context){
		pos.x++;
		pos.y++;
		if(context.inBounds(pos.x, pos.y)){
			context.grid[pos.x][pos.y].toggle();
			MR = moveRight(pos.x, pos.y+1, context.grid);
			MD = moveDown(pos.x+1, pos.y, context.grid);
			context.addEvent(MR);
			context.addEvent(MD);
		}
	}
};