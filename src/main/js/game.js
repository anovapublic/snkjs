/*global SNAKE, window */
/*jslint browser: true */
/*jslint bitwise: false */

/**
 * Anova IT Consulting 2011
 *
 * This file is licensed under the GPL version 3.
 * Please refer to the URL http://www.gnu.org/licenses/gpl-3.0.html for details.
 */
SNAKE.record = function () {
	'use strict';
	var record_html5, support_storage, record_dummy;

	support_storage = function () {
		try {
			return typeof window.localStorage !== 'undefined';
		} catch (err) {
			return false;
		}
	};

	record_html5 = {
		init: function () {
			if (window.localStorage['snake.record'] === null) {
				window.localStorage['snake.record'] = 0;
			}
		},
		set_record: function (record) {
			window.localStorage['snake.record'] = record;
		},
		get_record: function () {
			var record = window.localStorage['snake.record'];
			return record === null ? 0 : parseInt(record, 10);
		},
		clear: function () {
			window.localStorage.removeItem('snake.record');
		}
	};

	record_dummy = {
		init: function () {},
		set_record: function (record) {},
		get_record: function () {
			return 0;
		}	
	};

	return support_storage() ? record_html5 : record_dummy;
};

SNAKE.game = function () {
	'use strict';
	var canvas, engine, main, cb_draw_snake, cb_draw_food, cb_game_over,
		cb_next_tick, reset, moves;

	canvas = document.getElementById('canvas').getContext('2d');
	engine = null;

	main = function () {
		canvas.fillStyle = 'black';
		engine.tick();
	};

	cb_draw_snake = function (snake) {
		snake.map(function (p) {
			canvas.fillRect(p.x << 3, p.y << 3, 8, 8);
		});
	};

	cb_draw_food = function (food) {
		canvas.beginPath();
		canvas.arc((food.x << 3) + 4, (food.y << 3) + 4, 4, 0, 7);
		canvas.fill();
	};

	cb_game_over = function (snake) {
		canvas.fillStyle = 'red';
		cb_draw_snake(snake);
		setTimeout(function () {
			canvas.clearRect(0, 0, 128, 128);
			engine.reset();
			main();
		}, 500);
	};

	cb_next_tick = function (snake) {
		canvas.clearRect(0, 0, 128, 128);
		setTimeout(main, 350 - snake.length * 5);
	};

	reset = function () {
		engine = SNAKE.engine().init({
			draw_snake: cb_draw_snake,
			draw_food: cb_draw_food,
			game_over: cb_game_over,
			next_tick: cb_next_tick
		});
	};

	moves = {
		37: {x: -1, y:  0},
		38: {x:  0, y: -1},
		39: {x:  1, y:  0},
		40: {x:  0, y:  1}
	};

	return {
		init: function () {
			reset();
			window.addEventListener('keydown', function (e) {
				var m = moves[e.keyCode];
				if (m) {
					engine.move(m);
				}
			}, false);
			return this;
		},
		start: function () {
			setTimeout(main, 0);
		}
	};
};