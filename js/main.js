/*----- constants -----*/
const minesweeper = {
    oneImg: 'images/1.png',
    twoImg: 'images/2.png',
    threeImg: 'images/3.png',
    fourImg: 'images/4.png',
    fiveImg: 'images/5.png',
    sixImg: 'images/6.png',
    sevenImg: 'images/7.png',
    eightImg: 'images/8.png)',
    mineImg: 'images/mine.jpg',
    flagImg: 'images/flag.png',
    emptyBox: 'images/emptyBox.png',
    rows: 16,
    columns: 16,
    mines: 50,
    revealed: 0,
    flags: 0,
    numbers: 0
};
const sound = new Audio('sounds/explosion.mp3');
/*----- variables -----*/
var width, mobWidth, gameTime, cells, emptyBoxArray, mineArray, revealArray, mines, gameOver, score, revealed;
var time = 00;
var minute = 00;
/*----- cached element references -----*/
const canvas = document.querySelector('.canvas');
const main = document.querySelector('main');
const scoreBoard = document.querySelector(".scoreboard");
const flagBoard = document.querySelector(".flagboard");

/*----- event listeners -----*/
var $startBtn = $(".start");
var $canvas = $("main");
canvas.addEventListener('click', play);

/*----- functions -----*/
init();

function init() {
    cells = {
        x: 0,
        y: 0
    }
    emptyBoxArray = [];
    mineArray = [];
    revealArray = [];
    mines = 0;
    gameOver = false;
    score = 1;
    revealed = 0;
    width = 0;
    mobWidth = 0;
}

function render() {
    var count = 0;
    for (var j = 0; j < minesweeper.rows; j++) {
        cells.x = 0;
        for (var i = 0; i < minesweeper.columns - 1; i++) {
            emptyBoxArray[count] = document.createElement('img');
            emptyBoxArray[count].src = minesweeper.emptyBox;
            emptyBoxArray[count].setAttribute("datax", cells.x);
            emptyBoxArray[count].setAttribute("datay", cells.y);
            emptyBoxArray[count].id = count;
            canvas.appendChild(emptyBoxArray[count]);
            count++;
            cells.x++;
        }
        emptyBoxArray[count] = document.createElement('img');
        emptyBoxArray[count].src = minesweeper.emptyBox;
        emptyBoxArray[count].setAttribute("datax", cells.x);
        emptyBoxArray[count].setAttribute("datay", cells.y);
        emptyBoxArray[count].id = count;
        canvas.appendChild(emptyBoxArray[count]);
        cells.y++;
        count++;
    }
    while (mines < minesweeper.mines) {
        var i = Math.floor(Math.random() * minesweeper.rows * minesweeper.columns);
        if (!mineArray.includes(i)) {
            mineArray.push(i);
            mines++;
        }
    }
    for (var i = 0; i < minesweeper.rows * minesweeper.columns; i++) {
        if (mineArray.includes(i))
            revealArray[i] = 'mine';
        else
            revealArray[i] = 0
    }
    
}

var startBtn = $startBtn.on('click', function () {
    minesweeper.mines = parseInt($(".minesnum").val());
    minesweeper.rows = parseInt($(".rownum").val());
    minesweeper.columns = parseInt($(".rownum").val());
    width = (minesweeper.columns * 30) + 5;
    // if ( minesweeper.columns > 35){
    //     width = (minesweeper.columns * 25) + 5;
    //     $('img').css("width","25px");
    // }
    mobWidth = (minesweeper.columns * 19) + 5;
    // $("main").css('width', `${mobWidth}px`);
    var x = window.matchMedia("(min-width: 768px)")
    myFunction(x) // Call listener function at run time
    x.addListener(myFunction) 
    function myFunction(x) {
        if (x.matches) { // If media query matches
            $('main').css('width', `${width}`);
        } else {
            $('main').css('width', `${mobWidth}`);
        }
    }
    $canvas.fadeIn(3000);
    $canvas.css('display','flex');
    $(render()).toggle(3000);
    $startBtn.toggle(3000);
    $('.inputs').fadeOut(2000);
    timer();
});

$('.resetgame').on('click', function(){
    window.location.href = "http://www.meisam.org/minesweeper/index.html";
});

