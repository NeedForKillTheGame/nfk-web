import Player from "./Player.js";
import Sound from "./Sound.js";
import Constants from "./Constants.js";
import Utils from "./Utils.js";
import Console from "./Console.js";
import Global from "./G.js";

export default
class Demo {
	constructor(g) {
		this.g = g;
		this.players = g.players;
		this.data = {};
		
		this.frameId = 0;
	}
	
	loadFromQuery(callback)
	{
		var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        if (queryString.indexOf('demourl=') === 0) {
            var demoUrl = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
			demoUrl = this.g.config.demoServiceUrl + demoUrl + '&full=true';
            Console.writeText('loading demo from url ' + demoUrl);
			this.load(demoUrl, callback);
        }
	}
	
	load(demoUrl, callback)
	{
		var that = this;
		this._loadJSON(demoUrl,
			function(data) {
				Utils.removeHtmlElement("loading");
				//console.log(data);
				that.data = data;
				callback(that);
			},
			function(xhr) { 
				Utils.removeHtmlElement("loading");
				Console.writeText('error loading demo');
				console.error(xhr);
			}
		);
	}
	
	spawnPlayer(dxid, name)
	{
		var p = new Player(this.g, dxid, name);
		if (this.players.length == 0) {
			p.follow = true; // FIXME: follow only one player (the first)
		}
		this.players.push(p);
		return p;
	}
	
