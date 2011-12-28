/**
 * Anova IT Consulting 2011
 *
 * This file is licensed under the GPL version 3.
 * Please refer to the URL http://www.gnu.org/licenses/gpl-3.0.html for details.
 */

var SNAKE = {};

SNAKE.engine = function () {
	'use strict';
	var point, snake, direction, params, rnd_coord, next_move, cmp, in_snake,
		create_food, out_limits, food;
	
	point = function (x, y) {
		return {x: x, y: y};
	};

	snake = [point(8, 8), point(7, 8), point(6, 8)];
	direction = point(1, 0);

	params = {
		draw_snake: function (p) {},
		game_over: function (ps) {},
		draw_food: function (p) {},
		eat_food: function (p) {},
		next_tick: function (t) {},
		rows: 16,
		columns: 16,
		size: 3,
		ahead: point(1, 0)
	};

	rnd_coord = function () {
		return point(
			Math.floor(Math.random() * params.columns),
			Math.floor(Math.random() * params.rows)
		);
	};

	next_move = function () {
		return point(snake[0].x + direction.x, snake[0].y + direction.y);
	};

	cmp = function (a, b) {
		return a.x === b.x && a.y === b.y;
	};

	in_snake = function (p) {
		var i;
		for (i = 0; i < snake.length; i++) {
			if (cmp(snake[i], p)) {
				return true;
			}
		}
		return false;
	};

	create_food = function () {
		var xy;
		do {
			xy = rnd_coord();
		} while (in_snake(xy));
		return xy;
	};

	out_limits = function (p) {
		return p.x < 0 || p.x > params.columns - 1
			|| p.y < 0 || p.y > params.rows - 1;
	};

	food = create_food();

	return {
		init: function (options) {
			var opt;
			for (opt in options) {
				if (options.hasOwnProperty(opt)) {
					params[opt] = options[opt];
				}
			}

			this.reset();
			return this;
		},
		reset: function () {
			var sx, sy, i;
			sx = Math.floor(params.columns / 2);
			sy = Math.floor(params.rows / 2);

			snake = [];
			for (i = 0; i < params.size; i++) {
				snake.push(point(sx - i, sy));
			}

			direction = params.ahead;
			food = this.create_food();
		},
		move: function (p) {
			if (p.x !== -direction.x && p.y !== -direction.y) {
				direction = p;
			}
		},
		tick: function () {
			var n = next_move();
			if (out_limits(n) || in_snake(n)) {
				params.game_over(snake);
			} else {
				snake.unshift(n);
				if (cmp(snake[0], food)) {
					params.eat_food(food);
					food = this.create_food();
				} else {
					snake.pop();
				}

				params.next_tick(snake);
			}

			params.draw_snake(snake);
			params.draw_food(food);
		},
		create_food: create_food
	};
};