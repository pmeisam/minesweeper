/*----- constants -----*/
const mineSweeper = {
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
}
function render(){
    console.log("meisam");
    var count = 0;
    for(var j = 0; j < 16; j++){
        cells.x=0;
        for(var i = 0; i < 15; i++){
            emptyBoxArray[count] = document.createElement('img');
            emptyBoxArray[count].src = mineSweeper.emptyBox;
            emptyBoxArray[count].setAttribute("datax", cells.x);
            emptyBoxArray[count].setAttribute("datay", cells.y);
            emptyBoxArray[count].id = count;
            canvas.appendChild(emptyBoxArray[count]);
            
            count++;
            cells.x++;
        }
        emptyBoxArray[count] = document.createElement('img');
        emptyBoxArray[count].src = mineSweeper.emptyBox;
        emptyBoxArray[count].setAttribute("datax", cells.x);
        emptyBoxArray[count].setAttribute("datay", cells.y);
        emptyBoxArray[count].id = count;
        canvas.appendChild(emptyBoxArray[count]);
        cells.y++;
        count++;
    }
    while(mines < 50) {
        var i = Math.floor(Math.random() * 255 );
        if(!mineArray.includes(i)){
            mineArray.push(i);
            mines++;
        }
    }
    for(var i = 0; i <= 256; i++ ){
        if(mineArray.includes(i))
            revealArray[i] = 'mine';
        else
            revealArray[i]=0
    }
    console.log(mineArray);
}
function play(evt) {
    var x = parseInt(evt.target.id%16);
    var y = parseInt(Math.floor(evt.target.id/16));
    var idx = parseInt(evt.target.id);
    console.log(`(${x},${y})`);
    console.log(evt.target);
    console.log(idx);
    
    if( mineArray.includes(parseInt(evt.target.id)) ){
        evt.target.src = mineSweeper.mineImg;
        for(var i = 0; i < 256; i++){
            emptyBoxArray[mineArray[i]].src = mineSweeper.mineImg;
        }
        // gameOver = true;
        // alert("game over!!!");
    } else if (gameOver === false) {
        var count = 0;
        if ( arrayCheck((x-1),(y-1))) count++;
        if ( arrayCheck((x),(y-1))) count++;
        if ( arrayCheck((x+1),(y-1))) count++;
        if ( arrayCheck((x-1),(y))) count++;
        if ( arrayCheck((x+1),(y))) count++;
        if ( arrayCheck((x-1),(y+1))) count++;
        if ( arrayCheck((x),(y+1))) count++;
        if ( arrayCheck((x+1),(y+1))) count++;
        if ( count === 0 ) reveal(idx);
        // if(count === 0 && !arrayCheck(x-2,y-2) && !arrayCheck(x-1,y-2) && !arrayCheck(x,y-2) && !arrayCheck(x+1,y-2) &&
        //     !arrayCheck(x+2,y-2) && !arrayCheck(x-2,y-1) && !arrayCheck(x+2, y-1 ) && !arrayCheck(x-2, y) && !arrayCheck(x+2, y) &&
        //     !arrayCheck(x-2,y+1) && !arrayCheck(x+2,y+1) && !arrayCheck(x-2,y+2) && !arrayCheck(x+2,y+2) && !arrayCheck(x-1,y+2)&&
        //      !arrayCheck(x,y+2)&& !arrayCheck(x+1,+2) ){ reveal(idx); }
        else {
            evt.target.src = `images/${count}.png`;
            scoreBoard.textContent = `${++score}`;
        }
       
    }
}
var arrayCheck = function (a,b){
    if (a < 16 && b < 16 && a >= 0 && b >= 0){
        if(mineArray.includes((b*16)+a)){
            return true;
        }else return false;
    }else return false;
}
$canvas.on('contextmenu', function(evt){
    evt.preventDefault();
    if(evt.target.src !== "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png"){
        evt.target.src = mineSweeper.flagImg;
        flagBoard.textContent = `${--mines}`;
    }else if(evt.target.src === "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/flag.png"){
        evt.target.src = mineSweeper.emptyBox;
        flagBoard.textContent = `${++mines}`;                               //I have to work on this part
    }   
});
function reveal(idx){
    revealed = 0;
    var x = idx%16;
    var y = Math.floor(idx/16);
    var a = "file:///Users/meisam/Documents/GApractice/02-mineSweeper/images/emptyBox.png";
    if(revealArray[idx] !== 'mine' && emptyBoxArray[idx].src === a ){
        revealed++;
        emptyBoxArray[idx].src = `${revealArray[idx]}.png`;
        
        // if(revealArray[idx] === 0 && !arrayCheck(x-2,y-2) && !arrayCheck(x-1,y-2) && !arrayCheck(x,y-2) && !arrayCheck(x+1,y-2) &&
        //     !arrayCheck(x+2,y-2) && !arrayCheck(x-2,y-1) && !arrayCheck(x+2, y-1 ) && !arrayCheck(x-2, y) && !arrayCheck(x+2, y) &&
        //     !arrayCheck(x-2,y+1) && !arrayCheck(x+2,y+1) && !arrayCheck(x-2,y+2) && !arrayCheck(x+2,y+2) && !arrayCheck(x-1,y+2)&&
        //      !arrayCheck(x,y+2)&& !arrayCheck(x+1,+2)  ){
        if(revealArray[idx] === 0 ){
            if( x>0 && emptyBoxArray[idx - 1].src === a ) reveal(idx-1);
            if( x<15 && emptyBoxArray[idx + 1].src === a ) reveal(+idx+1);
            if( y<15 && emptyBoxArray[idx + 16].src === a ) reveal(+idx+16);
            if( y>0 && emptyBoxArray[idx - 16].src === a ) reveal(idx-16);
            if( x>0 && y>0 && emptyBoxArray[idx - 15].src === a ) reveal(idx-15);
            if( x<15 && y<15 && emptyBoxArray[idx + 17].src === a ) reveal(+idx+17);
            if( x>0 && y<15 && y>0 && emptyBoxArray[idx+15].src === a ) reveal(+idx+15);
            if( x<15 && y>0 && y<15 && emptyBoxArray[idx - 15].src === a ) reveal(+idx-17);
            var count = 0;
            if ( arrayCheck((x-1),(y-1))) count++;
            if ( arrayCheck((x),(y-1))) count++;
            if ( arrayCheck((x+1),(y-1))) count++;
            if ( arrayCheck((x-1),(y))) count++;
            if ( arrayCheck((x+1),(y))) count++;
            if ( arrayCheck((x-1),(y+1))) count++;
            if ( arrayCheck((x),(y+1))) count++;
            if ( arrayCheck((x+1),(y+1))) count++;
            if ( count === 0 ) reveal(idx);
            else {
                evt.target.src = `images/${count}.png`;
                scoreBoard.textContent = `${++score}`;
            }
        }
    }  
}
