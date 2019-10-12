class SharedSettings{

	static get FIELD_WIDTH() { return 1024; }
	static get FIELD_HEIGHT() { return 1024; }


	// unit
	static get UNIT_WIDTH() { return 16.0; }
	static get UNIT_HEIGHT() { return 16.0; }
}

if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' )
{   // サーバー処理（Node.js処理）用の記述
    module.exports = SharedSettings;
}