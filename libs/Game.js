// modules
const World = require('./World.js');

// settings
const GameSettings = require('./GameSettings.js');

// ゲームクラス
module.exports = class Game{
	// 始動
	start(io){
		const world = new World(io);
		let iTimeLast = Date.now();

		// 接続時の処理
		io.on('connection', (socket)=>{
			console.log('connection : socket.id = %s', socket.id);
			let unit = null; // コネクションごとのunit object

			// ゲーム開始時の処理
			socket.on('enter-the-game', ()=>{
				let zone = world.aZone[0];
				unit = world.createUnit(zone);
			});

			// 切断時の処理
			socket.on('disconnect', ()=>{
				console.log('disconnect : socket.id = %s', socket.id);
				if(!unit){ return; }
				world.destroyUnit( unit );
				unit = null;
			});
		});

		// 周期的処理
		setInterval(()=>{
			// 経過時間の算出
			const iTimeCurrent = Date.now(); // ms
			const fDeltaTime = ( iTimeCurrent - iTimeLast ) * 0.001; // s
			iTimeLast = iTimeCurrent;

			// 処理時間計測用
			const hrtime = process.hrtime(); // ns

			// ゲームワールドの更新
			world.update(fDeltaTime);

			const hrtimeDiff = process.hrtime(hrtime);
			const iNanosecDiff = hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

			// 最新状況をクライアントに送信
			io.emit( 'update', Array.from( world.setUnit ), Array.from( world.aZone ), iNanosecDiff);
		}, 1000/GameSettings.FRAMERATE); // ms

	}
}