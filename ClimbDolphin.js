var width = 600;
var height = 800;

var count = 0;

// 배경 정보
var img = new Image();
img.src = "./images/background/background.png";

var y1 = 0;
var y2 = -height;

// 키 입력 정보
// 동시 입력 구현을 위해 만든 것
var keyPressOn = {};

// 플레이어 유닛 정보
var unit1 = new Image();
var unit2 = new Image();

unit1.src = "./images/unit1.png";
unit2.src = "./images/unit2.png";

var unitImg = [unit1, unit2];

var unitImgIndex = 0;
var unitW = width / 5;

var unitX = width / 2;
var unitY = height - unitW;

var unitSpeed = 5;

// 미사일 정보
var missile = new Image();
missile.src = "./images/enemy1.png";
var missileSpeed = height / 80;
var missileW = unitW / 2;
var missileList = [];

// 적 정보
var enemy1 = new Image();
var enemy2 = new Image();
enemy1.src = "./images/enemy1.png";
enemy2.src = "./images/enemy2.png";

var enemyImg = [enemy1];
var enemyW = width / 5;
var enemyX = [];
var enemyList = [];
var enemySpeed;

for (var i = 0; i < 5; i++) {
    var tmp = enemyW / 2 + enemyW * i;
    enemyX.push(tmp);
}
enemySpeed = height / 80;

// 변수 초기화 함수
function init() {

}


// 화면 그리기
function drawscreen() {
    var canvas = document.getElementById("test");
    var context = canvas.getContext("2d");

    context.drawImage(img, 0, y1, width, height);
    context.drawImage(img, 0, y2, width, height);

    document.addEventListener("keydown", getKeyDown, false);
    document.addEventListener("keyup", getKeyUp, false);

    for(var i in missileList) {
        var tmp = missileList[i];
        context.drawImage(missile, tmp.x - missileW / 2, tmp.y - missileW / 2, missileW, missileW);
    }

    for(var i in enemyList) {
        var tmp = enemyList[i];
        context.drawImage(enemyImg[0], tmp.x - enemyW / 2, tmp.y - enemyW / 2, enemyW, enemyW);
    }

    context.drawImage(unitImg[unitImgIndex], unitX - unitW / 2, unitY - unitW / 2, unitW, unitW);
    backscroll();
    makemissile();
    moveMissile();
    makeenemy();
    moveenemy();
    calcUnint();
    deadCheck(missileList);
    deadCheck(enemyList);
    checkMissileEnemyCrush();
    checkCrush();
    count++;
}



// 배경 이미지 좌표
function backscroll() {
    y1 += 5;
    y2 += 5;

    if( y1 >= height ){
        y1 = 0;
        y2 = -height;
    }

    if( y2 >= height ){
        y1 = -height;
        y2 = 0;
    }
}

// 적기 생성
function makeenemy() {
    if(count % 2 != 0) {
        return ;
    }

    var randomnum = (parseInt(Math.random() * 30)) - 10;
    
    if(randomnum != 10) {
        return ;
    }

    for(var i = 0; i < 5; i++) {
        var obj = {};
        obj.x = enemyX[i];
        obj.y = -50;
        obj.isDead = false;
        enemyList.push(obj);
    }
}

//적기 좌표 함수
function moveenemy() {
    for( var i in enemyList) {
        var tmp = enemyList[i];
        tmp.y = tmp.y + enemySpeed;

        if(tmp.y > height + enemyW / 2) {
            tmp.isDead = true;
        }

    }
}

// 미사일 생성
function makemissile() {

    if(count % 10 != 0) {
        return ;
    }    
    var obj = {};
    obj.x = unitX;
    obj.y = unitY;
    obj.isShoot = false;
    missileList.push(obj);
}

// 미사일 좌표 함수
function moveMissile() {
    for( var i in missileList) {
        var tmp = missileList[i];
        tmp.y = tmp.y - missileSpeed;

        if(tmp.y < -missileW / 2) {
            tmp.isDead = true;
        }

    }
}

// 키보드 입력 처리 함수
// 출처 : https://nagarry.tistory.com/168
function getKeyDown(event) {
    var keyValue;

    if(event == null) {
        return ;
    } else {
        keyValue = event.keyCode;
        event.preventDefault();
    }
    if(keyValue == "38") //up
        keyValue = "38";       
    else if(keyValue == "40") //down
        keyValue = "40";  
    else if(keyValue == "37") //left
        keyValue = "37";  
    else if(keyValue == "39") //right
        keyValue = "39";  

    keyPressOn[keyValue] = true;
}

function getKeyUp(event) {
    var keyValue;

    if(event == null) {
        return ;
    } else {
        keyValue = window.event.keyCode;
        event.preventDefault();
    }
    if(keyValue == "38") //up
        keyValue = "38";       
    else if(keyValue == "40") //down
        keyValue = "40";  
    else if(keyValue == "37") //left
        keyValue = "37";  
    else if(keyValue == "39") //right
        keyValue = "39";  

    keyPressOn[keyValue] = false;
}

function calcUnint() {
    if(keyPressOn["38"] && unitY >= -unitW / 2) {
        unitY -= unitSpeed;  //up
        if(unitY < 0) {
            unitY = 0;
        }
    }

    if(keyPressOn["40"] && unitY <= height ) {
        unitY += unitSpeed;  //down
    }

    if(keyPressOn["37"] && unitX >= -unitW / 2) {
        unitX -= unitSpeed;  //left
        if(unitX < 0) {
            unitX = 0;
        }
    }

    if(keyPressOn["39"] && unitX <= width ) {
        unitX += unitSpeed;  //right
    }
}

// 유저와 장애물의 충돌 조건
function checkCrush() {
    for(var i in enemyList) {
        var tmp = enemyList[i];
        var playerDead = unitX > tmp.x - enemyW / 2
        && unitX < tmp.x + enemyW / 2
        && unitY > tmp.y - enemyW / 2
        && unitY < tmp.y + enemyW / 2;
        if(playerDead) {
            clearInterval(intervalId);
            // 게임 오버 화면 출력 부분 추가해주셈

        }
    }

}

// 객체 삭제 조건 확인
function checkMissileEnemyCrush() {
    for(var i in missileList) {
        var tmpM = missileList[i];
        for(var j in enemyList) {
            var tmpE = enemyList[j];

            var isShooted = tmpM.x > tmpE.x - enemyW / 2 
            && tmpM.x < tmpE.x + enemyW / 2 
            && tmpM.y > tmpE.y - enemyW / 2 
            && tmpM.y < tmpE.y + enemyW / 2;

            if(isShooted) {
                tmpE.isDead = true;
                tmpM.isShoot = true;
            }

        }
    }
}

// 객체 삭제 함수
function deadCheck(array) {
    for (var i = array.length - 1; i >= 0; i--){
        var tmp = array[i];
        if(tmp.isDead || tmp.isShoot) {
            array.splice(i, 1);
        }
    }
}

// 화면 갱신 주기
var intervalId = setInterval(drawscreen, 20);