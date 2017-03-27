/* global GL, $el */

define([""], function () {
	return {
		clone: function (o) {
			if (!o || "object" !== typeof o) {
				return o;
			}
			var c = "function" === typeof o.pop ? [] : {};
			var p, v;
			for (p in o) {
				if (o.hasOwnProperty(p)) {
					v = o[p];
					if (v && "object" === typeof v) {
						c[p] = this.clone(v);
					} else
						c[p] = v;
				}
			}
			return c;
		},
		getRandomArbitary: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		gameOver: function (state) {
			if (state === 'lose') {
				console.log('Game Over');
			} else if (state === 'win') {
				console.log('You Win');
			}
		},
		dead: function () {
			console.log('dead');
			this.clearTmpPoints();
			GL.lives = GL.lives - 1;
			if (GL.lives === 0) {
				this.gameOver('lose');
			} else {
				$el.livesHolder.innerHTML = 'Lives: ' + GL.lives + '<BR>';
			}
		},
		clearTmpPoints: function () {
			for (var left in GL.tmpPolyPoints) {
				for (var top in GL.tmpPolyPoints[left]) {
					GL.ctx.fillStyle = GL.groundColor;
					GL.ctx.fillRect(left, top, GL.forestmanSize, GL.forestmanSize);
					if (!GL.field[left]) {
						GL.field[left] = {};
					}
					GL.field[left][top] = 1;
				}
			}

			$el.forestman.style.top = GL.resetTop + "px";
			$el.forestman.style.left = GL.resetLeft + "px";
			GL.action = 'stop';
			GL.tmpPolyPoints = {};
		},
		rgbToHex: function (r, g, b) {
			if (r > 255 || g > 255 || b > 255) {
				throw "Invalid color component";
			}
			return ((r << 16) | (g << 8) | b).toString(16);
		},
		pointIsFilled: function (left, top, left2, top2) {
			left2 = left2 || left + GL.forestmanSize;
			top2 = top2 || top + GL.forestmanSize;
			var p1 = GL.ctx.getImageData(left, top, 1, 1).data;
			var p2 = GL.ctx.getImageData(left2-1, top2-1, 1, 1).data;

			var hex1 = "#" + ("000000" + this.rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
			var hex2 = "#" + ("000000" + this.rgbToHex(p2[0], p2[1], p2[2])).slice(-6);

			if (GL.forestColor === hex1 || GL.forestColor === hex2 ) {
				return true;
			} else {
				return false;
			}
		}
	};
});