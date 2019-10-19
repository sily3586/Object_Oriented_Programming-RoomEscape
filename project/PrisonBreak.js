Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	if(welcome !== undefined){
		game.printStory(welcome)
	} else{
		//nothing
	}
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}
Game.over = function(){
	game.gameover()
}

// Room Definition
function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}

Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})


// Object Definition
function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}

Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})
Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})
Object.member('moveX', function(x){
	this.id.moveX(x)
})
Object.member('moveY', function(y){
	this.id.moveY(y)
})
Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

// Door Definition
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

Door.prototype = new Object()

Door.member('onClick', function(){
	if (this.id.isClosed()){
		this.id.open()
	} else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

// Direction Definition
function Direction(room, name, Image, connectedTo){
	Object.call(this, room, name, Image)

	this.Image = Image
	this.connectedTo = connectedTo
}

Direction.prototype = new Object()

Direction.member('onClick', function(){
	Game.move(this.connectedTo)
})

// openclose Definition
function openclose(room, name, closedImage, openedImage){
	Object.call(this, room, name, closedImage)

	this.closedImage = closedImage
	this.openedImage = openedImage
}

openclose.prototype = new Object()

openclose.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	} else if (this.id.isOpened){
		this.id.close()
	}
})
openclose.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
openclose.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

// Keypad Definition
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	this.password = password
	this.callback = callback
}

Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

// Item Definition
function Item(room, name, image){
	Object.call(this, room, name, image)
}

Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

// Computer Definition
function Computer(room, name, image, message){
	Object.call(this, room, name, image)

	this.message = message
}

Computer.prototype = new Object

Computer.member('onClick', function(){
	printMessage(this.message)
})

//방생성
base = new Room('base', '아지트-바깥.png')
parking_lot = new Room('parking_lot', '주차장.png')
car_inside = new Room('car_inside', '자동차-내부.png')
base_inside = new Room('base_inside', '복도.png')
prison = new Room('prison', '독방-1.png')
office = new Room('office', '사무실.png')
control = new Room('control', '관제실.png')
monitor1 = new Room('monitor1', '컴퓨터-화면.png')
monitor2 = new Room('monitor2', '컴퓨터-화면.png')
base2 = new Room('base2', '아지트-바깥.png')

//아지트 바깥1
base.guard = new Object(base, 'guard', '깡패-문지기.png')
base.guard.resize(150)
base.guard.locate(500, 480)
base.guard.onClick = function(){
	printMessage('누구냐ㅡㅡ 들어가고 싶으면 암호를 대라ㅡㅡ')
	showKeypad('number', '9175', function(){
		base.door.unlock()
		base.door.setSprite('셔터문.png')
		printMessage('몰라봬서 죄송합니다! 형님!')
	})
}

base.door = new Direction(base, 'door', '셔터문-투명.png', base_inside)
base.door.resize(67)
base.door.locate(611,478)
base.door.lock()
base.door.onClick = function(){
	if(this.id.isLocked()){
		printMessage('당신 뭐야?!ㅡㅡ 들어가고 싶으면 암호를 대!ㅡㅡ')
	} else if(!this.id.isLocked()){
		Game.move(this.connectedTo)
	}
}

base.direction = new Direction(base, 'direction', '아래.png', parking_lot)
base.direction.resize(150)
base.direction.locate(640,680)

base.car_key1 = new Item(base, 'car_key1', '열쇠.png')
base.car_key1.pick()

//주차장
parking_lot.direction = new Direction(parking_lot, 'direction', '아래.png', base)
parking_lot.direction.resize(150)
parking_lot.direction.locate(640,680)

parking_lot.direction2 = new Direction(parking_lot, 'direction2', '아래.png', base)
parking_lot.direction2.resize(150)
parking_lot.direction2.locate(640,680)
parking_lot.direction2.hide()
parking_lot.direction2.onClick = function(){
	printMessage('아직도 쫓아오고 있잖아! 얼른 도망가자!')
}

parking_lot.car1 = new Object(parking_lot, 'car1', '자동차-1.png')
parking_lot.car1.resize(310)
parking_lot.car1.locate(260, 300)
parking_lot.car1.lock()

