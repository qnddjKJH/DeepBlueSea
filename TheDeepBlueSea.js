// 캔버스 크기
var width = 600;
var height = 900;

var count = 0;
var intervalId;

// 배경 정보
var backGroundImg = new Image();
backGroundImg.src = "./images/background.png";

var y1 = 0;
var y2 = -height;

// 키 입력 정보
// 동시 입력 구현
var keyPressOn = {};

// 플레이어 유닛 정보
var unit = new Image();         // 유닛의 이미지 정보
unit.src = "./images/unit.png";

var unitImg = unit;
var unitW = width / 5;          // 유닛의 크기

var unitX = width / 2;          // 유닛의 X좌표
var unitY = height - unitW;     // 유닛의 Y좌표

var unitSpeed;  // 유닛 이동 속도

// 미사일 정보
var missile = new Image();              // 미사일의 이미지 정보
missile.src = "./images/missile.png";
var missileSpeed;                       // 미사일의 속도
var missileW = unitW;                   // 미사일의 크기 
var missileList = [];

// 적 정보
var enemy1 = new Image();                   // 적 이미지 정보
var enemy2 = new Image();
enemy1.src = "./images/shark.png";
enemy2.src = "./images/boss-shark.png";

var enemyImg = [enemy1, enemy2];            // 적 이미지 타입을 위한 배열
var enemyW = width / 5;                     // 적 크기
var enemyX = [];                            // 적 X 좌표 배열 (고정 좌표)
var enemyList = [];                     
var enemySpeed;                             // 적 이동 속도



// 장애물 정보
var obstacle1 = new Image();                // 장애물 이미지 정보
var obstacle2 = new Image();
obstacle1.src = "./images/seefood.png";
obstacle2.src = "./images/rock.png";

var obstacleImg = [obstacle1, obstacle2];   // 장애물 이미지 타입을 위한 배열

var obstacleList = [];
var type = [];                              // 장애물 타입의 결정짓는 배열
var obstacleX = [];                         // 장애물 X 좌표 배열 (고정 좌표)
var obstacleW = width / 5;                  // 장애물 크기
var obstacleSpeed;                          // 장애물 이동 속도

// 로딩 페이지
// 스타트 버튼
function startClick() {
    var lobbyPage = document.getElementById("lobbyPage");
    var gamePage = document.getElementById("gamePage");

    lobbyPage.style.display="none";         // 로비 페이지를 숨기고
    gamePage.style.display="block";         // 게임 페이지로 넘기기

    init();     // 초기화 함수 실행
    intervalId = setInterval(drawscreen, 22);     // 0.022초 간격으로 반복 호출
}

// 변수 초기화 함수
function init() {
    count = 0;          
    keyPressOn = {};       // 동적 키 배열을 초기화

    y1 = 0;
    y2 = -height;       // 배경 두번재 Y 좌표 초기화


    // 리스트들을 전부 비워준다.
    missileList = [];
    enemyList = [];
    obstacleList = [];
    
    // 유닛 시작 좌표 지정
    unitX = width / 2;
    unitY = height - unitW;

    // 적 X 좌표 고정
    for (var i = 0; i < 5; i++) {
        var tmp = enemyW / 2 + enemyW * i;
        enemyX.push(tmp);
    }
    // 장애물 X 좌표 고정
    for(var i = 0; i < 5; i++ ) {
        var tmp = obstacleW / 2 + obstacleW * i;
        obstacleX.push(tmp);
    }

    // 각 속성들의 속도 지정.
    enemySpeed = height / 80;
    obstacleSpeed = height / 120;
    missileSpeed = height / 80;
    unitSpeed = 7;
}

