const GameObject = require( './GameObject.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Unit extends GameObject{

	constructor(zone, socket_id){

		super( SharedSettings.UNIT_WIDTH, SharedSettings.UNIT_HEIGHT, 0, 0, 0);
		this.belongingZone = zone;	


		// this.objMovement = {};
		this.fSpeed = GameSettings.UNIT_SPEED;
		this.fRotationSpeed = GameSettings.UNIT_ROTATION_SPEED;

		// zone内での相対的な座標。 zoneの中心を(0, 0) とする。
		this.zX = (Math.random() - 0.5) * (SharedSettings.ZONE_WIDTH - SharedSettings.UNIT_WIDTH);
		this.zY = (Math.random() - 0.5) * (SharedSettings.ZONE_HEIGHT - SharedSettings.UNIT_HEIGHT);
		this.fAngle = Math.random()*2*Math.PI;

		this.fX = this.belongingZone.fX + this.zX;
		this.fY = this.belongingZone.fY + this.zY;

		this.socket_id = socket_id;

		this.interZone = false;

	}

	update(fDeltaTime){
		const fDistance = this.fSpeed * fDeltaTime;
		// this.zX += fDistance * Math.cos( this.fAngle );
		// this.zY += fDistance * Math.sin( this.fAngle );


		if(this.interZone){
			this.moveInterZone(fDistance);
		}else{
			this.moveInsideZone(fDistance);
		}

	}

	moveInsideZone(fDistance){
		// HACK: もっと簡潔にできる。
		if(this.zX + fDistance*Math.cos(this.fAngle) - SharedSettings.UNIT_WIDTH * 0.5 < -SharedSettings.ZONE_WIDTH * 0.5){
			let toWall = -this.zX + SharedSettings.UNIT_WIDTH*0.5 - SharedSettings.ZONE_WIDTH*0.5;
			this.zX += (toWall - fDistance*Math.cos(this.fAngle));
			this.fAngle = (-(this.fAngle + Math.PI))%(2*Math.PI);
		}else if(this.zX + fDistance*Math.cos(this.fAngle) + SharedSettings.UNIT_WIDTH * 0.5 > SharedSettings.ZONE_WIDTH * 0.5){
			let toWall = -this.zX - SharedSettings.UNIT_WIDTH*0.5 + SharedSettings.ZONE_WIDTH*0.5;
			this.zX += (toWall - fDistance*Math.cos(this.fAngle));
			this.fAngle = (-(this.fAngle + Math.PI))%(2*Math.PI);
		}else{
			this.zX += fDistance * Math.cos( this.fAngle );
		}

		if(this.zY + fDistance*Math.sin(this.fAngle) - SharedSettings.UNIT_HEIGHT * 0.5 < -SharedSettings.ZONE_HEIGHT * 0.5){
			let toWall = -this.zY + SharedSettings.UNIT_HEIGHT*0.5 - SharedSettings.ZONE_HEIGHT*0.5;
			this.zY += (toWall - fDistance*Math.sin(this.fAngle));
			this.fAngle *= -1;
		}else if(this.zY + fDistance*Math.sin(this.fAngle) + SharedSettings.UNIT_HEIGHT * 0.5 > SharedSettings.ZONE_HEIGHT * 0.5){
			let toWall = -this.zY - SharedSettings.UNIT_HEIGHT*0.5 + SharedSettings.ZONE_HEIGHT*0.5;
			this.zY += (toWall - fDistance*Math.sin(this.fAngle));
			this.fAngle *= -1;
		}else{
			this.zY += fDistance * Math.sin( this.fAngle );
		}


		this.fX = this.belongingZone.fX + this.zX;
		this.fY = this.belongingZone.fY + this.zY;

	}

	moveInterZone(fDistance){
		
	}

}