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
			unit.update( fDeltaTime );
		});
	}

	checkCollisions(){

	}

	doNewActions(fDeltaTime){

	}

	createUnit(zone){
		const unit = new Unit(zone);
		this.setUnit.add( unit );
		return unit;
	}

	destroyUnit( unit ){
		this.setUnit.delete( unit );
	}
}