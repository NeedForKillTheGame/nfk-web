import Constants from "./Constants.js";
import Sound from "./Sound.js";
import Map from "./Map.js";
import Utils from "./Utils.js";
import Console from "./Console.js";

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;

		
//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
var isBrick = Map.isBrick;
var trunc = Utils.trunc;

var logLine = 0;
var textarea = document.getElementById('log');
var newText = '';
		
export default
class PlayerPhysics {
	constructor(player) {
		this.player = player;

		this.defx = 0;
		this.defy = 0;

		this.tmpCol = 0;
		this.tmpY = 0;
		this.tmpSpeedX = 0;
		
		
		
		this.tmpAbsMaxVelocityX = 0;
		this.tmpSign = 0;
		this.velocityYSpeedJump = [0, 0, 0.4, 0.8, 1.0, 1.2, 1.4];
		this.velocityXSpeedJump = [0, 0.33, 0.8, 1.1, 1.4, 1.8, 2.2];
		this.tmpLastWasJump = false;
		this.tmpCurJump = false;
		this.speedJumpDirection = 0;
		this.tmpLastKeyUp = false;
		this.tmpDjBonus = 0;
		
	
	}


	playerphysic(player) {
		// --!-!-!=!=!= ULTIMATE 3d[Power]'s PHYSIX M0DEL =!=!=!-!-!--

		this.defx = this.player.x;
		this.defy = this.player.y;
		this.player.velocityY = this.player.velocityY + 0.056;

		if (this.player.velocityY > -1 && this.player.velocityY < 0) {
			this.player.velocityY /= 1.11; // progressive inertia
		}
		if (this.player.velocityY > 0 && this.player.velocityY < 5) {
			this.player.velocityY *= 1.1; // progressive inertia
		}

		if (this.player.velocityX < -0.2 || this.player.velocityX > 0.2) {
			if (this.player.keyLeft === this.player.keyRight) {
				//No active key left/right pressed
				if (this.player.isOnGround()) {
					this.player.velocityX /= 1.14;    // ongroud stop speed.
				}
				else {
					this.player.velocityX /= 1.025;   // inair stopspeed.
				}
			}
		} else {
			//completelly stop if velocityX less then 0.2
			this.player.velocityX = 0;
		}

		if (this.player.velocityX !== 0) {
			this.tmpSpeedX = (this.player.velocityX < 0 ? -1 : 1) * this.velocityXSpeedJump[this.player.speedJump];
		} else {
			this.tmpSpeedX = 0;
		}
		this.player.setXY(this.player.x + this.player.velocityX + this.tmpSpeedX, this.player.y + this.player.velocityY);

		// wall CLIPPING
		if (this.player.crouch) {
			//VERTICAL CHECNING WHEN CROUCH FIRST
			if (this.player.isOnGround() && (this.player.isBrickCrouchOnHead() || this.player.velocityY > 0)) {
				this.player.velocityY = 0;
				this.player.setY(trunc(Math.round(this.player.y) / 16) * 16 + 8);
			} else if (this.player.isBrickCrouchOnHead() && this.player.velocityY < 0) {      // fly up
				this.player.velocityY = 0;
				this.player.doublejumpCountdown = 3;
				this.player.setY(trunc(Math.round(this.player.y) / 16) * 16 + 8);
			}
		}

		// HORZ CHECK
		if (this.player.velocityX != 0) {
			this.tmpCol = trunc(Math.round(this.defx + (this.player.velocityX < 0 ? -11 : 11)) / 32);
			this.tmpY = this.player.crouch ? this.player.y : this.defy;
			if (
				isBrick(this.tmpCol, trunc(Math.round(this.tmpY - (this.player.crouch ? 8 : 16)) / 16))
				|| isBrick(this.tmpCol, trunc(Math.round(this.tmpY) / 16))
				|| isBrick(this.tmpCol, trunc(Math.round(this.tmpY + 16) / 16))
			) {
				this.player.setX(trunc(this.defx / 32) * 32 + (this.player.velocityX < 0 ? 9 : 22));
				this.player.velocityX = 0;
				this.player.speedJump = 0;
				if (this.defx != this.player.x) {
					this.log('wall', this.player);
				}
			}
		}

		//Vertical check again after x change
		if (this.player.isOnGround() && (this.player.isBrickOnHead() || this.player.velocityY > 0)) {
			this.player.velocityY = 0;
			this.player.setY(trunc(Math.round(this.player.y) / 16) * 16 + 8);
		} else if (player.isBrickOnHead() && this.player.velocityY < 0) {
			// fly up
			this.player.velocityY = 0;
			this.player.doublejumpCountdown = 3;
		}

		if (this.player.velocityX < -5)  this.player.velocityX = -5;
		if (this.player.velocityX > 5)  this.player.velocityX = 5;
		if (this.player.velocityY < -5) this.player.velocityY = -5;
		if (this.player.velocityY > 5)  this.player.velocityY = 5;
	}


	
	
	
	playermove() {

		this.playerphysic(this.player);

		if (this.player.doublejumpCountdown > 0) {
			this.player.doublejumpCountdown--;
		}

		if (this.player.isOnGround()) {
			this.player.velocityY = 0;  // really nice thing :)
		}

		this.tmpCurJump = false;

		if (this.player.speedJump > 0
			&& (this.player.keyUp !== this.tmpLastKeyUp
			|| this.player.keyLeft && this.speedJumpDirection !== -1
			|| this.player.keyRight && this.speedJumpDirection !== 1)
		) {
			this.player.speedJump = 0;
			this.log('sj 0 - change keys', this.player);
		}

		this.tmpLastKeyUp = this.player.keyUp;

		if (this.player.keyUp) {
			// JUMP!
			if (this.player.isOnGround() && !this.player.isBrickOnHead() && !this.tmpLastWasJump) {

				if (this.player.doublejumpCountdown > 4 && this.player.doublejumpCountdown < 11) {
					// double jumpz
					this.player.doublejumpCountdown = 14;
					this.player.velocityY = -3;

					if (this.player.velocityX !== 0) {
						this.tmpSpeedX = Math.abs(this.player.velocityX) + this.velocityXSpeedJump[this.player.speedJump];
					} else {
						this.tmpSpeedX = 0;
					}

					if (this.tmpSpeedX > 3) {
						this.tmpDjBonus = this.tmpSpeedX - 3;
						this.player.velocityY -= this.tmpDjBonus;
						this.log('dj higher (bonus +' + this.round(this.tmpDjBonus) + ')', this.player);
					} else {
						this.log('dj standart', this.player);
					}
					this.player.crouch = false;
					Sound.jump();

					//this.player.velocityY += this.velocityYSpeedJump[this.player.speedJump];
				} else {
					if (this.player.doublejumpCountdown === 0) {
						this.player.doublejumpCountdown = 14;
						Sound.jump();
					}
					this.player.velocityY = -2.9;
					this.player.velocityY += this.velocityYSpeedJump[this.player.speedJump];

					this.log('jump', player);

					if (this.player.speedJump < 6 && !this.tmpLastWasJump && this.player.keyLeft !== this.player.keyRight) {
						this.speedJumpDirection = this.player.keyLeft ? -1 : 1;
						this.player.speedJump++;
						this.log('increase sj', this.player);
					}
				}

				this.tmpCurJump = true;
			}
		} else {
			if (this.player.isOnGround() && this.player.speedJump > 0 && !this.player.keyDown) {
				this.player.speedJump = 0;
				this.log('sj 0 - on ground', this.player);
			}
		}

		// CROUCH
		if (!this.player.keyUp && this.player.keyDown) {
			if (this.player.isOnGround()) {
				this.player.crouch = true;
			}
			else if (!this.player.isBrickCrouchOnHead()) {
				this.player.crouch = false;
			}
		} else {
			this.player.crouch = this.player.isOnGround() && this.player.isBrickCrouchOnHead();
		}

		this.tmpLastWasJump = this.tmpCurJump;

		if (this.player.keyLeft !== this.player.keyRight) {
			//One of the keys pressed - left or right, starting calculation
			this.tmpAbsMaxVelocityX = PLAYER_MAX_VELOCITY_X;
			if (this.player.crouch) {
				this.tmpAbsMaxVelocityX--;
			}

			//While moving left - speed should be negative value
			this.tmpSign = this.player.keyLeft ? -1 : 1;

			if (this.player.velocityX * this.tmpSign < 0) {
				//We are currently moving in opposite direction
				//So we make a fast turn with 0.8 acceleration
				this.player.velocityX += this.tmpSign * 0.8;
			}

			var absVelocityX = Math.abs(this.player.velocityX);
			if (absVelocityX < this.tmpAbsMaxVelocityX) {
				//We are not at the maximum speed yet, continue acceleration
				this.player.velocityX += this.tmpSign * 0.35;
			} else if (absVelocityX > this.tmpAbsMaxVelocityX) {
				//Somehow we are out of the speed limit. Let's limit it!
				this.player.velocityX = this.tmpSign * this.tmpAbsMaxVelocityX;
			}
		}
	}

	

