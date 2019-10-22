const GameObject = require( './GameObject.js');

const SharedSettings = require('../public/js/SharedSettings.js');
const GameSettings = require('./GameSettings.js');

module.exports = class Unit extends GameObject{

	constructor(zone, socket_id){

		super( SharedSettings.UNIT_WIDTH, SharedSettings.UNIT_HEIGHT, 0, 0, 0);
		this.belongingZone = null;
		this.updateZone(zone);
		this.toZone = zone;

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


	}

	updateZone(zone){
		if( this.belongingZone !== null ){
			// zX, zYを更新
			this.zX = this.fX - zone.fX;
			this.zY = this.fY - zone.fY;

			this.belongingZone.setUnit.delete(this);
		}
		this.belongingZone = zone;
		zone.setUnit.add(this);
		console.log('unit has been added to zone', zone.id);
	}

	update(fDeltaTime){
		// console.log(this.socket_id);
		const fDistance = this.fSpeed * fDeltaTime;
		// this.zX += fDistance * Math.cos( this.fAngle );
		// this.zY += fDistance * Math.sin( this.fAngle );



		if(this.belongingZone !== this.toZone){
			// console.log('moveInterZone');
			this.moveInterZone(fDistance);
		}else{
			this.moveInsideZone(fDistance);
			// console.log('moveInsideZone');
		}

	}

	moveInsideZone(fDistance){
		// HACK: もっと簡潔にできる。
		if(this.zX + fDistance*Math.cos(this.fAngle) - SharedSettings.UNIT_WIDTH * 0.5 < -SharedSettings.ZONE_WIDTH * 0.5){
			let toWall = -this.zX + SharedSettings.UNIT_WIDTH*0.5 - SharedSettings.ZONE_WIDTH*0.5;
			this.zX += (toWall - fDistance*Math.cos(this.fAngle));
			this.fAngle = (-(this.fAngle + Math.PI))%(2*Math.PI);
			console.log('x-');
		}else if(this.zX + fDistance*Math.cos(this.fAngle) + SharedSettings.UNIT_WIDTH * 0.5 > SharedSettings.ZONE_WIDTH * 0.5){
			let toWall = -this.zX - SharedSettings.UNIT_WIDTH*0.5 + SharedSettings.ZONE_WIDTH*0.5;
			this.zX += (toWall - fDistance*Math.cos(this.fAngle));
			this.fAngle = (-(this.fAngle + Math.PI))%(2*Math.PI);
			console.log('x+');
		}else{
			this.zX += fDistance * Math.cos( this.fAngle );
		}

		if(this.zY + fDistance*Math.sin(this.fAngle) - SharedSettings.UNIT_HEIGHT * 0.5 < -SharedSettings.ZONE_HEIGHT * 0.5){
			let toWall = -this.zY + SharedSettings.UNIT_HEIGHT*0.5 - SharedSettings.ZONE_HEIGHT*0.5;
			this.zY += (toWall - fDistance*Math.sin(this.fAngle));
			this.fAngle *= -1;
			console.log('y-');
		}else if(this.zY + fDistance*Math.sin(this.fAngle) + SharedSettings.UNIT_HEIGHT * 0.5 > SharedSettings.ZONE_HEIGHT * 0.5){
			let toWall = -this.zY - SharedSettings.UNIT_HEIGHT*0.5 + SharedSettings.ZONE_HEIGHT*0.5;
			this.zY += (toWall - fDistance*Math.sin(this.fAngle));
			this.fAngle *= -1;
			console.log('y+');
		}else{
			this.zY += fDistance * Math.sin( this.fAngle );
		}


		this.fX = this.belongingZone.fX + this.zX;
		this.fY = this.belongingZone.fY + this.zY;

	}

	moveInterZone(fDistance){
		this.fX += fDistance * Math.cos( this.fAngle );
		this.fY += fDistance * Math.sin( this.fAngle );

	}

	startMoveInterZone(toZone){
		this.toZone = toZone;
		console.log(toZone.fY, this.fY);
		console.log(toZone.fX, this.fX);
		console.log(Math.atan2(toZone.fY - this.fY, toZone.fX - this.fX));
		this.fAngle = Math.atan2(toZone.fY - this.fY, toZone.fX - this.fX);
	}

	toJSON(){
		return {
			fX: this.fX,
			fY: this.fY,
			fAngle: this.fAngle,
			socket_id: this.socket_id
		};
	}

}