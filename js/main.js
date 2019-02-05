/*----- constants -----*/
const minesweeper = {
    oneImg: 'images/1.png',
    twoImg: 'images/2.png',
    threeImg: 'images/2.png',
    fourImg: 'images/2.png',
    fiveImg: 'images/2.png',
    sixImg: 'images/2.png',
    sevenImg: 'images/2.png',
    eightImg: 'images/2.png',
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
/*----- app's state (variables) -----*/
var cells, emptyBoxArray, mineArray, emptyBox, mine, current, gameOver, score, reveal, revealed;
/*----- cached element references -----*/
var canvas = document.querySelector('.canvas');
var main = document.querySelector('main');
var scoreBoard = document.querySelector(".scoreboard");
var flagBoard = document.querySelector(".flagboard");
/*----- event listeners -----*/
var $startBtn =  $(".start");
var $canvas = $("main");
canvas.addEventListener('click', play);
/*----- functions -----*/
init();
function init(){
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
    $startBtn.on('click', function(){
        $canvas.fadeIn(3000);
        $(render()).toggle(3000);
        $startBtn.toggle(3000);
    });
    revealed = 0;
}
function render(){
    console.log("meisam");
    var count = 0;
    for(var j = 0; j < minesweeper.columns; j++){
        cells.x=0;
        for(var i = 0; i < minesweeper.rows-1 ; i++){
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
    while(mines < minesweeper.mines) {
        var i = Math.floor(Math.random() * minesweeper.rows * minesweeper.columns );
        if(!mineArray.includes(i)){
            mineArray.push(i);
            mines++;
        }
    }
    for(var i = 0; i < minesweeper.rows * minesweeper.columns ; i++ ){
        if(mineArray.includes(i))
            revealArray[i] = 'mine';
        else
            revealArray[i]=0
    }
    console.log(mineArray);
}
function play(evt) {
    var x = parseInt( evt.target.id% minesweeper.rows );
    var y = parseInt(Math.floor( evt.target.id / minesweeper.columns ));
    var idx = parseInt( evt.target.id );
    console.log(`(${x},${y})`);
    console.log(evt.target);
    console.log(idx);
    if( mineArray.includes(idx) ){
        evt.target.src = minesweeper.mineImg;
        for(var i = 0; i < minesweeper.mines; i++){
            emptyBoxArray[mineArray[i]].src = minesweeper.mineImg;
        }
        gameOver = true;
        alert("game over!!!");
    } else if ( gameOver === false ) {
        if( mineFinder(x,y) === 0 ) reveal(x,y);
        else {
            evt.target.src = `images/${mineFinder(x,y)}.png`;
            scoreBoard.textContent = `${++score}`; 
            minesweeper.numbers++;
            if(minesweeper.numbers + minesweeper.flags + revealed === emptyBoxArray.length){
                alert("YOU WON!");
            }
        } 
    }
}
function mineFinder(a,b) {
    var count = 0;
        if ( arrayCheck((a-1),(b-1))) count++;
        if ( arrayCheck((a),(b-1))) count++;
        if ( arrayCheck((a+1),(b-1))) count++;
        if ( arrayCheck((a-1),(b))) count++;
        if ( arrayCheck((a+1),(b))) count++;
        if ( arrayCheck((a-1),(b+1))) count++;
        if ( arrayCheck((a),(b+1))) count++;
        if ( arrayCheck((a+1),(b+1))) count++;
        return count;
}
var arrayCheck = function (a,b){
    if (a < minesweeper.rows && b < minesweeper.columns && a >= 0 && b >= 0){
        if(mineArray.includes((b*minesweeper.columns)+a)){
            return true;
        }else return false;
    }else return false;
}
$canvas.on('contextmenu', function(evt){
    evt.preventDefault();
    if(evt.target.src !== "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png" && checkImage(evt.target.id)){
        evt.target.src = minesweeper.flagImg;
        minesweeper.flags++;
        flagBoard.textContent = `${--mines}`;
    }else if(evt.target.src === "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png"){
        evt.target.src = minesweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;  
        minesweeper.flags--;                             //I have to work on this part
    }   
});
function checkImage(a) {
    var url = "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/emptyBox.png";
    // var url = "images/emptyBox.png";
    if ( a <= 0 ){
        a = 0; 
    }else if ( a >= 255){
        a = 255;
    }
    console.log(a);
    if(emptyBoxArray[a].src === url)
        return true;
    else return false;
}
function reveal(x,y){
    var idx = (y*16) + x;
    var rows = minesweeper.rows;
    var columns = minesweeper.columns;
    // debugger
    if( mineFinder(x,y) === 0  && checkImage(idx) ){
        revealed++;
        emptyBoxArray[idx].src = 'images/0.jpg';
        if(mineFinder(x-1, y) === 0 && x > 0 && x < 16 ) reveal(x-1 ,y);                                      //revealing to the left
        else if( (mineFinder(x-1,y) === 1 || mineFinder(x-1,y) === 2 || mineFinder(x-1,y) === 3 
            || mineFinder(x-1,y) === 4 )) {
            emptyBoxArray[idx-1].src = `images/${mineFinder(x-1,y)}.png`;
            minesweeper.numbers++;
        }
        if(mineFinder(x+1,y) === 0  && x < rows -1 && x >= 0) reveal(x+1, y);                       //reealing to the right
        else if( mineFinder(x+1,y) === 1 || mineFinder(x+1,y) === 2 || mineFinder(x+1,y) === 3 ||
             mineFinder(x+1,y) === 4 ){
            emptyBoxArray[idx+1].src = `images/${mineFinder(x+1,y)}.png`;
            minesweeper.numbers++;
        } 
        if(mineFinder(x+1,y+1) === 0 && x < rows-1 && checkImage( idx + columns + 1 ) && y < 15) reveal(x+1, y+1);      //revealing to the bottom right
        else if( mineFinder(x+1,y+1) === 1 || mineFinder(x+1,y+1) === 2 || mineFinder(x+1,y+1) === 3 
            || mineFinder(x+1,y+1) === 4 ) {
            emptyBoxArray[idx+columns+1].src = `images/${mineFinder(x+1,y+1)}.png`;
            minesweeper.numbers++;
        } 
        if(mineFinder(x+1,y-1) === 0 &&  checkImage(idx-columns+1)  && y > 0 && x < rows-1) reveal(x+1,y-1);   //revealing to the up right
        else if( mineFinder(x+1,y-1) === 1 || mineFinder(x+1,y-1) === 2 || mineFinder(x+1,y-1) === 3 
                || mineFinder(x+1,y-1) === 4){
            emptyBoxArray[idx-columns+1].src = `images/${mineFinder(x+1,y-1)}.png`; 
            minesweeper.numbers++;
        } 
        if(mineFinder(x-1,y+1) === 0 &&  checkImage(idx+columns-1) && x > 0 && y < columns-1) reveal(x-1,y+1);                   //revealing to the bottom left
        else if( mineFinder(x-1,y+1) === 1 || mineFinder(x-1,y+1) === 2 || mineFinder(x-1,y+1) === 3 
                || mineFinder(x-1,y+1) === 4 || mineFinder(x-1,y+1) === 5 &&  checkImage(idx+columns+1)){
            emptyBoxArray[idx+columns-1].src = `images/${mineFinder(x-1,y+1)}.png`;
            minesweeper.numbers++;
        } 
        if(mineFinder(x-1,y-1) === 0 &&  checkImage(idx-columns+1) && x > 0 && y > 0 ) reveal(x-1,y-1);         //revealing to the up left
        else if( mineFinder(x-1,y-1) === 1 || mineFinder(x-1,y-1) === 2 || mineFinder(x-1,y-1) === 3 
                || mineFinder(x-1,y-1) === 4 || mineFinder(x-1,y-1) === 5 &&  checkImage(idx-columns+1)){
            emptyBoxArray[idx-columns-1].src = `images/${mineFinder(x-1,y-1)}.png`;
            minesweeper.numbers++;
        } 
        if(mineFinder(x,y-1) === 0 && checkImage(idx-columns) && x >= 0 && y > 0  ) reveal(x,y-1);              //revealing toward up
        else if(( mineFinder(x,y-1) === 1 || mineFinder(x,y-1) === 2 || mineFinder(x,y-1) === 3 
                || mineFinder(x,y-1) === 4 || mineFinder(x,y-1) === 5 )&&  checkImage(idx-columns) ){
            emptyBoxArray[idx-columns].src = `images/${mineFinder(x,y-1)}.png`;
            minesweeper.numbers++;
        } 
    }
}

//run test
//unit testing
//jasmine
//debugger
//console.log