// 화면 그리기
function drawscreen() {
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    
    context.drawImage(backGroundImg, 0, y1, width, height);
    context.drawImage(backGroundImg, 0, y2, width, height);


    // 동적 키보드 이벤트를 추가
    document.addEventListener("keydown", getKeyDown, false);
    document.addEventListener("keyup", getKeyUp, false);


    // 적, 장애물, 미사일 좌표에 따른 이미지를 캔버스에 그림.
    for(var i in missileList) {
        var tmp = missileList[i];
        context.drawImage(missile, tmp.x - (missileW / 2), tmp.y - missileW / 2, missileW, missileW - 30 );
    }

    for(var i in enemyList) {
        var tmp = enemyList[i];
        context.drawImage(enemyImg[tmp.type], tmp.x - enemyW / 2, tmp.y - enemyW / 2, enemyW + 30, enemyW);
    }
    
    for(var i in obstacleList) {
        var tmp = obstacleList[i];
        if(tmp.draw){
            context.drawImage(obstacleImg[tmp.type], tmp.x - obstacleW / 2, tmp.y - obstacleW / 2, obstacleW, obstacleW);
        }
    }

    // 유닛 캔버스에 그리기
    context.drawImage(unitImg, unitX - unitW / 2 + 10, unitY - unitW / 2, unitW- 10, unitW);

    backscroll();                       // 배경화면
    makemissile();                      // 미사일 생성
    moveMissile();                      // 미사일 이동
    makeenemy();                        // 적 생성
    moveenemy();                        // 적 이동
    makeObstacle();                     // 장애물 생성
    moveObstacle();                     // 장애물 이동
    calcUnint();                        // 키보드 입력에 따른 유닛 위치 계산
    deadCheck(missileList);             // 미사일 제거
    deadCheck(enemyList);               // 적 제거
    checkMissileEnemyCrush();           // 미사일과 적의 충돌 검사 
    checkCrushEenmy();                  // 유닛과 적의 충돌 검사
    checkCrush();                       // 유닛과 장애물의 충돌 검사
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
        var type = 0;
        if((parseInt(Math.random() * 10) + 10) % 10 == 0){
            type = 1;
        }
        obj.type = type;
        if(obj.type == 0) { // 일반 상어 type = 0
            obj.energy = 1;
        } else if(obj.type == 1) {// 해적 상어  type = 1
            obj.energy = 3;
        } ;
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

// 키보드 입력 처리 함수
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

// 유닛 좌표 계산
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

// 유저와 적기의 충돌 조건
function checkCrushEenmy() {
    for(var i in enemyList) {
        var tmp = enemyList[i];
        var playerDead = unitX > tmp.x - enemyW / 2
        && unitX < tmp.x + enemyW / 2
        && unitY > tmp.y - enemyW / 2
        && unitY < tmp.y + enemyW / 2;
        if(playerDead) {
            clearInterval(intervalId);
            // 게임 오버 화면 출력 부분 추가해주셈
            // 추가 완료.
            gameOver();
        }
    }
}

// 유저와 장애물의 충돌 조건
function checkCrush() {
    for(var i in obstacleList) {
        var tmp = obstacleList[i];
        var playerDead = unitX > tmp.x - obstacleW / 2
        && unitX < tmp.x + obstacleW / 2
        && unitY > tmp.y - obstacleW / 2
        && unitY < tmp.y + obstacleW / 2
        && tmp.draw

        if(playerDead) {
            clearInterval(intervalId);
            gameOver();
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
                tmpE.energy -= 1;
                if(tmpE.energy == 0) {
                    tmpE.isDead = true; // 적 격추
                }
                tmpM.isShoot = true;    // 미사일 격추
            }

        }
    }
}

// 객체 삭제 함수
function deadCheck(array) {
    for (var i = array.length - 1; i >= 0; i--){
        var tmp = array[i];
        if(tmp.isDead || tmp.isShoot) {
            array.splice(i, 1); // 배열에서 해당 적 혹은 미사일 제거
        }
    }
}

// 장애물 생성 함수
function makeObstacle() {
    var randomnum = (parseInt(Math.random() * 30)) - 10;

    if(randomnum != 10) {
        return ;
    }

    for (var i = 0; i < 5; i++) {
        var obj = {};
        obj.draw = false;
        if((parseInt(Math.random() * 60)) % 9 == 0) {
            obj.draw = true;
        }
        obj.x = obstacleX[i];
        obj.y = -50;
        obj.isCrush = false;
        var type = (parseInt(Math.random() * 2))
        obj.type = type;
        obstacleList.push(obj);
    }
}

// 장애물 이동 함수
function moveObstacle() {
    for(var i in obstacleList) {
        var tmp = obstacleList[i];
        tmp.y = tmp.y + obstacleSpeed;

        if(tmp.y > height + obstacleW / 2) {
            tmp.isCrush = true;
        }
    }
}

// 게임 오버 함수
function gameOver() {
    var gameOverPage = document.getElementById("gameOverDiv");

    gameOverPage.style.display = "block";   // 게임오버 페이지 가시화
}

// 재시작 버튼 클릭 함수
function restart() {
    var lobbyPage = document.getElementById("lobbyPage");
    var gamePage = document.getElementById("gamePage");
    var gameOverPage = document.getElementById("gameOverDiv");

    lobbyPage.style.display = "block";  // 로비로 돌아감
    gamePage.style.display = "none";    // 게임페이지 숨김
    gameOverPage.style.display = "none";    // 게임오버페이지 숨김
}