parking_lot.car1.onClick = function(){
	if(base.car_key1.isHanded() && this.id.isLocked()){
		this.id.unlock()
		printMessage('(철컥!) 문이 열렸다!')
	} else if(!base.car_key1.isHanded() && this.id.isLocked()){
		printMessage('가방에 열쇠가 있을텐데...')
	} else if(!this.id.isLocked()){
		Game.move(car_inside)
	}
}

parking_lot.car2 = new Object(parking_lot, 'car2', '자동차-2.png')
parking_lot.car2.resize(380)
parking_lot.car2.locate(640, 330)
parking_lot.car2.lock()
parking_lot.car2.onClick = function(){
	if(prison.victim.isPicked()){
		if(!office.car_key2.isHanded()){
			printMessage('나도 언젠가 벤츠 탈테야!')
		} else if(office.car_key2.isHanded() && this.id.isLocked()){
			playSound('자동차시동거는_소리1.wav')
			printMessage('드디어 나도 벤츠를 타는건가?!')
			this.id.unlock()
		} else if(!this.id.isLocked() && this.id.isClosed()){
			printMessage('(부웅!)')
			parking_lot.car2.moveY(100)
			this.id.open()
		} else if(this.id.isOpened()){
			Game.end()
		}
	} else if(!prison.victim.isPicked()){
		printMessage('나도 언젠가 벤츠 탈테야!')
	}
}

parking_lot.car3 = new Object(parking_lot, 'car3', '자동차-3.png')
parking_lot.car3.resize(320)
parking_lot.car3.locate(1050, 310)
parking_lot.car3.lock()

parking_lot.saw = new Item(parking_lot, 'saw', '톱.png')
parking_lot.saw.resize(150)
parking_lot.saw.locate(240, 310)
parking_lot.saw.hide()

parking_lot.cutter = new Item(parking_lot, 'cutter', '절단기.png')
parking_lot.cutter.resize(150)
parking_lot.cutter.locate(260, 310)
parking_lot.cutter.hide()

parking_lot.pipe_wrench = new Item(parking_lot, 'pipe_wrench', '파이프렌치.png')
parking_lot.pipe_wrench.resize(150)
parking_lot.pipe_wrench.locate(270, 310)
parking_lot.pipe_wrench.hide()

parking_lot.trash_can = new Object(parking_lot, 'trash_can', '쓰레기통.png')
parking_lot.trash_can.resize(100)
parking_lot.trash_can.locate(1250,350)
parking_lot.trash_can.onClick = function(){
	printMessage('(뒤적뒤적)')
	parking_lot.trash.show()
}

parking_lot.trash = new Object(parking_lot, 'trash', '쓰레기.png')
parking_lot.trash.resize(20)
parking_lot.trash.locate(1240,285)
parking_lot.trash.hide()
parking_lot.trash.onClick = function(){
	printMessage('무슨 암호같은데...?')
	showImageViewer('종이.png')
}

//자동차 내부
car_inside.direction = new Direction(car_inside, 'direction', '좌.png', parking_lot)
car_inside.direction.resize(50)
car_inside.direction.locate(70,360)

car_inside.trunk_button = new Object(car_inside, 'trunk_button', '트렁크-버튼.png')
car_inside.trunk_button.resize(140)
car_inside.trunk_button.locate(170, 340)
car_inside.trunk_button.onClick = function(){
	parking_lot.car1.setSprite('자동차-트렁크.png')
	printMessage('(딸칵)')
	parking_lot.saw.show()
	parking_lot.cutter.show()
	parking_lot.pipe_wrench.show()
}

car_inside.cabinet = new openclose(car_inside, 'cabinet', '투명.png', '자동차-수납.png')
car_inside.cabinet.resize(240)
car_inside.cabinet.locate(775,235)
car_inside.cabinet.onOpen = function(){
	this.id.setSprite(this.openedImage)
	car_inside.pin.show()
}
car_inside.cabinet.onClose = function(){
	this.id.setSprite(this.closedImage)
	car_inside.pin.hide()
}

car_inside.pin = new Item(car_inside, 'pin', '핀.png')
car_inside.pin.resize(120)
car_inside.pin.locate(780, 210)
car_inside.pin.hide()

