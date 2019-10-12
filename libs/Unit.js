const GameObject = require( './GameObject.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Unit extends GameObject{

	constructor(){

		super( SharedSettings.UNIT_WIDTH, SharedSettings.UNIT_HEIGHT, 0, 0, 0);

		// this.objMovement = {};
		this.fSpeed = GameSettings.UNIT_SPEED;
		this.fRotationSpeed = GameSettings.UNIT_ROTATION_SPEED;

		this.fX = Math.random() * (SharedSettings.FIELD_WIDTH - SharedSettings.UNIT_WIDTH);
		this.fY = Math.random() * (SharedSettings.FIELD_HEIGHT - SharedSettings.UNIT_HEIGHT);	
	}

	update(fDeltaTime){
		const fDistance = this.fSpeed * fDeltaTime;
		this.fX += fDistance * Math.cos( this.fAngle );
		this.fY += fDistance * Math.sin( this.fAngle );

		if( Math.random() < 0.3){
			this.fAngle = 2*Math.PI*Math.random();
		}
	}

}