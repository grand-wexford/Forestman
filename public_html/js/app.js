/* global $el, GL */

define(["core"], function (Core) {
	return {
		setForestman: function () {
			GL.startingPoint = Math.floor((GL.groundWidth / 2) / GL.forestmanSize) * GL.forestmanSize;
			$el.forestman.style.width = GL.forestmanSize + 'px';
			$el.forestman.style.height = GL.forestmanSize + 'px';
			$el.forestman.style.top = "0px";
			$el.forestman.style.left = GL.startingPoint + "px";
		},
		setField: function () {
			$el.ground.style.width = GL.groundWidth + 'px';
			$el.ground.style.height = GL.groundHeight + 'px';

			for (var left = 0; left < GL.groundWidth; left = left + GL.forestmanSize) {
				for (var top = 0; top < GL.groundHeight; top = top + GL.forestmanSize) {
					if (!GL.field[left]) {
						GL.field[left] = {};
					}
					GL.field[left][top] = 1;
				}
			}

			this.drawStarterForest();
			$el.livesHolder.innerHTML = 'Lives: ' + GL.lives + '<BR>';
		},
		checkKey: function (e) {
			e = e || window.event;
			var actionTemp = '';

			if (e.keyCode === 38) {
				actionTemp = 'up';
			} else if (e.keyCode === 40) {
				actionTemp = 'down';
			} else if (e.keyCode === 37) {
				actionTemp = 'left';
			} else if (e.keyCode === 39) {
				actionTemp = 'right';
			} else {
//				console.log('Нажата другая кнопка');
			}

			if (
					(GL.action === 'up' && actionTemp === 'down') ||
					(GL.action === 'down' && actionTemp === 'up') ||
					(GL.action === 'left' && actionTemp === 'right') ||
					(GL.action === 'right' && actionTemp === 'left')
					) {
				if (GL.tmpPolyPoints[GL.lastLeft] && GL.tmpPolyPoints[GL.lastLeft][GL.lastTop]) {
					Core.dead();
				} else {
					GL.action = actionTemp;
				}
			} else {
				GL.action = actionTemp;
			}
		},
		stopMove: function () {
			GL.action = 'stop';

			if (GL.resultRun === false) {
				return false
			}
			var left;
			var top;
			var enemies = document.getElementsByClassName('enemy');
			GL.enemiesCount = enemies.length;
			var criticalEnemyArea;
			GL.tmpField = Core.clone(GL.field);
			GL.enemyArea = {};

			for (var i = 0; i < GL.enemiesCount; i++) {
				left = enemies[i].offsetLeft;
				top = enemies[i].offsetTop;
				enemyId = enemies[i].id;
				GL.enemyFreeBlocks[enemyId] = 0;
				type = enemies[i].getAttribute('type');
				criticalEnemyArea = GL.enemies[type]['size'] * 3;
				
				this.placeAroundEnemy(enemyId, left, top);

				if (GL.enemyFreeBlocks[enemyId] < criticalEnemyArea && GL.enemyFreeBlocks[enemyId] !== 0) {
					this.killEnemy(enemyId);
					this.stopMove();
					return false;
				}
			}

			for (var left2 = 0; left2 < GL.groundWidth; left2 = left2 + GL.forestmanSize) {
				for (var top2 = 0; top2 < GL.groundHeight; top2 = top2 + GL.forestmanSize) {
					if (!GL.enemyArea[left2] || !GL.enemyArea[left2][top2]) {
						this.drawLine(left2, top2);
					}
				}
			}

			GL.resultRun = false;
			GL.tmpPolyPoints = {};
		},
		killEnemy: function (enemyId) {
			var enemyDom = document.getElementById(enemyId);
			var type = enemyDom.getAttribute('type');
			enemyDom.parentNode.removeChild(enemyDom);
			GL.enemiesCount--;
			GL.enemies[type]['count']--;
			
			if ( GL.enemiesCount <= 0 ) {
				Core.gameOver( 'win' );
			}
		},
		placeAroundEnemy: function (enemyId, left, top) {
			var enemyDom = document.getElementById(enemyId);
			var type = enemyDom.getAttribute('type');
			var enemySize = GL.enemies[type]['size'];
			var araundPoint = [
				[left, top],
				[left, top + enemySize],
				[left, top - enemySize],
				[left + enemySize, top],
				[left - enemySize, top],
				[left - enemySize, top - enemySize],
				[left - enemySize, top + enemySize],
				[left + enemySize, top + enemySize],
				[left + enemySize, top - enemySize]
			];
			//GL.tmpField = {};

			for (var i = 0; i < araundPoint.length; i++) {
				if (GL.tmpField[araundPoint[i][0]] && GL.tmpField[araundPoint[i][0]][araundPoint[i][1]]) {
					delete GL.tmpField[araundPoint[i][0]][araundPoint[i][1]];

					if (!GL.enemyArea[araundPoint[i][0]]) {
						GL.enemyArea[araundPoint[i][0]] = {};
					}
					GL.enemyArea[araundPoint[i][0]][araundPoint[i][1]] = 1;
					this.countEnemySpace(enemyId, araundPoint[i][0], araundPoint[i][1]);
					this.placeAroundEnemy(enemyId, araundPoint[i][0], araundPoint[i][1]);
				}
			}
		},
		setPoint: function (left, top) {
			if (GL.field[left] && GL.field[left][top]) {
				delete GL.field[left][top];
			}
		},
		delPoint: function (left, top) {
			if (!GL.field[left]) {
				GL.field[left] = {};
			}
			GL.field[left][top] = 1;
		},
		drawStarterForest: function () {
			GL.ctx.fillStyle = GL.forestColor;
			GL.ctx.fillRect(0, 0, GL.groundWidth, GL.groundHeight);
			GL.ctx.clearRect(GL.forestmanSize, GL.forestmanSize, GL.groundWidth - (GL.forestmanSize * 2), GL.groundHeight - (GL.forestmanSize * 2));

			for (var i = 0; i <= GL.groundWidth; i = i + GL.forestmanSize) {
				this.setPoint(i, 0);
				this.setPoint(i, GL.groundHeight - GL.forestmanSize);
			}
			for (var i = 0; i <= GL.groundHeight; i = i + GL.forestmanSize) {
				this.setPoint(0, i);
				this.setPoint(GL.groundWidth - GL.forestmanSize, i);
			}
		},
		drawLine: function (left, top) {
			if (!Core.pointIsFilled(left, top)) {
				GL.ctx.fillStyle = GL.forestColor;
				GL.ctx.fillRect(left, top, GL.forestmanSize, GL.forestmanSize);
				this.setPoint(left, top);
			} else {

			}
		},
		drawLine2: function (left, top) {
			if (!Core.pointIsFilled(left, top)) {
				GL.ctx.fillStyle = GL.tmpForestColor;
				GL.ctx.fillRect(left, top, GL.forestmanSize, GL.forestmanSize);
				this.setPoint(left, top);
			} else {

			}
		},
		countEnemySpace: function (enemyId, left, top) {
			GL.enemyFreeBlocks[enemyId]++;
		},
		lastLoop: new Date,
		start: function () {
			if (GL.action !== 'stop') {
				var top = parseInt(document.defaultView.getComputedStyle($el.forestman, null).getPropertyValue("top"), 10);
				var left = parseInt(document.defaultView.getComputedStyle($el.forestman, null).getPropertyValue("left"), 10);
				var hTop;
				var hLeft;

				GL.lastLeft = left;
				GL.lastTop = top;

				switch (GL.action) {
					case 'up':
						if (top > 0) {
							top -= GL.step;
						} else {
							this.stopMove(left, top);
						}
						break;

					case 'right':
						if (left < GL.groundWidth - GL.forestmanSize) {
							left += GL.step;
						} else {
							this.stopMove(left, top);
						}
						break;

					case 'down':
						if (top < GL.groundHeight - GL.forestmanSize) {
							top += GL.step;
						} else {
							this.stopMove(left, top);
						}
						break;

					case 'left':
						if (left > 0) {
							left -= GL.step;
						} else {
							this.stopMove(left, top);
						}
						break;
				}

				hTop = top;
				hLeft = left;
				hTop = hTop < 0 ? 0 : hTop;
				hLeft = hLeft < 0 ? 0 : hLeft;

				$el.forestman.style.top = hTop + "px";
				$el.forestman.style.left = hLeft + "px";

				if (!Core.pointIsFilled(left, top)) {
					if (GL.tmpPolyPoints[GL.lastLeft] && GL.tmpPolyPoints[GL.lastLeft][GL.lastTop]) {

					} else {
						GL.resetLeft = GL.lastLeft;
						GL.resetTop = GL.lastTop;
					}

					if (!GL.tmpPolyPoints[left]) {
						GL.tmpPolyPoints[left] = {};
					}
					GL.tmpPolyPoints[left][top] = 1;
					GL.resultRun = true;
					this.drawLine(left, top);
				} else {
					if (GL.tmpPolyPoints[GL.lastLeft] && GL.tmpPolyPoints[GL.lastLeft][GL.lastTop]) {
						this.stopMove(left, top);
					}
				}

				/////

				$el.consoleHolder.innerHTML =
						'left: ' + left + '<BR>' +
						'top: ' + top + '<BR>' +
						'action: ' + GL.action + '<BR>' +
						'resultRun: ' + GL.resultRun + '<BR>'
						//'Core.pointIsFilled: ' + Core.pointIsFilled(left, top) + '<BR>'
						;

				/////
			} else {

				//console.log(tmpPolyPoints);
			}

			var thisLoop = new Date;
			var fps = 1000 / (thisLoop - this.lastLoop);
			this.lastLoop = thisLoop;
			$el.FPSHolder.innerHTML = 'FPS: ' + parseInt(fps, 10) + '<BR>';

		}
	};
});