car_inside.klaxon = new Object(car_inside, 'klaxon', '투명.png')
car_inside.klaxon.resize(100)
car_inside.klaxon.locate(420, 280)
car_inside.klaxon.onClick = function(){
	playSound('경적.wav')
	printMessage('(빵빵!)')
}

//복도
base_inside.direction = new Direction(base_inside, 'direction', '아래.png', base)
base_inside.direction.resize(150)
base_inside.direction.locate(640, 680)

base_inside.door1 = new Direction(base_inside, 'door1', '복도-문-좌-닫힘.png', control)
base_inside.door1.resize(300)
base_inside.door1.locate(200, 430)

base_inside.door2 = new Direction(base_inside, 'door2', '복도-문-우-닫힘.png', office)
base_inside.door2.resize(300)
base_inside.door2.locate(1080, 430)
base_inside.door2.lock()
base_inside.door2.onClick = function(){
	if(this.id.isLocked()){
		//nothing
	} else if(!this.id.isLocked()){
		Game.move(this.connectedTo)
	}
}

base_inside.door2_lock = new Keypad(base_inside, 'door2_lock', '도어락.png', '1030', function(){
	base_inside.door2.unlock()
	printMessage('(철컥!) 문이 열렸다!')
})
base_inside.door2_lock.resize(50)
base_inside.door2_lock.locate(1130, 450)

base_inside.door3 = new Direction(base_inside, 'door3', '복도-문-정면-닫힘.png', prison)
base_inside.door3.resize(225)
base_inside.door3.locate(640, 300)
base_inside.door3.lock()
base_inside.door3.onClick = function(){
	if(base_inside.lock1.isLocked()){
		//nothing
	} else if(!base_inside.lock1.isLocked()){
		Game.move(this.connectedTo)
		printMessage('누구야!! 형님이 들어오는 사람 다 때려서 내쫓으랬어!!')
	}
}

base_inside.lock1 = new openclose(base_inside, 'lock1', '자물쇠-잠김.png', '자물쇠-열림.png')
base_inside.lock1.resize(35)
base_inside.lock1.locate(560, 280)
base_inside.lock1.lock()
base_inside.lock1.onClick = function(){
	if(parking_lot.cutter.isHanded() || car_inside.pin.isHanded()){
		this.id.setSprite(this.openedImage)
		this.id.unlock()
	} else if(!parking_lot.cutter.isHanded() && !car_inside.pin.isHanded()){
		printMessage('자물쇠를 자르거나 딸 수 있는 도구가 필요하겠는데...?!')
	}
}

//사무실
office.safe_inside = new Object(office, 'safe_inside', '금고-내부.png')
office.safe_inside.resize(120)
office.safe_inside.locate(640, 310)

office.car_key2 = new Item(office, 'car_key2', '자동차키.png')
office.car_key2.resize(50)
office.car_key2.locate(610, 330)

office.gun = new Item(office, 'gun', '권총.png')
office.gun.resize(50)
office.gun.locate(660, 320)
office.gun.onClick = function(){
	this.id.pick()
	printMessage('유사시에는 이 권총을...!')
}

office.safe = new Object(office, 'safe', '금고.png')
office.safe.resize(120)
office.safe.locate(640, 310)
office.safe.lock()
office.safe.onClick  = function(){
	if(this.id.isLocked()){
		showKeypad('telephone', '74715', function(){
			office.safe.unlock()
			printMessage('(철컥!)')
		})
	} else if(!this.id.isLocked()){
		office.safe_door.show()
		this.id.hide()
	}
}

office.safe_door = new Object(office, 'safe_door', '금고-문.png')
office.safe_door.resize(118)
office.safe_door.locate(530, 309)
office.safe_door.hide()

office.frame = new Object(office, 'frame', '액자.png')
office.frame.resize(140)
office.frame.locate(640, 310)
office.frame.onClick = function(){
	if(!this.id.isLocked()){
		this.id.move(250, 180)
		this.id.lock()
	} else if(this.id.isLocked()){
		//nothing
	}
}

office.desk = new Object(office, 'desk', '사무실-책상.png')
office.desk.resize(450)
office.desk.locate(640, 480)

office.com = new Direction(office, 'com', '투명.png', monitor1)
office.com.resize(50)
office.com.locate(520, 420)

