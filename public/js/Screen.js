class Screen{

	constructor(socket, canvas){
		this.socket = socket;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.assets = new Assets();
		this.iProcessingTimeNanoSec = 0;
		this.aUnit = null;

		// キャンバスの初期化
		this.canvas.width = SharedSettings.FIELD_WIDTH;
		this.canvas.height = SharedSettings.FIELD_HEIGHT;

		// ソケットの初期化
		this.initSocket();

		// コンテキストの初期化
		// アンチウェイリアスの抑止
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
   	}

   	initSocket(){

   		this.socket.on('connect', ()=>{
   			console.log('connect : socket.id = %s', socket.id);
   			this.socket.emit('enter-the-game');
   		});

   		this.socket.on('update', (aUnit, iProcessingTimeNanoSec)=>{
   			this.aUnit = aUnit;
   			this.iProcessingTimeNanoSec = iProcessingTimeNanoSec;
   		});
   	}

   	animate(iTimeCurrent){
   		requestAnimationFrame((iTimeCurrent)=>{
   			this.animate(iTimeCurrent);
   		});
   		this.render(iTimeCurrent);
   	}

   	render(iTimeCurrent){
   		// キャンバスのクリア
   		this.context.clearRect(0, 0, canvas.width, canvas.height);

   		// キャンバスの塗りつぶし
   		this.renderField();


   		// unitの描画
   		if( null !== this.aUnit ){
   			const fTimeCurrentSec = iTimeCurrent * 0.001;
   			const iIndexFrame = 0;
   			this.aUnit.forEach((unit)=>{
   				this.renderUnit( unit, iIndexFrame );
   			});
   		}

   		// キャンバスの枠の描画
   		this.context.save();
   		this.context.strokeStyle = RenderingSettings.FIELD_LINECOLOR;
   		this.context.lineWidth = RenderingSettings.FIELD_LINEWIDTH;
   		this.context.strokeRect(0, 0, canvas.width, canvas.height);
   		// this.context.strokeRect(0, 0, 100, 100);
   		this.context.restore();

   		// サーバ処理時間表示
   		this.context.save();
   		this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
   		this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR;
   		this.context.fillText((this.iProcessingTimeNanoSec * 1e-9).toFixed(9) + ' [s]',
   			this.canvas.width - 30 * 10, 40);
   		this.context.restore();

   	}

   	renderField(){
   		this.context.save();

   		this.context.restore();
   	}

   	renderUnit( unit, iIndexFrame ){
   		this.context.save();

   		this.context.translate( unit.fX, unit.fY );

   		this.context.save();
   		this.context.rotate( unit.fAngle );
   		this.context.drawImage( this.assets.imageUnits,
   			this.assets.arectUnitInUnitsImage[iIndexFrame].sx, this.assets.arectUnitInUnitsImage[iIndexFrame].sy, // 描画元画像の右上座標
   			this.assets.arectUnitInUnitsImage[iIndexFrame].sw, this.assets.arectUnitInUnitsImage[iIndexFrame].sh, // 描画元画像の大きさ
   			-SharedSettings.UNIT_WIDTH * 0.5,
   			-SharedSettings.UNIT_HEIGHT * 0.5,
   			SharedSettings.UNIT_WIDTH,
   			SharedSettings.UNIT_HEIGHT
   		 );
   		this.context.restore();

   		this.context.restore();
   	}
}