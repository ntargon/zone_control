class Screen{

	constructor(socket, canvas){
		this.socket = socket;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.assets = new Assets();
		this.iProcessingTimeNanoSec = 0;
		this.aUnit = null;
		this.aZone = null;

		// キャンバスの初期化
		this.canvas.width = SharedSettings.FIELD_WIDTH;
		this.canvas.height = SharedSettings.FIELD_HEIGHT;

		// ソケットの初期化
		this.initSocket();

    // mouseが押されてるか保持
    this.isClicked = false;

		// コンテキストの初期化
		// アンチウェイリアスの抑止
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;


        //
        this.canvas.addEventListener('touchstart', this.stopDefault, false);
        this.canvas.addEventListener('touchend', this.stopDefault, false);
        this.canvas.addEventListener('touchmove', this.stopDefault, false);

        // event listener
        this.canvas.addEventListener('mousedown', this.onDown, false);
        this.canvas.addEventListener('mouseup', this.onUp, false);
        this.canvas.addEventListener('touchstart', this.onTouchStart, false);
        this.canvas.addEventListener('touchend', this.onTouchEnd, false);
        this.canvas.addEventListener('mousemove', this.onMouseMove, false);
        this.canvas.addEventListener('touchmove', this.onTouchMove, false);



        this.fromZoneId = -1;
        this.toZoneId = -1;


   	}

    stopDefault(e){
      e.preventDefault();
    }

    onTouchStart(e){
      // console.log(e);
      // console.log(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      // canvas上での座標に変換
      socket.emit('show-arrow');
      this.isClicked = true;


      let rect = e.target.getBoundingClientRect();

      let factorX = canvas.width/Math.min(canvas.clientWidth, canvas.clientHeight);
      let factorY = canvas.height/Math.min(canvas.clientWidth, canvas.clientHeight);
      let cX = Math.ceil(factorX*(e.changedTouches[0].clientX - rect.left - Math.max(canvas.clientWidth - canvas.clientHeight, 0)/2));
      let cY = Math.ceil(factorY*(e.changedTouches[0].clientY - rect.top - Math.max(canvas.clientHeight - canvas.clientWidth, 0)/2));
      // console.log(cX, cY);
      // console.log(SharedSettings.COORD_TO_ZONE_ID(cX, cY));
      this.fromZoneId = SharedSettings.COORD_TO_ZONE_ID(cX, cY);


    }

    onTouchEnd(e){
      // console.log(e);
      // console.log(e.changedTouches[0].clientX);
      // canvas上での座標に変換
      socket.emit('hide-arrow');
      this.isClicked = false;

      if(this.fromZoneId !== -1 && this.toZoneId !== -1 && this.fromZoneId !== this.toZoneId){
        socket.emit( 'move-units-interzonely', this.fromZoneId, this.toZoneId);
        
      }

      this.fromZoneId = -1;
      this.toZoneId = -1;
    }

    onTouchMove(e){
      console.log('ontouchmove');
      if(this.fromZoneId !== -1 && this.isClicked){
        // canvas上での座標に変換
        let rect = e.target.getBoundingClientRect();

        let factorX = canvas.width/Math.min(canvas.clientWidth, canvas.clientHeight);
        let factorY = canvas.height/Math.min(canvas.clientWidth, canvas.clientHeight);
        let cX = Math.ceil(factorX*(e.changedTouches[0].clientX - rect.left - Math.max(canvas.clientWidth - canvas.clientHeight, 0)/2));
        let cY = Math.ceil(factorY*(e.changedTouches[0].clientY - rect.top - Math.max(canvas.clientHeight - canvas.clientWidth, 0)/2));
        // console.log(cX, cY);
        // console.log(SharedSettings.COORD_TO_ZONE_ID(cX, cY));
        this.toZoneId = SharedSettings.COORD_TO_ZONE_ID(cX, cY);
        // console.log(this.fromZoneId, this.toZoneId)
        if(this.toZoneId !== -1){
          socket.emit( 'update-arrow', this.fromZoneId, this.toZoneId);
        }else{
          socket.emit( 'hide-arrow' );
        }

      }

    }

   	onDown(e){
   		// console.log('onDown, socket.id = %s', socket.id);

      socket.emit('show-arrow');
      this.isClicked = true;

   		// canvas上での座標に変換
   		let rect = e.target.getBoundingClientRect();

   		let factorX = canvas.width/Math.min(canvas.clientWidth, canvas.clientHeight);
   		let factorY = canvas.height/Math.min(canvas.clientWidth, canvas.clientHeight);
   		let cX = Math.ceil(factorX*(e.clientX - rect.left - Math.max(canvas.clientWidth - canvas.clientHeight, 0)/2));
   		let cY = Math.ceil(factorY*(e.clientY - rect.top - Math.max(canvas.clientHeight - canvas.clientWidth, 0)/2));
  		// console.log(cX, cY);
  		// console.log(SharedSettings.COORD_TO_ZONE_ID(cX, cY));
  		this.fromZoneId = SharedSettings.COORD_TO_ZONE_ID(cX, cY);
   	}

   	onUp(e){
   		// console.log('onUp, socket.id = %s', socket.id);

      socket.emit('hide-arrow');
      this.isClicked = false;




  		if(this.fromZoneId !== -1 && this.toZoneId !== -1 && this.fromZoneId !== this.toZoneId){
  			socket.emit( 'move-units-interzonely', this.fromZoneId, this.toZoneId);
  			
  		}

      this.fromZoneId = -1;
      this.toZoneId = -1;
   	}

    onMouseMove(e){
      if(this.fromZoneId !== -1 && this.isClicked){
        // canvas上での座標に変換
        let rect = e.target.getBoundingClientRect();

        let factorX = canvas.width/Math.min(canvas.clientWidth, canvas.clientHeight);
        let factorY = canvas.height/Math.min(canvas.clientWidth, canvas.clientHeight);
        let cX = Math.ceil(factorX*(e.clientX - rect.left - Math.max(canvas.clientWidth - canvas.clientHeight, 0)/2));
        let cY = Math.ceil(factorY*(e.clientY - rect.top - Math.max(canvas.clientHeight - canvas.clientWidth, 0)/2));
        // console.log(cX, cY);
        // console.log(SharedSettings.COORD_TO_ZONE_ID(cX, cY));
        this.toZoneId = SharedSettings.COORD_TO_ZONE_ID(cX, cY);
        // console.log(this.fromZoneId, this.toZoneId)
        if(this.toZoneId !== -1){
          socket.emit( 'update-arrow', this.fromZoneId, this.toZoneId);
        }else{
          socket.emit( 'hide-arrow' );
        }

      }

    }

   	initSocket(){

   		this.socket.on('connect', ()=>{
   			console.log('connect : socket.id = %s', socket.id);
   			// this.socket.emit('enter-the-game');
   		});

   		this.socket.on('update', (aUnit, aZone, iProcessingTimeNanoSec)=>{
        // console.log('screen update');
   			this.aUnit = aUnit;
   			this.aZone = aZone;
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
      // console.log('render');
   		// キャンバスのクリア
   		this.context.clearRect(0, 0, canvas.width, canvas.height);

   		// キャンバスの塗りつぶし
   		this.renderField();

   		// zoneの描画
      if( null !== this.aZone ){
        this.aZone.forEach((zone)=>{
          this.renderZone(zone);
        })        
      }


   		// unitの描画
   		if( null !== this.aUnit ){
   			const fTimeCurrentSec = iTimeCurrent * 0.001;
   			// const iIndexFrame = 0;
   			this.aUnit.forEach((unit)=>{
   				this.renderUnit( unit );
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


      // 矢印の描画
      // console.log(this.isClicked, this.fromZoneId, this.toZoneId);
      if(this.isClicked && this.fromZoneId !== -1 && this.toZoneId !== -1 && this.fromZoneId !== this.toZoneId){
        // console.log('aroww')
        this.renderArrow(this.fromZoneId, this.toZoneId);
      }


   	}

   	renderField(){
   		this.context.save();

   		this.context.restore();
   	}

   	renderUnit( unit ){
      // console.log(unit.fX, unit.iIndexFrame);
      // console.log(unit.socket.id)
      const iIndexFrame = unit.socket_id === socket.id ? 0 : 1;
      
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

   	renderZone(zone){
   		this.context.save();
   		this.context.translate( zone.fX, zone.fY );
   		this.context.strokeStyle = RenderingSettings.ZONE_LINECOLOR;
   		this.context.lineWidth = RenderingSettings.ZONE_LINEWIDTH;
   		this.context.fillStyle = 'white';

   		this.context.fillRect(-SharedSettings.ZONE_WIDTH*0.5,
   			-SharedSettings.ZONE_HEIGHT*0.5,
   			SharedSettings.ZONE_WIDTH,
   			SharedSettings.ZONE_HEIGHT);


   		this.context.strokeRect(-SharedSettings.ZONE_WIDTH*0.5,
   			-SharedSettings.ZONE_HEIGHT*0.5,
   			SharedSettings.ZONE_WIDTH,
   			SharedSettings.ZONE_HEIGHT);


   		this.context.restore();

   	}

    renderArrow(fromZoneId, toZoneId){
      this.context.save();

      this.context.lineWidth = 2;
      this.context.strokeStyle = 'red';

      this.context.beginPath();
      let {cX:fromCX, cY:fromCY} = SharedSettings.ZONE_ID_TO_COORD(fromZoneId);
      let {cX:toCX, cY:toCY} = SharedSettings.ZONE_ID_TO_COORD(toZoneId);
      // console.log(fromCX, fromCY, toCX, toCY);
      let dx = toCX - fromCX;
      let dy = toCY - fromCY;
      let theta = Math.atan2(dy, dx); // 直線の傾き
      let phi = Math.PI/4; // 矢印部の直線からの角度
      let length = 10; // 矢印部の長さ

      this.context.moveTo(fromCX, fromCY);
      this.context.lineTo(toCX, toCY);
      this.context.lineTo(toCX + length*Math.cos(theta + Math.PI - phi), toCY + length*Math.sin(theta + Math.PI - phi));
      this.context.moveTo(toCX, toCY);
      this.context.lineTo(toCX + length*Math.cos(theta + Math.PI + phi), toCY + length*Math.sin(theta + Math.PI + phi));

      this.context.stroke();

      this.context.restore();
    }
}