office.direction = new Direction(office, 'direction', '아래.png', base_inside)
office.direction.resize(150)
office.direction.locate(640,680)

//사무실 컴퓨터 화면
monitor1.direction = new Direction(monitor1, 'direction', '아래.png', office)
monitor1.direction.resize(150)
monitor1.direction.locate(640, 680)

monitor1.txt = new Object(monitor1, 'txt', 'txt파일.png')
monitor1.txt.resize(50)
monitor1.txt.locate(400, 220)
monitor1.txt.onClick = function(){
	showImageViewer('바코드문제.png')
}

monitor1.taskbar = new Object(monitor1, 'taskbar', '작업표시줄.png')
monitor1.taskbar.resize(825)
monitor1.taskbar.locate(640, 505)

//관제실
control.radio = new Item(control, 'radio', '무전기.png')
control.radio.resize(30)
control.radio.locate(540,620)

control.com1 = new Computer(control, 'com1', '투명.png', '비밀번호가 걸려 있는 컴퓨터... 풀기 어려울 것 같다!')
control.com1.resize(150)
control.com1.locate(610, 420)

control.com2 = new Computer(control, 'com2', '투명.png', '비밀번호가 걸려 있는 컴퓨터... 풀기 어려울 것 같다!')
control.com2.resize(150)
control.com2.locate(120, 440)

control.com3 = new Computer(control, 'com3', '투명.png', '비밀번호가 걸려 있는 컴퓨터... 풀기 어려울 것 같다!')
control.com3.resize(150)
control.com3.locate(340, 460)

control.com4 = new Computer(control, 'com4', '투명.png', '비밀번호가 걸려 있지 않은 컴퓨터를 발견했다!')
control.com4.resize(150)
control.com4.locate(850, 440)
control.com4.onClick = function(){
	printMessage(this.message)
	Game.move(monitor2)
}

control.direction = new Direction(control, 'direction', '아래.png', base_inside)
control.direction.resize(150)
control.direction.locate(640, 680)

//관제실 컴퓨터 화면
monitor2.direction = new Direction(monitor2, 'direction', '아래.png', control)
monitor2.direction.resize(150)
monitor2.direction.locate(640, 680)

monitor2.txt = new Object(monitor2, 'txt', 'txt파일1.png')
monitor2.txt.resize(50)
monitor2.txt.locate(400, 220)
monitor2.txt.onClick = function(){
	showImageViewer('메모장화면.png', '....txt')
}

monitor2.taskbar = new Object(monitor2, 'taskbar', '작업표시줄.png')
monitor2.taskbar.resize(825)
monitor2.taskbar.locate(640, 505)
monitor2.taskbar.onClick = function(){
	monitor2.calendar.show()
}

monitor2.calendar = new Object(monitor2, 'calendar', '달력.png')
monitor2.calendar.resize(200)
monitor2.calendar.locate(953,290)
monitor2.calendar.hide()

//독방
var count = 0

prison.window = new Door(prison, 'window', '투명.png', '창문-열림.png', base2)
prison.window.resize(230)
prison.window.locate(640, 200)
prison.window.lock()
prison.window.onClick = function(){
	if(prison.gangster.isLocked()){
		printMessage('못지나간다!!')
		prison.gangster.hide()
		prison.gangster_face.show()
	} else if(!prison.gangster.isLocked()){
		if(this.id.isLocked() && !parking_lot.cutter.isHanded() && count < 10){
			printMessage('절단기로 창살을 잘라낼 수 있을 것 같다!')
		} else if(this.id.isLocked() && parking_lot.cutter.isHanded() && count < 10){
			printMessage((10-count) + '번만 더하면 잘라낼 수 있을 것 같다!')
			count++
		} else if(this.id.isLocked() && count >= 10){
			this.id.unlock()
			this.id.open()
			printMessage('창문이 열렸다!')
		} else if(this.id.isOpened()){
			if(prison.victim.isPicked()){
				Game.move(this.connectedTo)
				parking_lot.direction2.show()
				printMessage('이 자식! 잘도 날 속였겠다!')
			} else if(!prison.victim.isPicked()){
				printMessage('보스를 데려가야지!')
			}
		}
	}
}

