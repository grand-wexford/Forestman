/* global GL, $el */

define(["core"], function (Core) {
	var eType = 'rabbit';
	var E = GL.enemies[eType];
	return {
		makeUnits: function () {
			var left;
			var top;
			var randLeft;
			var randTop;
			var from;

			for (var i = 0; i < E.count; i++) {
				randLeft = GL.groundWidth / E.step;
				randTop = GL.groundHeight / E.step;
				from = (GL.forestmanSize / E.step) * 3;
				left = Core.getRandomArbitary(from, randLeft - from);
				top = Core.getRandomArbitary(from, randTop - from);
				left = left * E.step;
				top = top * E.step;
				this.makeUnit(i, left, top);
			}
		},
		makeUnit: function (id, left, top) {
			var directions = ['up', 'right', 'down', 'left'];
			var unit = document.createElement('div');

			unit.className = 'enemy ' + eType;
			unit.id = 'enemy-' + eType + id;
			unit.setAttribute('direction', directions[1]);
			unit.setAttribute('type', eType);
			unit.style.left = left + 'px';
			unit.style.top = top + 'px';
			unit.style.width = GL.forestmanSize + 'px';
			unit.style.height = GL.forestmanSize + 'px';

			$el.ground.appendChild(unit);
		},
		moveUnits: function () {
			var units = document.getElementsByClassName(eType);
			for (var i = 0; i < E.count; i++) {
				this.moveUnit(units[i]);
			}
		},
		moveUnit: function (unit) {
			var direction = unit.getAttribute('direction');
			var top = unit.offsetTop;
			var left = unit.offsetLeft;

			switch (direction) {
				case 'up':
					top = top - GL.forestmanSize;
					break;
				case 'right':
					left = left + GL.forestmanSize;
					break;
				case 'down':
					top = top + GL.forestmanSize;
					break;
				case 'left':
					left = left - GL.forestmanSize;
					break;
			}
			if (GL.tmpPolyPoints[left] && GL.tmpPolyPoints[left][top]) {
				Core.dead();
			}
			if (!Core.pointIsFilled(left, top)) {
				unit.style.top = top + 'px';
				unit.style.left = left + 'px';
			} else {
				this.changeDirection(left, top, direction, unit);
			}
		},
		changeDirection: function (left, top, direction, unit) {
			var newDiriction = direction;

			switch (direction) {
				case 'up':
					newDiriction = 'down';
					break;
				case 'right':
					newDiriction = 'left';
					break;
				case 'down':
					newDiriction = 'up';
					break;
				case 'left':
					newDiriction = 'right';
					break;
			}
			unit.setAttribute('direction', newDiriction);
		}
	};
});