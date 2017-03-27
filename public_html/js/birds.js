/* global GL, $el */

define(["core"], function (Core) {
	var eType = 'bird';
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
			unit.id = 'enemy-' + eType + id;
			unit.setAttribute('direction', directions[Core.getRandomArbitary(0, 3)]);
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
					break;
				case 'upright':
					top = top - E.step;
					left = left + E.step;
					break;
				case 'downright':
					top = top + E.step;
					left = left + E.step;
					break;
				case 'downleft':
					top = top + E.step;
					left = left - E.step;
					break;
			}
			if (GL.tmpPolyPoints[left] && GL.tmpPolyPoints[left][top]) {
				Core.dead();
			}
			if (!Core.pointIsFilled(left, top, left + E.size, top + E.size)) {
				unit.style.top = top + 'px';
				unit.style.left = left + 'px';
			} else {
				this.changeDirection(left, top, direction, unit);
			}
		},
		changeDirection: function (left, top, direction, unit) {
			var newDiriction = direction;

			switch (direction) {
				case 'upleft':
					if (!Core.pointIsFilled(left, top + E.step, left + E.size, top + E.step + E.size)) {
						newDiriction = 'downleft';
					} else {
						newDiriction = 'upright';
					}
					break;
				case 'upright':
					if (!Core.pointIsFilled(left, top + E.step, left + E.size, top + E.step + E.size)) {
						newDiriction = 'downright';
					} else {
						newDiriction = 'upleft';
					}

					break;
				case 'downright':
					if (!Core.pointIsFilled(left, top - E.step, left + E.size, top - E.step + E.size)) {
						newDiriction = 'upright';
					} else {
						newDiriction = 'downleft';
					}
					break;
				case 'downleft':
					if (!Core.pointIsFilled(left, top - E.step, left + E.size, top - E.step + E.size)) {
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