prison.victim = new Item(prison, 'victim', '피구조자.png')
prison.victim.resize(300)
prison.victim.locate(1040, 330)
prison.victim.lock()
prison.victim.onClick = function(){
	if(prison.gangster.isLocked()){
		printMessage('못지나간다!!')
		prison.gangster.hide()
		prison.gangster_face.show()
	} else if(!parking_lot.saw.isHanded() && !prison.gangster.isLocked()){
		printMessage('너무 꽉 묶여있잖아! 자를 수 있는 도구가 필요하겠는데...?!')
	} else if(parking_lot.saw.isHanded() && !prison.gangster.isLocked()){
		this.id.pick()
		if(control.radio.isPicked()){
			printMessage('(무전기 : (치직...치지직...) 현재 아지트에 침입자가 있다. 전 인원 아지트로 집합!)\n시간이 얼마 없어! 5분 안에 탈출하자!')
			game.setTimer(100, 1, '초')
			game.showTimer()
			prison.direction.lock()
		} else if(!control.radio.isPicked()){
			printMessage('이런! 쫙 깔렸네! 되돌아가는 길은 막혔잖아!')
			game.setTimer(50, 1, '초')
			game.showTimer()
			prison.direction.lock()
		}
	}
}

prison.gangster = new Object(prison, 'gangster', '깡패.png')
prison.gangster.resize(320)
prison.gangster.locate(540, 480)
prison.gangster.lock()
prison.gangster.onClick = function(){
	if(!office.gun.isHanded() && this.id.isLocked()){
		printMessage('맨손으로 깡패랑 싸워서 짐...')
		Game.over()
	} else if(office.gun.isHanded()){
		playSound('Gun.wav')
		this.id.setSprite('깡패-쓰러짐.png')
		printMessage('으윽... 가..강하다..!')
		this.id.unlock()
	}
}

prison.direction = new Direction(prison, 'direction', '아래.png', base_inside)
prison.direction.resize(150)
prison.direction.locate(640, 680)
prison.direction.unlock()
prison.direction.onClick = function(){
	if(this.id.isLocked()){
		printMessage('이런! 쫙 깔렸네! 되돌아가는 길은 막혔잖아!')
	} else if(!this.id.isLocked()){
		Game.move(this.connectedTo)
	}
}

prison.gangster_face = new Object(prison, 'gangster_face', '깡패-얼굴.png')
prison.gangster_face.resize(1000)
prison.gangster_face.hide()
prison.gangster_face.onClick = function(){
	Game.over()
}

//아지트 바깥2
base2.guard = new Object(base2, 'guard', '깡패-문지기.png')
base2.guard.resize(320)
base2.guard.locate(750, 490)
base2.guard.lock()
base2.guard.onClick = function(){
	if(office.gun.isHanded()){
		printMessage('나 : (딸칵딸칵!)뭐야?! 총알을 다 썼잖아?!\n깡패 : 장난 지금 나랑허냐!!')
		base2.guard.hide()
		base2.guard_face.show()
	} else if(parking_lot.pipe_wrench.isHanded()){
		printMessage('으윽... 가..강하다...!')
		this.id.setSprite('깡패-문지기-쓰러짐.png')
		this.id.unlock()
	} else{
		printMessage('(퍽퍽퍽)')
		Game.over()
	}
}

base2.door = new Direction(base2, 'door', '셔터문-투명.png', base_inside)
base2.door.resize(67)
base2.door.locate(611,478)
base2.door.lock()

base2.direction = new Direction(base2, 'direction', '아래.png', parking_lot)
base2.direction.resize(150)
base2.direction.locate(640,680)
base2.direction.onClick = function(){
	if(base2.guard.isLocked()){
		printMessage('어딜 도망쳐!')
		base2.guard.hide()
		base2.guard_face.show()
	} else if(!base2.guard.isLocked()){
		Game.move(this.connectedTo)
	}
}

base2.guard_face = new Object(base2, 'guard_face', '깡패-문지기-얼굴.png')
base2.guard_face.resize(1280)
base2.guard_face.hide()
base2.guard_face.onClick = function(){
	Game.over()
}

Game.start(base, '나는 철용파의 행동대장 용해다.\n지금 형님께서 라이벌 중구파에게 잡혀있다.\n어서빨리 형님을 구출해야돼!')