	log(text) {
		logLine++;
		if (this.player.velocityX !== 0) {
			this.tmpSpeedX = (this.player.velocityX < 0 ? -1 : 1) * this.velocityXSpeedJump[pthis.layer.speedJump];
		} else {
			this.tmpSpeedX = 0;
		}
		newText = logLine
			+ ' '
			+ text
			+ ' (x: ' + this.round(this.player.x)
			+ ', y: ' + this.round(this.player.y)
			+ ', dx: ' + this.round(this.tmpSpeedX)
			+ ', dy: ' + this.round(this.player.velocityY)
			+ ', sj: ' + this.player.speedJump
			+ ')';
		textarea.value = newText + "\n" + textarea.value.substring(0, 1000);
		Console.writeText(newText);
	}

	round(val) {
		return trunc(val) + '.' + Math.abs(trunc(val * 10) - trunc(val) * 10)
	}
}


function runPhysicsOneFrame(player) {

	//Стратегия расчёта физики следующая:
	//Используя текущие значения скорости (расчитанные в предыдущем кадре) сделаем перемещение игрока
	//Проверим столкновения со стенами, сделаем корректировку позиции игрока, если он провалился внутрь какой-нибудь стены
	//Перед обновлением позиции игрока запомним старые значения колонки
	player.physics.playermove();
}

