/* global GL, $el */

define(["core", "birds", "bigBirds", "rabbits"], function (Core, Birds, BigBirds, Rabbits) {
	Birds.makeUnits();
	BigBirds.makeUnits();
	Rabbits.makeUnits();
	
	var timerIdBirds = setTimeout(function goBirds() {
		Birds.moveUnits();
		timerIdBirds = setTimeout(goBirds, GL.enemies.bird.timeout);
	}, GL.enemies.bird.timeout);
	
	var timerIdBigBirds = setTimeout(function goBigBirds() {
		BigBirds.moveUnits();
		timerIdBigBirds = setTimeout(goBigBirds, GL.enemies['big-bird'].timeout);
	}, GL.enemies['big-bird'].timeout);
	
	var timerIdRabbits = setTimeout(function goRabbits() {
		Rabbits.moveUnits();
		timerIdRabbits = setTimeout(goRabbits, GL.enemies.rabbit.timeout);
	}, GL.enemies.rabbit.timeout);

});