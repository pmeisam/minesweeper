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
    score: 0
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
        $canvas.fadeIn();
        $(render()).toggle();
        $startBtn.toggle();
    });
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
        // gameOver = true;
        // alert("game over!!!");
    } else if ( gameOver === false ) {
        if( mineFinder(x,y) === 0 ) reveal(x,y);
        else {
            evt.target.src = `images/${mineFinder(x,y)}.png`;
            scoreBoard.textContent = `${++score}`; 
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
    if(evt.target.src !== "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png"){
        evt.target.src = minesweeper.flagImg;
        flagBoard.textContent = `${--mines}`;
    }else if(evt.target.src === "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png"){
        evt.target.src = minesweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;                               //I have to work on this part
    }   
});
function checkImage(a) {
    var url = "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/emptyBox.png";
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
    revealed = 0;
    var idx = (y*16) + x;
    var rows = minesweeper.rows;
    var columns = minesweeper.columns;
    // debugger
    var url = "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/emptyBox.png";
    if( mineFinder(x,y) === 0  && checkImage(idx) ){
        // && x >= 0 && y >= 0 && x < 16 && y < 16 && idx >= 0){
        revealed++;
        emptyBoxArray[idx].src = 'images/0.jpg';
        // if(mineFinder(x-1, y) === 0 && x > 0 ) reveal(x-1 ,y);
        // else if( (mineFinder(x-1,y) === 1 || mineFinder(x-1,y) === 2 || mineFinder(x-1,y) === 3 
        //     || mineFinder(x-1,y) === 4 )) {
        //     emptyBoxArray[idx-1].src = `images/${mineFinder(x-1,y)}.png`;
        // }
        // if(mineFinder(x+1,y) === 0  && x < rows -1 && x >= 0/*&& x < 15 && x >= 0 && y <= 15 && y >= 0 */) reveal(x+1, y);
        // else if( mineFinder(x+1,y) === 1 || mineFinder(x+1,y) === 2 || mineFinder(x+1,y) === 3 ||
        //      mineFinder(x+1,y) === 4 ){
        // emptyBoxArray[idx+1].src = `images/${mineFinder(x+1,y)}.png`;
        // } 
        if(mineFinder(x+1,y+1) === 0 && x < rows-1 && checkImage( idx + columns + 1 )) reveal(x+1, y+1); 
        else if( mineFinder(x+1,y+1) === 1 || mineFinder(x+1,y+1) === 2 || mineFinder(x+1,y+1) === 3 
            || mineFinder(x+1,y+1) === 4 ) {
        emptyBoxArray[idx+columns+1].src = `images/${mineFinder(x+1,y+1)}.png`;
        } 
        if(mineFinder(x+1,y-1) === 0 &&  checkImage(idx-columns-1) && x < rows-1/* && x < 15 && y >= 0 && y <= 15 && x >= 0*/) reveal(x+1,y-1);
        else if( mineFinder(x+1,y-1) === 1 || mineFinder(x+1,y-1) === 2 || mineFinder(x+1,y-1) === 3 
                || mineFinder(x+1,y-1) === 4  &&  checkImage(idx-columns-1)){
            emptyBoxArray[idx-columns-1].src = `images/${mineFinder(x+1,y-1)}.png`; 
        } 
        if(mineFinder(x-1,y+1) === 0 &&  checkImage(idx+columns-1).src === url && x > 0/*&& x >= 0 && y < 16 && x <15 */) reveal(x-1,y+1);
        else if( mineFinder(x-1,y+1) === 1 || mineFinder(x-1,y+1) === 2 || mineFinder(x-1,y+1) === 3 
                || mineFinder(x-1,y+1) === 4 || mineFinder(x-1,y+1) === 5 &&  checkImage(idx+columns+1)){
            emptyBoxArray[idx+columns-1].src = `images/${mineFinder(x-1,y+1)}.png`;
        } 
        if(mineFinder(x-1,y-1) === 0 &&  checkImage(idx-columns+1) && x > 0 && y > 0/* && x >= 1 && y > 1 && y <= 16 && x <= 16*/) reveal(x-1,y-1);
        else if( mineFinder(x-1,y-1) === 1 || mineFinder(x-1,y-1) === 2 || mineFinder(x-1,y-1) === 3 
                || mineFinder(x-1,y-1) === 4 || mineFinder(x-1,y-1) === 5 &&  checkImage(idx-columns+1)){
            emptyBoxArray[idx-columns+1].src = `images/${mineFinder(x-1,y-1)}.png`;
        } 
        if(mineFinder(x,y+1) === 0 &&  checkImage(idx+columns) && x < columns-1 /*&& y <= 16 &&  y >= 1 */) reveal(x,y+1);
        else if( (mineFinder(x,y+1) === 1 || mineFinder(x,y+1) === 2 || mineFinder(x,y+1) === 3 
                || mineFinder(x,y+1) === 4 || mineFinder(x,y+1) === 5) &&  checkImage(idx+columns)){
            emptyBoxArray[idx+columns].src = `images/${mineFinder(x,y+1)}.png`;
        } 
        if(mineFinder(x,y-1) === 0 && checkImage(idx-columns) && x >= 0  ) reveal(x,y-1);
        else if(( mineFinder(x,y-1) === 1 || mineFinder(x,y-1) === 2 || mineFinder(x,y-1) === 3 
                || mineFinder(x,y-1) === 4 || mineFinder(x,y-1) === 5 )&&  checkImage(idx-columns) ){
            emptyBoxArray[idx-columns].src = `images/${mineFinder(x,y-1)}.png`;
        } 
    
    
}
    
    
    // if(x === 15) return;
    
    

}




// if there is no mine around a box i want the box to be changed to the 0.png and check all the boxes around it 
//when checking the x and y next to it check if there is no bomb around them either
//if there is show me how many bombs if there isn't go to the next box again


//run test
//unit testing
//jasmine
//debugger
//console.log