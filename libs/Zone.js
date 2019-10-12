const GameObject = require( './GameObject.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Zone extends GameObject{



	constructor(row, col){

		super( SharedSettings.ZONE_WIDTH, SharedSettings.ZONE_HEIGHT, 0, 0, 0);
		this.row = row;
		this.col = col;
		this.owner = null;


		this.fX = (this.row + 0.5)*SharedSettings.ZONE_WIDTH;
		this.fY = (this.col + 0.5)*SharedSettings.ZONE_HEIGHT;
	}

}