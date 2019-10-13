class SharedSettings{

	static get FIELD_WIDTH() { return 1024; }
	static get FIELD_HEIGHT() { return 1024; }


	// unit
	static get UNIT_WIDTH() { return 16.0; }
	static get UNIT_HEIGHT() { return 16.0; }

	// zone
	static get ZONE_ROW_NUM() { return 8; }
	static get ZONE_COL_NUM() { return 8; }
	static get ZONE_WIDTH() { return 128.0; }
	static get ZONE_HEIGHT() { return 128.0; }
	static COORD_TO_ZONE_ID(x, y) { 
		// fieldの外
		if(x < 0 || x >= SharedSettings.FIELD_WIDTH || y < 0 || y >= SharedSettings.FIELD_HEIGHT){
			return -1; // invalid
		}

		// 境界
		if(x%SharedSettings.ZONE_WIDTH < SharedSettings.UNIT_WIDTH*0.5 || x%SharedSettings.ZONE_WIDTH > SharedSettings.ZONE_WIDTH - SharedSettings.UNIT_WIDTH*0.5){
			return -1;
		}
		if(y%SharedSettings.ZONE_HEIGHT < SharedSettings.UNIT_HEIGHT*0.5 || y%SharedSettings.ZONE_HEIGHT > SharedSettings.ZONE_HEIGHT - SharedSettings.UNIT_HEIGHT*0.5){
			return -1;
		}
		return Math.floor(x/SharedSettings.ZONE_WIDTH) + Math.floor(y/SharedSettings.ZONE_HEIGHT)*SharedSettings.ZONE_COL_NUM; 
	}
}

if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' )
{   // サーバー処理（Node.js処理）用の記述
    module.exports = SharedSettings;
}