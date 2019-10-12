// modules
const Unit = require('./Unit.js');

// ワールドクラス

module.exports = class World {

	// コンストラクタ
	constructor(io){
		this.io = io; // socketIO
		this.setUnit = new Set(); // unit list
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

	createUnit(){
		const unit = new Unit();
		this.setUnit.add( unit );
		return unit;
	}

	destroyUnit( unit ){
		this.setUnit.delete( unit );
	}
}