function play(evt) {
    var x = parseInt(evt.target.id % minesweeper.rows);
    var y = parseInt(Math.floor(evt.target.id / minesweeper.columns));
    var idx = parseInt(evt.target.id);
    console.log(`(${x},${y})`);
    console.log(evt.target);
    console.log(idx);

    if(evt.target.id === NaN) return;
    if (mineArray.includes(idx)) {
        evt.target.src = minesweeper.mineImg;
        for (var i = 0; i < minesweeper.mines; i++)
            emptyBoxArray[mineArray[i]].src = minesweeper.mineImg;
        sound.play();
        gameOver = true;
        $(".winboard p").html(`You Lost hahaha ;)<br>Time: ${gameTime}`);
        $(".winboard").css("backgroundColor", "rgba(233,77,96,0.7)");
        $(".winboard").css('display', 'flex');
        $('.resetgame').css('display', 'block');
        $('main').css('display', 'fixed');
        document.querySelector('.faceImg').src = "images/dead.png"
    } else if (gameOver === false) {
        if (mineFinder(x, y) === 0) reveal(x, y);
        else if(evt.target != $(".canvas") ){
            evt.target.src = `images/${mineFinder(x, y)}.png`;
            scoreBoard.textContent = `${score++}`;
            minesweeper.numbers++;
        }
    }
}

function mineFinder(a, b) {
    var count = 0;
    if (arrayCheck((a - 1), (b - 1))) count++;
    if (arrayCheck((a), (b - 1))) count++;
    if (arrayCheck((a + 1), (b - 1))) count++;
    if (arrayCheck((a - 1), (b))) count++;
    if (arrayCheck((a + 1), (b))) count++;
    if (arrayCheck((a - 1), (b + 1))) count++;
    if (arrayCheck((a), (b + 1))) count++;
    if (arrayCheck((a + 1), (b + 1))) count++;
    return count;
}

var arrayCheck = function (a, b) {
    if (a < minesweeper.rows && b < minesweeper.columns && a >= 0 && b >= 0) {
        if (mineArray.includes((b * minesweeper.columns) + a)) {
            return true;
        } else return false;
    } else return false;
}

$(function(){
    $( "main" ).bind( "taphold", tapholdHandler );
    function tapholdHandler( evt ){
      $( event.target ).preventDefault();
      if (!emptyBoxArray[evt.target.id].src.includes('images/flag.png')  && checkImage(evt.target.id)) {
        evt.target.src = minesweeper.flagImg;
        minesweeper.flags++;
        flagBoard.textContent = `${--mines}`;
        if (mines <= 0) {
            // $('.winboard p').css('fontSize',"40px");
            $(".winboard p").html(`You Unfortunately Won :(<br>Time: ${gameTime}`);
            $(".winboard").css("backgroundColor", "rgba(97,207,78,0.7)");
            $(".winboard").css('display', 'flex');
            $('.resetgame').css('display', 'block');
            // $('.resetgame').css('margin-top', '-30px');
            $('main').css('display', 'fixed');
            document.querySelector('.faceImg').src = "images/sunglasses.jpg"
        }
    } else if (emptyBoxArray[evt.target.id].src.includes('images/flag.png') ) {
        evt.target.src = minesweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;
        minesweeper.flags--;                             //I have to work on this part
    }
    }
});

$canvas.on('contextmenu', function (evt) {
    evt.preventDefault();
    if (!emptyBoxArray[evt.target.id].src.includes('images/flag.png')  && checkImage(evt.target.id)) {
        evt.target.src = minesweeper.flagImg;
        minesweeper.flags++;
        flagBoard.textContent = `${--mines}`;
        if (mines <= 0) {
            // $('.winboard p').css('fontSize',"40px");
            $(".winboard p").html(`You Unfortunately Won :( <br>Time: ${gameTime}`);
            $(".winboard").css("backgroundColor", "rgba(97,207,78,0.7)");
            $(".winboard").css('display', 'flex');
            $('.resetgame').css('display', 'block');
            // $('.resetgame').css('margin-top', '-30px');
            $('main').css('display', 'fixed');
            document.querySelector('.faceImg').src = "images/sunglasses.jpg"
        }
    } else if (emptyBoxArray[evt.target.id].src.includes('images/flag.png') ) {
        evt.target.src = minesweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;
        minesweeper.flags--;                             //I have to work on this part
    }
});

