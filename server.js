'use strict';

// modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Game = require('./libs/Game.js');

// objects
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// CONST.
const PORT_NO = process.env.PORT || 1337;

// ゲームの作成と開始
const game = new Game();
game.start(io);

// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// サーバの起動
server.listen(
	PORT_NO,
	// "10.10.217.225",
	() => {
		console.log('Starting server on port %d', PORT_NO);
	});