	nextFrame(gametic)
	{
		// end of the demo
		if (this.frameId > this.data.DemoUnits.length - 1) {
			// TODO: display players summary statistics
			Sound.play('gameend');
			console.log("end of demo");
			return false;
		}
		
		
		var unit = this.data.DemoUnits[this.frameId];
		var demounit = unit.DemoUnit;


		//console.log(this.frameId + " / " + unit.DData.gametime + " / " + unit.DData.gametic  + " / " + gametic );
		if (gametic != unit.DData.gametic)
			return true;

		//console.log("next");
		
		this.frameId++;
		this.g.gamestate.gametime = unit.DData.gametime;
		this.g.gamestate.gametick = unit.DData.gametick;


		switch (unit.DData.type0)
		{
			// match start
			case Constants.DDEMO_TIMESET:

				this.g.timerManager.clearTimers();

				// spawn objects only it match started (otherwise warmup will be > 0)
				if (demounit.warmup == 0) {
					Sound.play('matchstart');
					this.g.map.spawnObjects();
				}
				break;
			// update position for a player
			case Constants.DDEMO_PLAYERPOSV3:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].x = demounit.x;
						this.players[k].y = demounit.y;
						this.players[k].velocityX = demounit.inertiax;
						this.players[k].velocityY = demounit.inertiay;
						
						if ((demounit.PUV3 & Constants.PUV3_DIR0)==Constants.PUV3_DIR0) this.players[k].dir = Constants.DIR_LW;
						if ((demounit.PUV3 & Constants.PUV3_DIR1)==Constants.PUV3_DIR1) this.players[k].dir = Constants.DIR_RW;
						if ((demounit.PUV3 & Constants.PUV3_DIR2)==Constants.PUV3_DIR2) this.players[k].dir = Constants.DIR_LS;
						if ((demounit.PUV3 & Constants.PUV3_DIR3)==Constants.PUV3_DIR3) this.players[k].dir = Constants.DIR_RS;
						if ((demounit.PUV3 & Constants.PUV3_DEAD0)==Constants.PUV3_DEAD0) this.players[k].setDead(0);
						if ((demounit.PUV3 & Constants.PUV3_DEAD1)==Constants.PUV3_DEAD1) this.players[k].setDead(1);
						if ((demounit.PUV3 & Constants.PUV3_DEAD2)==Constants.PUV3_DEAD2) this.players[k].setDead(2);
						if ((demounit.PUV3 & Constants.PUV3_WPN0)==Constants.PUV3_WPN0) this.players[k].setWeapon(Constants.C_WPN_GAUNTLET);
						if ((demounit.PUV3 & Constants.PUV3_WPN1)==Constants.PUV3_WPN1) this.players[k].setWeapon(Constants.C_WPN_MACHINE);
						if ((demounit.PUV3 & Constants.PUV3_WPN2)==Constants.PUV3_WPN2) this.players[k].setWeapon(Constants.C_WPN_SHOTGUN);
						if ((demounit.PUV3 & Constants.PUV3_WPN3)==Constants.PUV3_WPN3) this.players[k].setWeapon(Constants.C_WPN_GRENADE);
						if ((demounit.PUV3 & Constants.PUV3_WPN4)==Constants.PUV3_WPN4) this.players[k].setWeapon(Constants.C_WPN_ROCKET);
						if ((demounit.PUV3 & Constants.PUV3_WPN5)==Constants.PUV3_WPN5) this.players[k].setWeapon(Constants.C_WPN_SHAFT);
						if ((demounit.PUV3 & Constants.PUV3_WPN6)==Constants.PUV3_WPN6) this.players[k].setWeapon(Constants.C_WPN_RAIL);
						if ((demounit.PUV3 & Constants.PUV3_WPN7)==Constants.PUV3_WPN7) this.players[k].setWeapon(Constants.C_WPN_PLASMA);
						if ((demounit.PUV3B & Constants.PUV3B_WPN8)==Constants.PUV3B_WPN8) this.players[k].setWeapon(Constants.C_WPN_BFG);
						var crouch = ((demounit.PUV3B & Constants.PUV3B_CROUCH)==Constants.PUV3B_CROUCH) ? true : false;
						this.players[k].setCrouch(crouch);
						this.players[k].BALLOON = ((demounit.PUV3B & Constants.PUV3B_BALLOON)==Constants.PUV3B_BALLOON) ? true : false;
						
						if ((this.players[k].dead == 0) && ((demounit.PUV3 & Constants.PUV3_DEAD1)==Constants.PUV3_DEAD1))
							this.players[k].graphics.stop();
						else
							this.players[k].graphics.play();
						
						if ((this.players[k].dead > 0) && ((demounit.PUV3 & Constants.PUV3_DEAD0)==Constants.PUV3_DEAD0) && (this.players[k].rewardtime>0)) this.players[k].rewardtime = 0;
						this.players[k].fangle = demounit.wpnang * (180/128); // given angle is from 0 to 255, we convert it to 360 degrees notation

						// fix angle for the right and left sides
						if ((this.players[k].dir == Constants.DIR_RW) || (this.players[k].dir == Constants.DIR_RS)) {
							if (this.players[k].fangle > 180) this.players[k].fangle =  this.players[k].fangle; 
							this.players[k].fangle -= 90;
						} else {
							if (this.players[k].fangle <= 180) this.players[k].fangle = this.players[k].fangle;
							this.players[k].fangle = 270 - this.players[k].fangle;
						}

						this.players[k].ammo_mg = demounit.currammo;
						this.players[k].ammo_sg = demounit.currammo;
						this.players[k].ammo_gl = demounit.currammo;
						this.players[k].ammo_rl = demounit.currammo;
						this.players[k].ammo_sh = demounit.currammo;
						this.players[k].ammo_rg = demounit.currammo;
						this.players[k].ammo_pl = demounit.currammo;
						this.players[k].ammo_bfg = demounit.currammo;
						
					}
				}
				break;

			// update player health and armor
			case Constants.DDEMO_HAUPDATE:
				// update position for a player from the frame
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].health = demounit.health;
						this.players[k].armor = demounit.armor;
					}
				}
				break;
			
			// player joined
			case Constants.DDEMO_CREATEPLAYERV2:
				var name = demounit.netname;
				var p = this.spawnPlayer(demounit.DXID, name);
				console.log(demounit);
				var model = demounit.modelname.split('+');
				p.setModel(model[0], model[1]);
				p.changeTeam(demounit.team);
				console.log("player joined " + name);
				break;
				
				
			case Constants.DDEMO_TEAMSELECT:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].changeTeam(demounit.team);
					}
				}
				break;
			case Constants.DDEMO_PLAYERMODELCHANGE:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						console.log("changemodel ", demounit);
						var model = demounit.newstr.split('+');
						this.players[k].setModel(model[0], model[1]);
					}
				}
				break;

				
			// player left
			case Constants.DDEMO_DROPPLAYER:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.DXID) {
						console.log("player left " + this.players[i].name);
						this.players[i].destroy();
						this.players.splice(i, 1);
					}
				}
				
				break;		
				
			// player attacked
			case Constants.DDEMO_DAMAGEPLAYER:
				for (var k = 0; k < this.players.length; k++)
				{
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].health = demounit.health;
						Sound.playPain(this.players[k]);
					}
				}
				break;
				
			case Constants.DDEMO_CTF_EVENT_FLAGPICKUP:
				console.log("flag pickup");
				demounit.DXID = demounit.PlayerDXID;
			case Constants.DDEMO_CTF_EVENT_FLAGTAKEN:
				Sound.play('flagtk');
				
				for (var k = 0; k < this.players.length; k++)
				{
					// find player
					if (demounit.DXID == this.players[k].DXID)
					{
						// enemy flag itemid
						var itemId = this.players[k].team == Constants.C_TEAMBLUE
							? Constants.IT_RED_FLAG
							: Constants.IT_BLUE_FLAG;
						// find flag in objects
						for (var o in this.g.objects) {
							if (this.g.objects[o].itemId == itemId) {
								this.players[k].flag = this.g.objects[o]; // set to player
								console.log("flag " + itemId + " taken by " + this.players[k].displayName);
								break;
							}
						}
					}
				}
				break;
			case Constants.DDEMO_CTF_EVENT_FLAGRETURN:
				Sound.play('flagret');
				// flag itemid
				var itemId = demounit.team == Constants.C_TEAMBLUE
					? Constants.IT_BLUE_FLAG
					: Constants.IT_RED_FLAG;
				// find flag in objects
				for (var o in this.g.objects) {
					if (this.g.objects[o].itemId == itemId) {
						this.g.objects[o].returnToBase();
						console.log("flag " + itemId + " returned");
						break;
					}
				}
				break;
			case Constants.DDEMO_CTF_EVENT_FLAGCAPTURE:
				Sound.play('flagcap');

				for (var k = 0; k < this.players.length; k++)
				{
					// find player
					if (demounit.DXID == this.players[k].DXID)
					{
						this.players[k].flag.returnToBase();
					}
				}
				break;
				
				
			case Constants.DDEMO_EARNPOWERUP:

				break;
				
			case Constants.DDEMO_CHATMESSAGE:
				var text = "";
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.TDNETCHATMessage.DXID) {
						text += this.players[i].displayName + ": ";
						break;
					}
				}
				text += Utils.filterNickName(demounit.MessageText);
				
				Console.writeText(text);
				Sound.play('talk');
				break;
				
			
			// FIXME: hit player, it is not a death
			case Constants.DDEMO_KILLOBJECT:
				//
				break;

			case Constants.DDEMO_FIREBFG:
			case Constants.DDEMO_FIREROCKET:
			case Constants.DDEMO_FIREPLASMAV2:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.spawnerDxid) {
						this.players[i].weapon.fire(demounit.x, demounit.y, demounit.inertiax, demounit.inertiay);
					}
				}
				break;

			case Constants.DDEMO_FIREGREN:
			case Constants.DDEMO_FIRERAIL:
			case Constants.DDEMO_FIRESHOTGUN:
			case Constants.DDEMO_FIREMACH:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.spawnerDxid) {
						this.players[i].weapon.fireVector(demounit.x, demounit.y, demounit.cx, demounit.cy, demounit.inertiax, demounit.inertiay);
					}
				}
				break;
			
			// gauntlet attack or not
			case Constants.DDEMO_GAUNTLETSTATE:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.DXID) {
						console.log(demounit.State);
						if (demounit.State == 0)
							this.players[i].weapon.stop();
						else
							this.players[i].weapon.fire(demounit.State);
					}
				}
				break;

			case Constants.DDEMO_NEW_SHAFTBEGIN:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.DXID) {
						this.players[i].weapon.fire(demounit.AMMO);
					}
				}
				break;

			case Constants.DDEMO_NEW_SHAFTEND:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.DXID) {
						this.players[i].weapon.stop();
					}
				}
				break;
				
			case Constants.DDEMO_JUMPSOUND:
				for (var i = 0; i < this.players.length; i++) {
					if (this.players[i].DXID == demounit.dxid) {
						this.players[i].jump();
					}
				}
				break;
			case Constants.DDEMO_JUMPPADSOUND:
				//Sound.play('jumppad'); // played in item
				break;
			case Constants.DDEMO_RESPAWNSOUND:
				Sound.play('respawn');
				break;
			case Constants.DDEMO_LAVASOUND:
				Sound.play('lava');
				break;

			// spawn powerup
			case Constants.DDEMO_POWERUPSOUND:
				for (var o in this.g.objects) {
					// find powerup in spawned objects and set it visible
					if (this.g.objects[o].x == demounit.x && this.g.objects[o].y == demounit.y) {
						this.g.objects[o].show();
					}
				}
				break;
			case Constants.DDEMO_FLIGHTSOUND:
				Sound.play('flight');
				break;
			case Constants.DDEMO_NOAMMOSOUND:
				Sound.play('noammo');
				break;
			case Constants.DDEMO_GENERICSOUNDDATA:
				//Sound.play('genericdata'); // FIXEME: hit player?
				break;
			case Constants.DDEMO_GENERICSOUNDSTATDATA:
				
				break;
			// FIXME: it does not fire?
			case Constants.DDEMO_GENERICSOUNDDATA:
				console.log("sound " + demounit.SoundType);
			break;
				
		}
		
		// increase next frame recursively until all ticks will be handled
		this.nextFrame(gametic);
		
		return true;
	}
	
	
	_loadJSON(path, success, error)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success)
						success(JSON.parse(xhr.responseText));
				} else {
					if (error)
						error(xhr);
				}
			}
		};
		xhr.open("GET", path, true);
		xhr.send();
	}
}