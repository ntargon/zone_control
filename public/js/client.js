'use strict';

// object
const socket = io.connect();

// canvas
const canvas = document.querySelector('#canvas-2d');
console.log(canvas)

// canvas object
const screen = new Screen(socket, canvas);

// 描画開始
screen.animate(0);

$(window).on('beforeunload', (event)=>{
	socket.disconnect();
});


$('#create-room-button').on('click', ()=>{
	let roomName = $('#roomname').val();

	if( roomName.length > 0){
		console.log(roomName);	
		socket.emit('create-room', roomName);	
	}

	$('#roomname').val('');
});

$('#enter-room-button').on('click', ()=>{
	var roomName = $("input[name='room-name']:checked").val();

	if(roomName === void 0){

	}else{
		socket.emit('enter-room', roomName);
		$('#start-screen').hide();
	}
});

socket.on('update-room-screen', (aRoomName)=>{
	console.log('update-room-screen', aRoomName);
	$('#room-screen').empty();
	aRoomName.forEach((roomName)=>{
		$('#room-screen').append(`<input type="radio" name="room-name" value="${roomName}">${roomName} <br>`);
	});
});

socket.on('return-start-screen', ()=>{
	// $('#start-screen').show();
	location.reload();
	alert('disconnect');
})


socket.on('update-arrow', (fromZoneId, toZoneId)=>{
	// console.log('update-arrow', fromZoneId, toZoneId);
	screen.isClicked = true;
	screen.fromZoneId = fromZoneId;
	screen.toZoneId = toZoneId;
});

socket.on('show-arrow', ()=>{
	screen.fromZoneId = -1;
	screen.toZoneId = -1;
});

socket.on('hide-arrow', ()=>{
	screen.isClicked = false;
})