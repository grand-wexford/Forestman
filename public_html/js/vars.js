var $el = {
	forestman: document.getElementById('forestman'),
	ground: document.getElementById('ground'),
	myCanvas: document.getElementById('myCanvas'),
	consoleHolder: document.getElementById('console'),
	FPSHolder: document.getElementById('fps'),
	livesHolder: document.getElementById('lives'),
};
var GL = {
	action: 'stop',
	groundWidth: 400,
	groundHeight: 300,
	forestmanSize: 10,
	step: 10, // должно быть <= forestmanSize
	timeout: 40,
	lives: 3,

	enemies: {
		bird: {
			size: 10,
			count: 1,
			timeout: 100,
			step: 10,
		},
		rabbit: {
			size: 10,
			count: 1,
			timeout: 100,
			step: 10,
		},
		'big-bird': {
			size: 40,
			count: 1,
			timeout: 160,
			step: 10,
		}
	},
	blocks: 0,
	startingPoint: 0, // устанавливается в app.setForestman
	resetLeft: 0,
	resetTop: 0,
	forestColor: '#77c4d3',
	tmpForestColor: '#000000',
	groundColor: '#daede2',
	ctx: $el.myCanvas.getContext("2d"),
	needStopCheck: false,
	tmpPolyPoints: {},
	oposite: [['left', 'right'], ['down', 'up']],
	lastLeft: 0,
	lastTop: 0,
	resultRun: false, // был ли ход холостым, т.е. без попытки захватить территорию
	field: {},
	tmpField: {},
	enemyArea: {},
	enemyFreeBlocks: {},
	timerId: {}
};
