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
    score: 0,
    numbers: 0
};
var timer;
const sound = new Audio('sounds/explosion.mp3');

/*----- app's state (variables) -----*/
var cells, emptyBoxArray, mineArray, gameOver, score, revealed;

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
    score = 0;
    $startBtn.on('click', function () {
        $canvas.fadeIn(3000);
        $(render()).toggle(3000);
        $startBtn.toggle(3000);
    });
    revealed = 0;
    timer = Date.now();
}

function render() {
    var count = 0;
    for (var j = 0; j < minesweeper.columns; j++) {
        cells.x = 0;
        for (var i = 0; i < minesweeper.rows - 1; i++) {
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

$('.resetgame').on('click', function(){
                                                                    //reset function
});

function play(evt) {
    var x = parseInt(evt.target.id % minesweeper.rows);
    var y = parseInt(Math.floor(evt.target.id / minesweeper.columns));
    var idx = parseInt(evt.target.id);
    console.log(`(${x},${y})`);
    console.log(evt.target);
    console.log(idx);
    if (mineArray.includes(idx)) {
        evt.target.src = minesweeper.mineImg;
        for (var i = 0; i < minesweeper.mines; i++) {
            emptyBoxArray[mineArray[i]].src = minesweeper.mineImg;

        }
        sound.play();
        gameOver = true;
        $(".winboard p").html("You Lost hahaha ;)");
        $(".winboard").css("backgroundColor", "rgba(233,77,96,0.7)");
        $(".winboard").css('display', 'flex');
        $('.resetgame').css('display', 'block');
        $('main').css('display', 'fixed');
        document.querySelector('.faceImg').src = "images/dead.png"
    } else if (gameOver === false) {
        if (mineFinder(x, y) === 0) reveal(x, y);
        else {
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

$canvas.on('contextmenu', function (evt) {
    evt.preventDefault();
    if (!emptyBoxArray[evt.target.id].src.includes('images/flag.png')  && checkImage(evt.target.id)) {
        evt.target.src = minesweeper.flagImg;
        minesweeper.flags++;
        flagBoard.textContent = `${--mines}`;
        if (mines <= 0) {
            $(".winboard p").html("You Unfortunately Won :(");
            $(".winboard").css("backgroundColor", "rgba(97,207,78,0.7)");
            $(".winboard").css('display', 'flex');
            $('.resetgame').css('display', 'block');
            $('main').css('display', 'fixed');
        }
    } else if (emptyBoxArray[evt.target.id].src.includes('images/flag.png') ) {
        evt.target.src = minesweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;
        minesweeper.flags--;                             //I have to work on this part
    }
});

function checkImage(a) {
    if (a <= 0) a = 0;
    else if (a >= 255) a = 255;
    if (emptyBoxArray[a].src.includes('images/emptyBox.png')) return true;
    else return false;
}

function reveal(x, y) {
    var idx = (y * 16) + x;
    var rows = minesweeper.rows;
    var columns = minesweeper.columns;
    // debugger
    if (mineFinder(x, y) === 0 && checkImage(idx)) {
        revealed++;
        scoreBoard.textContent = `${score++}`;
        emptyBoxArray[idx].src = 'images/0.jpg';
        
        if (mineFinder(x - 1, y) === 0 && checkImage(idx - 1)  && x > 0 && x < rows ) reveal(x - 1, y);                                      //revealing to the left
        else if ((mineFinder(x - 1, y) === 1 || mineFinder(x - 1, y) === 2 || mineFinder(x - 1, y) === 3
            || mineFinder(x - 1, y) === 4)) {
            emptyBoxArray[idx - 1].src = `images/${mineFinder(x - 1, y)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
        if (mineFinder(x, y - 1) === 0 && checkImage(idx - columns) && y >= 0  ) reveal(x, y - 1);              //revealing toward up
        else if ((mineFinder(x, y - 1) === 1 || mineFinder(x, y - 1) === 2 || mineFinder(x, y - 1) === 3
            || mineFinder(x, y - 1) === 4 || mineFinder(x, y - 1) === 5) /*&& checkImage(idx - columns)*/) {
                emptyBoxArray[idx - columns].src = `images/${mineFinder(x, y - 1)}.png`;
                minesweeper.numbers++;
                scoreBoard.textContent = `${score++}`;
            }
        if (mineFinder(x + 1, y) === 0 && x < rows - 1 && x < rows && x >= 0) reveal(x + 1, y);                       //revealing to the right
        else if (mineFinder(x + 1, y) === 1 || mineFinder(x + 1, y) === 2 || mineFinder(x + 1, y) === 3 ||
        mineFinder(x + 1, y) === 4) {
            emptyBoxArray[idx + 1].src = `images/${mineFinder(x + 1, y)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
        if (mineFinder(x, y + 1) === 0 && checkImage(idx + columns) && y < rows-1 && y>= 0) reveal(x, y + 1);              //revealing toward down
        else if ((mineFinder(x, y + 1) === 1 || mineFinder(x, y + 1) === 2 || mineFinder(x, y + 1) === 3
            || mineFinder(x, y + 1) === 4 ) /*&& checkImage(idx + columns)*/) {
            emptyBoxArray[idx + columns].src = `images/${mineFinder(x, y + 1)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
        if (mineFinder(x + 1, y + 1) === 0 && x < rows - 1 && checkImage(idx + columns + 1) && y < columns - 2 && x < rows - 2) reveal(x + 1, y + 1);      //revealing to the bottom right
        else if (mineFinder(x + 1, y + 1) === 1 || mineFinder(x + 1, y + 1) === 2 || mineFinder(x + 1, y + 1) === 3
            || mineFinder(x + 1, y + 1) === 4) {
            emptyBoxArray[idx + columns + 1].src = `images/${mineFinder(x + 1, y + 1)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
        if (mineFinder(x - 1, y + 1) === 0 && checkImage(idx + columns - 1) && x > 0 && y < columns - 1) reveal(x - 1, y + 1);                   //revealing to the bottom left
        else if (mineFinder(x - 1, y + 1) === 1 || mineFinder(x - 1, y + 1) === 2 || mineFinder(x - 1, y + 1) === 3
            || mineFinder(x - 1, y + 1) === 4 || mineFinder(x - 1, y + 1) === 5  && x >= 0 && y >= 0 && y < columns && x < rows/*&& checkImage(idx + columns + 1)*/) {
            emptyBoxArray[idx + columns - 1].src = `images/${mineFinder(x - 1, y + 1)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
        if (mineFinder(x + 1, y - 1) === 0 && checkImage(idx - columns + 1)  && x < rows - 2  ) reveal(x + 1, y - 1);   //revealing to the up right
        else if (mineFinder(x + 1, y - 1) === 1 || mineFinder(x + 1, y - 1) === 2 || mineFinder(x + 1, y - 1) === 3
            || mineFinder(x + 1, y - 1) === 4) {
            emptyBoxArray[idx - columns + 1].src = `images/${mineFinder(x + 1, y - 1)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
       }
        if (mineFinder(x - 1, y - 1) === 0 && checkImage(idx - columns - 1) && x > 0 && y > 0 && y < columns) reveal(x - 1, y - 1);         //revealing to the up left
        else if (mineFinder(x - 1, y - 1) === 1 || mineFinder(x - 1, y - 1) === 2 || mineFinder(x - 1, y - 1) === 3
            || mineFinder(x - 1, y - 1) === 4 || mineFinder(x - 1, y - 1) === 5 && x >= 0 && y >= 0 && y < columns && x < rows) {
            emptyBoxArray[idx - columns - 1].src = `images/${mineFinder(x - 1, y - 1)}.png`;
            minesweeper.numbers++;
            scoreBoard.textContent = `${score++}`;
        }
    
    }
    
}
console.log(mineArray);
//run test
//unit testing
//jasmine
//debugger
//console.log



//the bottom part is givin me trouble