function checkImage(a) {
    if (a <= 0) a = 0;
    else if (a >= minesweeper.columns*minesweeper.rows) a = minesweeper.columns*minesweeper.rows;
    if (emptyBoxArray[a].src.includes('images/emptyBox.png')) return true;
    else return false;
}

function reveal(x, y) {
    var idx = (y * minesweeper.columns) + x;
    var rows = minesweeper.rows;
    var columns = minesweeper.columns;
    // debugger
    if( x < 0 && y < 0 && x >= rows && y >= columns) return;
    else if( checkImage(idx) && mineFinder(x,y) === 0){
        emptyBoxArray[idx].src = 'images/0.jpg';
        scoreBoard.textContent = `${score++}`;
        if(mineFinder(x-1,y)===0 && x>0) reveal(x-1,y);
        else if(mineFinder(x-1,y) !== 0 && x>0){
            emptyBoxArray[idx-1].src = `images/${mineFinder(x-1,y)}.png`;
            scoreBoard.textContent = `${score++}`;
        }
        if(mineFinder(x+1,y)===0 && x < rows-1) reveal(x+1,y); 
        else if(mineFinder(x+1,y) !== 0 && x < rows - 1){
            emptyBoxArray[idx+1].src=`images/${mineFinder(x+1,y)}.png`;
            scoreBoard.textContent = `${score++}`;
        } 
        if(mineFinder(x,y+1)===0 && y < columns-1) reveal(x,y+1);
        else if(mineFinder(x,y+1) !==0 && y < columns-1){
            emptyBoxArray[idx+columns].src=`images/${mineFinder(x,y+1)}.png`;
            scoreBoard.textContent = `${score++}`;
        } 
        if(mineFinder(x,y-1) === 0 && y > 0) reveal(x,y-1);
        else if(mineFinder(x,y-1) !== 0 && y > 0) {
            emptyBoxArray[idx-columns].src=`images/${mineFinder(x,y-1)}.png`;
            scoreBoard.textContent = `${score++}`;
        }
        if(mineFinder(x-1,y-1) === 0 && x > 0 && y > 0) reveal(x-1,y-1);
        else if(mineFinder(x-1,y-1) !== 0 && x > 0 && y > 0) {
            emptyBoxArray[idx-columns-1].src = `images/${mineFinder(x-1,y-1)}.png`;    
            scoreBoard.textContent = `${score++}`;
        }
        if(mineFinder(x+1,y-1) === 0 && x < columns-1 && y > 0 ) reveal(x+1,y-1);
        else if(mineFinder(x+1,y-1) !== 0 && x < columns-1 && y > 0 ) {
            emptyBoxArray[idx - columns+1].src = `images/${mineFinder(x+1,y-1)}.png`;
            scoreBoard.textContent = `${score++}`;
        }
        if(mineFinder(x-1,y+1) === 0 && x > 0 && y < columns-1) reveal(x-1,y+1);
        else if(mineFinder(x-1,y+1) !== 0 && x > 0 && y < columns-1) {
            emptyBoxArray[idx+columns-1].src = `images/${mineFinder(x-1,y+1)}.png`;
            scoreBoard.textContent = `${score++}`;
        }
        if(mineFinder(x+1,y+1) === 0 && x < columns-1 && y < columns-1) reveal(x+1,y+1);
        else if(mineFinder(x+1,y+1) !== 0 && x < columns-1 && y < columns-1) {
            emptyBoxArray[idx+columns+1].src = `images/${mineFinder(x+1,y+1)}.png`;
            scoreBoard.textContent = `${score++}`;
        }  
    }
}

function timer(){
    setTimeout(function(){
        var timerDiv = document.querySelector('.timer');
        time++;
        if(time === 60){
            minute++;
            time = 0;
        }
        timerDiv.textContent = `${minute}:${time}`;
        // console.log(time);
        timer();
        gameTime = `${minute}:${time}`;
    },1000)
}
//run test
//unit testing
//jasmine
//debugger
//console.log



//the bottom part is givin me trouble
