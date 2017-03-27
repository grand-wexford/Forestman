/* global GL, $el */

define(["core"], function (Core) {
	var eType = 'big-bird';
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
			var directions = ['upleft', 'upright', 'downright', 'downleft'];
			var unit = document.createElement('div');

			unit.className = 'enemy ' + eType;
			unit.setAttribute('direction', directions[1]);
			unit.id = 'enemy-' + eType + id;
			unit.setAttribute('type', eType);
			unit.style.left = left + 'px';
			unit.style.top = top + 'px';
			unit.style.width = E.size + 'px';
			unit.style.height = E.size + 'px';

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
				case 'upleft':
					top = top - E.step;
					left = left - E.step;
					topToCheck = top;
					leftToCheck = left;
					break;
				case 'upright':
					top = top - E.step;
					left = left + E.step;
					topToCheck = top;
					leftToCheck = left + E.size - E.step;
					break;
				case 'downright':
					top = top + E.step;
					left = left + E.step;
					topToCheck = top + E.size - E.step;
					leftToCheck = left + E.size - E.step;
					break;
				case 'downleft':
					top = top + E.step;
					left = left - E.step;
					topToCheck = top + E.size - E.step;
					leftToCheck = left;
					break;
			}

			if (GL.tmpPolyPoints[left] && GL.tmpPolyPoints[left][top]) {
				Core.dead();
			}
			

			if (!Core.pointIsFilled(leftToCheck, topToCheck)) {
				unit.style.top = top + 'px';
				unit.style.left = left + 'px';
			} else {
				this.changeDirection(leftToCheck, topToCheck, direction, unit);
			}
		},

		changeDirection: function (left, top, direction, unit) {
			var newDiriction = direction;

			switch (direction) {
				case 'upleft':
					if (!Core.pointIsFilled(left, top + GL.forestmanSize)) {
						newDiriction = 'downleft';
					} else {
						newDiriction = 'upright';
					}
					break;
				case 'upright':
					if (!Core.pointIsFilled(left, top + GL.forestmanSize)) {
						newDiriction = 'downright';
					} else {
						newDiriction = 'upleft';
					}

					break;
				case 'downright':
					if (!Core.pointIsFilled(left, top - GL.forestmanSize)) {
						newDiriction = 'upright';
					} else {
						newDiriction = 'downleft';
					}
					break;
				case 'downleft':
					if (!Core.pointIsFilled(left, top - GL.forestmanSize)) {
						newDiriction = 'upleft';
					} else {
						newDiriction = 'downright';
					}
					break;
			}
			unit.setAttribute('direction', newDiriction);
		}
	};
});