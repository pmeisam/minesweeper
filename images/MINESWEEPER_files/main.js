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
var cells, emptyBoxArray, mineArray, emptyBox, mine, current, gameOver;
/*----- cached element references -----*/
var canvas = document.querySelector('.canvas');
var main = document.querySelector('main');
/*----- event listeners -----*/
var startBtn = document.querySelector('.start').addEventListener('click', init);
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
    mine = 0;
    gameOver = false;
    $(startBtn).toggle(3000);
    render();
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
            main.style = 'display: flex;';
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
    
    for(var i = 0; i < 50; i++){
        mineArray.push(Math.floor(Math.random() * 255 ));
    }
    console.log(mineArray);
}
function play(evt) {
    var x = parseInt(evt.target.id%16);
    var y = parseInt(Math.floor(evt.target.id/16));
    console.log(`(${x},${y})`);
    console.log(evt.target);
    console.log(evt.target.id);
    // console.log(`${evt.target.id%16}, ${Math.floor(evt.target.id/16)}`);

    if( mineArray.includes(parseInt(evt.target.id)) ){
        evt.target.src = mineSweeper.mineImg;
        for(var i = 0; i < 256; i++){
            emptyBoxArray[mineArray[i]].src = mineSweeper.mineImg;
        }
        // gameOver = true;
        // alert("game over!!!");
    } else if (gameOver === false) {
        var count = 0;
        // if ( mineArray.includes(((y-1)*16) + (x-1))) count++;
        // if ( mineArray.includes(((y-1)*16) + (x))) count++;
        // if ( mineArray.includes(((y-1)*16) + (x+1))) count++;
        // if ( mineArray.includes(((y+1)*16) + (x-1))) count++;
        // if ( mineArray.includes(((y+1)*16) + (x))) count++;
        // if ( mineArray.includes(((y+1)*16) + (x+1))) count++;
        // if ( mineArray.includes(((y)*16) + (x-1))) count++;
        // if ( mineArray.includes(((y)*16) + (x+1))) count++;
        if ( arrayCheck((x-1),(y-1))) count++;
        if ( arrayCheck((x),(y-1))) count++;
        if ( arrayCheck((x+1),(y-1))) count++;
        if ( arrayCheck((x-1),(y))) count++;
        if ( arrayCheck((x+1),(y))) count++;
        if ( arrayCheck((x-1),(y+1))) count++;
        if ( arrayCheck((x),(y+1))) count++;
        if ( arrayCheck((x+1),(y+1))) count++;
        // if ( count === 0 ){
        //     var url = 'images/0.png';
        //     if ( !arrayCheck(x,y)) emptyBoxArray[x][y].src = url;
        //     if ( !arrayCheck((x-1),(y-1))) emptyBoxArray[x - 1][y - 1].src = url;
        //     if ( !arrayCheck((x),(y-1))) emptyBoxArray[x][y - 1].src = url;
        //     if ( !arrayCheck((x+1),(y-1))) emptyBoxArray[x + 1][y - 1].src = url;
        //     if ( !arrayCheck((x-1),(y))) emptyBoxArray[x - 1][y].src = url;
        //     if ( !arrayCheck((x+1),(y))) emptyBoxArray[x + 1][y].src = url;
        //     if ( !arrayCheck((x-1),(y+1))) emptyBoxArray[x - 1][y + 1].src = url;
        //     if ( !arrayCheck((x),(y+1))) emptyBoxArray[x][y + 1].src = url;
        //     if ( !arrayCheck((x+1),(y+1))) emptyBoxArray[x + 1][y + 1 ].src = url;
        // }
        evt.target.src = `images/${count}.png`;
    }
}
var arrayCheck = function (a,b){
    if (a < 16 && b < 16 && a >= 0 && b >= 0){
        if(mineArray.includes((b*16)+a)){
            return true;
        }else return false;
    }else return false;
}

// function reveal(a,b){
    
//     // var url = 'images/0.png';
//     // if ( !arrayCheck(a,b)) emptyBoxArray[a][b].src = url;
//     // if ( !arrayCheck((a-1),(b-1))) emptyBoxArray[a - 1][b - 1].src = url;
//     // if ( !arrayCheck((a),(b-1))) emptyBoxArray[a][b - 1].src = url;
//     // if ( !arrayCheck((a+1),(b-1))) emptyBoxArray[a + 1][b - 1].src = url;
//     // if ( !arrayCheck((a-1),(b))) emptyBoxArray[a - 1][b].src = url;
//     // if ( !arrayCheck((a+1),(b))) emptyBoxArray[a + 1][b].src = url;
//     // if ( !arrayCheck((a-1),(b+1))) emptyBoxArray[a - 1][b + 1].src = url;
//     // if ( !arrayCheck((a),(b+1))) emptyBoxArray[a][b + 1].src = url;
//     // if ( !arrayCheck((a+1),(b+1))) emptyBoxArray[a + 1][b + 1 ].src = url;
// }
