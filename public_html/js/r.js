/* global GL */

requirejs.config({
	baseUrl: '',
	paths: {
		core: 'js/core',
		app: 'js/app',
		enemies: 'js/enemies',
		birds: 'js/birds',
		bigBirds: 'js/bigBirds',
		rabbits: 'js/rabbits',
		vars: 'js/vars',
	},
	shim: {
		'app': {
			deps: ['core', 'vars']
		},
		'enemies': {
			deps: ['core', 'vars']
		}
	}
});

requirejs(['app', 'core', 'vars', 'enemies'],
		function (App, Core, vars, Enemies) {

			document.onkeydown = App.checkKey;
			// draw field
			App.setField();
			// draw H
			App.setForestman();

			// game cicle
			var timerId = setTimeout(function go() {
				// start game
				App.start();
				timerId = setTimeout(go, GL.timeout);
			}, GL.timeout);

			return this;
		});