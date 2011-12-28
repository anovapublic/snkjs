/*jslint undef: false */

module('Motor');
test('Regla 1: la serpiente muere al chocar con el muro', function() {
	expect(1);
	var engine, i;

	function SnakeDead() {
	}	

	engine = SNAKE.engine().init({
		game_over : function(snake) {
			throw new SnakeDead();
		},
		rows : 16,
		columns : 16
	});

	try {
		for (i = 1; i < 8; i++) {
			engine.tick();
		}

		raises(engine.tick, SnakeDead, 'Llegó al borde');
	} catch (err) {
		if (err instanceof SnakeDead) {
			ok(false, 'Murió antes de llegar al borde');
		} else {
			throw err;
		}
	}
});

test('Regla 2: la serpiente crece cada vez que come', function() {
	expect(1);
	var engine, fx, size, i;

	function SnakeHungry() {
	}

	engine = SNAKE.engine();
	fx = 9;
	size = 3;

	engine.create_food = function() {
		return {
			x : fx++,
			y : 8
		};
	};

	engine.init({
		next_tick : function(snake) {
			if (snake.length !== ++size) {
				throw new SnakeHungry();
			}
		},
		rows : 16,
		columns : 16,
		ahead : {
			x : 1,
			y : 0
		},
		size : size
	});

	try {
		for (i = 1; i < 8; i++) {
			engine.tick();
		}

		ok(true, 'La serpiente creció');
	} catch (err) {
		if (err instanceof SnakeHungry) {
			ok(false, 'La serpiente no creció');
		} else {
			throw err;
		}
	}
});

test('Regla 3: la serpiente no puede volver sobre sus pasos', function() {
	expect(1);
	var up, right, left, down, engine, dir, old_snake;

	function SnakeBack() {
	}

	up = {x : 0, y : -1};
	right = {x : 1,y : 0};
	left = {x : -1, y : 0};
	down = {x : 0, y : 1};

	engine = SNAKE.engine();
	engine.create_food = function() {
		return {
			x : 1,
			y : 1
		};
	};

	dir = right;
	old_snake = [];

	function test_next_tick(snake) {
		if (old_snake.length !== 0) {
			if (old_snake[0].x !== snake[0].x - dir.x
					|| old_snake[0].y !== snake[0].y - dir.y) {
				throw new SnakeBack();
			}
		}

		old_snake = snake.slice(0);
	}

	engine.init({
		next_tick : test_next_tick,
		ahead : dir,
		rows : 32,
		columns : 32
	});

	// Lo comprobamos en las cuatro direcciones del avance
	try {
		engine.tick();

		engine.move(left); // intenta avanzar a izquierdas
		engine.tick();

		engine.move(dir = up); // encara hacia arriba
		engine.tick();

		engine.move(down); // intenta avanzar hacia abajo
		engine.tick();

		engine.move(dir = left); // encara a izquierdas

		engine.move(right); // intenta avanzar a derechas
		engine.tick();

		engine.move(dir = down); // encara hacia abajo

		engine.move(up); // intenta avanzar hacia arriba
		engine.tick();

		ok(true, 'Movimiento correcto');
	} catch (err) {
		if (err instanceof SnakeBack) {
			ok(false, 'Retrocedió');
		} else {
			throw err;
		}
	}
});

test('Regla 4: la serpiente muere si se come a sí misma', function() {
	expect(1);
	var up, right, left, down, engine;

	function SnakeDead() {
	}

	up = {x : 0, y : -1};
	right = {x : 1,y : 0};
	left = {x : -1, y : 0};
	down = {x : 0, y : 1};

	engine = SNAKE.engine();
	engine.create_food = function() {
		return {
			x : 1,
			y : 1
		};
	};

	engine.init({
		game_over : function(snake) {
			throw new SnakeDead();
		},
		ahead : right,
		rows : 32,
		columns : 32,
		size : 4
	});

	// Haremos un ciclo
	try {
		engine.tick();
		engine.move(up);
		engine.tick();
		engine.move(left);
		engine.tick();
		engine.move(down);

		raises(engine.tick, SnakeDead, 'Se mordió');
	} catch (err) {
		if (err instanceof SnakeDead) {
			ok(false, 'Murió antes de morderse');
		} else {
			throw err;
		}
	}
});

test('Regla 5: sólo cuando come aparece un nueva comida', function() {
	expect(1);
	var engine, fx, clean, i;

	function SnakeStarve() {
	}
	function SnakeFull() {
	}

	engine = SNAKE.engine();
	fx = 9;
	clean = true;

	engine.create_food = function() {
		if (!clean) {
			throw new SnakeFull();
		}

		clean = false;
		return {
			x : fx++,
			y : 8
		};
	};

	engine.init({
		eat_food : function() {
			clean = true;
		},
		rows : 16,
		columns : 16,
		ahead : {
			x : 1,
			y : 0
		},
		size : 3

	});

	try {
		for (i = 1; i < 8; i++) {
			engine.tick();
			if (clean) {
				throw new SnakeStarve();
			}
		}

		ok(true, 'La comida se repuso');
	} catch (err) {
		if (err instanceof SnakeStarve) {
			ok(false, 'La comida no se repuso');
		} else if (err instanceof SnakeFull) {
			ok(false, 'Hay comida de más');
		} else {
			throw err;
		}
	}
});
