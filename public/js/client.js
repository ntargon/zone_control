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
	}
});