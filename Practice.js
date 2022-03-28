function Block(number, hasMine, state) {
    this.number = number;
    this.hasMine = hasMine;
    this.state = state;
}

var x_i = [-1, -1, -1, 0, 0, 1, 1, 1];
var y_i = [-1, 0, 1, -1, 1, -1, 0, 1];

var gboard;
var start_time;
var time;
var intervalHandler;

window.onload = function () {
    start_time = new Date();
    intervalHandler = setInterval(function(){setTime(start_time);}, 1000);
    initialize();
}

function initialize() {
    document.getElementById("board").innerHTML = "";
    gboard = new Array(10);
    for(let i=0; i<10; i++) {
        gboard[i] = new Array(10);
        for(let k=0; k<10; k++) {
            gboard[i][k] = new Block(0, false, "inactive")
        }
    }
    clearInterval(intervalHandler);
    start_time = new Date();
    intervalHandler = setInterval(function(){setTime(start_time);}, 1000); 
    placeBlocks();
    placeMines();
}

/*
#########state overview##########
inactive: 클릭되지 않았으며, 활성화되지 않음
hasNum: 활성화되지 않았지만, 주위에 n 만큼의 폭탄이 있음
active: 활성화됨
mine: 폭탄
*/

function setTime(start_time) { //시간을 정해주는 함수
    checkWin();
    var time_now = new Date();
    var seconds = Math.floor((time_now-start_time)/1000);
    if(seconds>=60) {
        document.getElementById("stats").innerHTML = 
        "지난 시간: " + Math.floor(seconds/60) + "분 " + seconds%60 + "초";
    } else {
        document.getElementById("stats").innerHTML = 
        "지난 시간: " + seconds + "초";
    }
    
    time = seconds;
}

function placeBlocks() {
    var board_address = document.querySelector("#board");
    for(let i=0; i<10; i++) {
        for(let k=0; k<10; k++) {
            let newE = document.createElement("div");
            board_address.appendChild(newE);
            newE.setAttribute("class", "inactive");
            newE.id = ""+i+k;
            newE.onclick = function() {activate(""+i+k); checkWin()};
        }
    }
}

function placeMines() {
    let history = new Array;
    let cnt=0;
    do {
        let a = Math.floor(Math.random()*100);
        history[cnt++] = a;
        for(let k=0; k<cnt-1; k++) {
            if(history[k]==a) {
                cnt--;
                break;
            }
        }
    } while(cnt<10)

    for(let i=0; i<10; i++) {
        let y = Math.floor(history[i]/10);
        let x = history[i]%10;
        console.log(""+y+x+"\n");
        gboard[y][x].hasMine = true;
        gboard[y][x].state = "mine";
    }

    for(let i=0; i<10; i++) {
        for(let k=0; k<10; k++) {
            if(figNum(""+i+k) && !gboard[i][k].hasMine) gboard[i][k].state = "hasNum";
        }
    }
}

function activate(id) {
    let y = Number(id[0]);
    let x = Number(id[1]);
    let address = document.getElementById(""+id);
    if (gboard[y][x].state=="mine") {
        lose();
    } else if (gboard[y][x].state=="hasNum") {
        address.setAttribute("class", "active");
        address.innerHTML = gboard[y][x].number;
    } else if(gboard[y][x].state=="inactive") {
        address.setAttribute("class", "active");
        gboard[y][x].state = "active";
        for(let i=0; i<8; i++) {
            let ym = y+y_i[i];
            let xm = x+x_i[i];
            if(ym!=-1 && ym!=10 && xm!=-1 && xm!=10) {
                if (gboard[ym][xm].state == "inactive" || gboard[ym][xm].state == "hasNum") {
                    activate(""+ym+xm);
                }
            }
        }
    }
}

function figNum(place) {
    let y = Number(place[0]);
    let x = Number(place[1]);
    for(let i=0; i<8; i++) {
        let ym = y+y_i[i];
        let xm = x+x_i[i];
        if(ym!=-1 && ym!=10 && xm!=-1 && xm!=10) {
            if(gboard[ym][xm].hasMine) {
                gboard[y][x].number++;
            }
        }
    }
    if(gboard[y][x].number>0) return true;
    else false;
}

function checkWin() {
    let cnt = 0;
    for(let i=0; i<10; i++) {
        for(let k=0; k<10; k++) {
            if(document.getElementById(""+i+k).className=="inactive") cnt++;
        }
    }
    if(cnt==10) win();
}

function lose() {
    window.alert("폭탄을 누르셨군요... 패배하셨습니다.");
    initialize();
}

function win() {
    window.alert("축하드립니다!!\n" + time + "초 걸리셨습니다!");
    initialize();
}