// modules
const World = require('./World.js');

// settings
const GameSettings = require('./GameSettings.js');

// ゲームクラス
module.exports = class Game{
	// 始動
	start(io){
		// const world = new World(io);
		const hWorld = {};
		let iTimeLast = Date.now();

		// 接続時の処理
		io.on('connection', (socket)=>{
			console.log('connection : socket.id = %s', socket.id);

			let joinedRoomName = null;

			let aRoomName = Object.keys(hWorld).reduce((aRoomName, roomName)=>{
				if(hWorld[roomName].state === 'waiting'){
					aRoomName.push(roomName);
				}
				return aRoomName;
			}, new Array());

			socket.emit('update-room-screen', aRoomName);
			// let unit = null; // コネクションごとのunit object

			// ゲーム開始時の処理
			// socket.on('enter-the-game', ()=>{
			// 	let zone = world.aZone[0];
			// 	unit = world.createUnit(zone, socket.id);
			// });

			// クライアントの入力処理
			socket.on( 'move-units-interzonely', (fromZoneId, toZoneId)=>{
				console.log('move-units-interzonely', fromZoneId, toZoneId);
				console.log(Object.keys(socket.rooms));
				let roomName = Object.keys(socket.rooms)[1];
				let world = hWorld[roomName];
				world.moveUnitsInterzonely(socket.id, fromZoneId, toZoneId);
			});

			socket.on( 'update-arrow', (fromZoneId, toZoneId)=>{
				socket.emit('update-arrow', fromZoneId, toZoneId);
			});

			socket.on('show-arrow', ()=>{socket.emit('show-arrow');});
			socket.on('hide-arrow', ()=>{socket.emit('hide-arrow');});

			socket.on('create-room', (roomName)=>{
				if(hWorld[roomName] === void 0){
					hWorld[roomName] = new World(io);
					let aRoomName = Object.keys(hWorld).reduce((aRoomName, roomName)=>{
						if(hWorld[roomName].state === 'waiting'){
							aRoomName.push(roomName);
						}
						return aRoomName;
					}, new Array());
					io.emit('update-room-screen', aRoomName);

				}else{
					// すでに使われているroomName
					console.log('already exists')
				}
			});

			socket.on('enter-room', (roomName)=>{
				console.log('enter room ', roomName);
				let world = hWorld[roomName];
				if(world !== void 0){
					socket.join(roomName);
					joinedRoomName = roomName;
					// console.log(world.numberOfPlayer);
					let unit = world.createUnit(world.aZone[0], socket.id);
					world.numberOfPlayer += 1;

					if(world.numberOfPlayer === 2){
						world.state = 'playing';
						world.iTimeLast = Date.now();
						console.log('playing');
					}


				let aRoomName = Object.keys(hWorld).reduce((aRoomName, roomName)=>{
					if(hWorld[roomName].state === 'waiting'){
						aRoomName.push(roomName);
					}
					return aRoomName;
				}, new Array());

					io.emit('update-room-screen', aRoomName);
				}
			});

			// 切断時の処理
			socket.on('disconnect', ()=>{
				console.log('disconnect : socket.id = %s', socket.id);
				// let roomName = socket.rooms[1];
				console.log(joinedRoomName);
				if(joinedRoomName !== null){
					delete hWorld[joinedRoomName];
					console.log('delete', joinedRoomName);
					socket.to(joinedRoomName).emit('return-start-screen');
				}
				// if(!unit){ return; }
				// world.destroyUnit( unit );
				// unit = null;
			});
		});

		// 周期的処理
		setInterval(()=>{
			for(var roomName in hWorld){
				// console.log(roomName);
				var world = hWorld[roomName];

			
				// このworldでゲームが始まっていなければでる。
				if( world.state !== 'playing' ){
					continue; 
				}
				// console.log('on');

				// 経過時間の算出
				const iTimeCurrent = Date.now(); // ms
				const fDeltaTime = ( iTimeCurrent - world.iTimeLast ) * 0.001; // s
				world.iTimeLast = iTimeCurrent;

				// 処理時間計測用
				const hrtime = process.hrtime(); // ns

				// ゲームワールドの更新
				world.update(fDeltaTime);

				const hrtimeDiff = process.hrtime(hrtime);
				const iNanosecDiff = hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

				// 最新状況をクライアントに送信
				io.to(roomName).emit( 'update', Array.from( world.setUnit ), Array.from( world.aZone ), iNanosecDiff);
			}
		}, 1000/GameSettings.FRAMERATE); // ms

	}
}