var time = 0;
var tmpDeltaTime = 0;
var tmpDeltaPhysicFrames = 0;

export function updateGame(player, timestamp) {

	if (time === 0) {
		//Это первый запуск функции, начальное время игры ещё не было установлено
		//Установим это время на 16мс назад, чтобы просчитать физику одного физического фрейма
		time = timestamp - 16;
	}

	//Физика основана на константах из NFK
	//В NFK физика была привзяна к FPS=50, поэтому вск константы были из расчёта FPS=50
	//В новой реализации физика не должна быть привязана к FPS выдаваемому компьютером, а будет привязана к времени
	//Сделаем расчёт исходя из 60 FPS (т.е. игра будет чуть быстрее, чем оригинальная): 1сек/60 = 16мили секунд
	//Чтобы сохранить все старые константы, почитаем какое перемещение нужно сделать за реально прошедшее время deltaTime?
	tmpDeltaTime = timestamp - time;
	//Назовём 20милисекундный интервал "физическим фреймом"
	//Посчитаем, сколько физических фреймов прошло за delltaTime?
	tmpDeltaPhysicFrames = trunc(tmpDeltaTime / 16);
	if (tmpDeltaPhysicFrames === 0) {
		//Ещё не накопилось достаточно времени, чтобы начёт расчёт хотя бы одного физического фрейма!
		//Прерываем выполнение функции
		return false;
	}

	//Сдвинем указатель time вперёд на нужно число физических фреймов для следующей итерации
	time += tmpDeltaPhysicFrames * 16.6;

	//Есть один или несколько физических фреймов, которые нужно общитать в физической модели, сделаем это в цикле
	if (tmpDeltaPhysicFrames === 1) {
		//В большинстве случаев фрейм будет ровно один, так что для производительности рассмотрим этот вариант отдельно
		runPhysicsOneFrame(player);
	} else {
		//Нужно сделать несколько перемещений в цикле
		while (tmpDeltaPhysicFrames > 0) {
			runPhysicsOneFrame(player);
			tmpDeltaPhysicFrames--;
		}
	}
}
