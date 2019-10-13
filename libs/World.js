// modules
const Unit = require('./Unit.js');
const Zone = require('./Zone.js');
const SharedSettings = require('../public/js/SharedSettings.js');


// ワールドクラス

module.exports = class World {

	// コンストラクタ
	constructor(io){
		this.io = io; // socketIO
		this.setUnit = new Set(); // unit list
		this.aZone = new Array(); // zone list
		this.initZone();
	}

	initZone(){
		for(let row = 0; row < SharedSettings.ZONE_ROW_NUM; row++){
			for(let col = 0; col < SharedSettings.ZONE_COL_NUM; col++){
				const zone = new Zone(row, col);
				this.aZone.push( zone );
				console.log(row, col, zone.id, zone.fX, zone.fY);
			}
		}
	}

	// 更新処理
	update(fDeltaTime){
		// オブジェクトの座標値の更新
		this.updateObjects( fDeltaTime );

		// 衝突チェック
		this.checkCollisions();

		// 新たな行動
		this.doNewActions(fDeltaTime);
	}

	updateObjects(fDeltaTime){
		// Unitごとの処理
		this.setUnit.forEach((unit)=>{
			this.updateUnitsBelongingZone(unit);
			unit.update( fDeltaTime );
		});
	}

	checkCollisions(){

	}

	doNewActions(fDeltaTime){

	}

	createUnit(zone, socket_id){
		const unit = new Unit(zone, socket_id);
		this.setUnit.add( unit );
		return unit;
	}

	destroyUnit( unit ){
		this.setUnit.delete( unit );
	}

	updateUnitsBelongingZone(unit){
		if(SharedSettings.COORD_TO_ZONE_ID(unit.fX, unit.fY) !== -1 && SharedSettings.COORD_TO_ZONE_ID(unit.fX, unit.fY) !== unit.belongingZone.id){
			unit.updateZone(this.aZone[SharedSettings.COORD_TO_ZONE_ID(unit.fX, unit.fY)]);
		}
	}

	moveUnitsInterzonely(socket_id, fromZoneId, toZoneId){
		console.log('moveUnitsInterzonely');
		this.aZone[fromZoneId].setUnit.forEach((unit)=>{
			console.log(unit.belongingZone.id, unit.toZone.id);
			console.log(unit.socket_id, socket_id);
			if(unit.belongingZone === unit.toZone && unit.socket_id === socket_id){
				unit.startMoveInterZone(this.aZone[toZoneId]);
			}
		});
	}
}