//constants
var arr = [];
for (var i = 0 ; i < 50 ; i ++){
    var temp = Math.ceil(Math.random()*5)
         * i;
    arr.push(temp);
}
console.log(arr);
var mine = false;
var score;
var emptyBoxImg = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var flaged = 0;
var axsBox;
var flag;
var boxNum = 0;
var count = 0;
var column = 16;
var row = 16;

//DOMS
var strtBtn = document.querySelector(".start");
var canvas = $('main');


//EventListeners
strtBtn.addEventListener('click', drawBoards);
axsBox = document.querySelector('.canvas');
axsBox.addEventListener('click', play);
flag = $('.canvas');

//Functions
function init(){
    for(var i = 0; i < column*row; i++){
        emptyBoxImg[i] = document.createElement("img"); 
        emptyBoxImg[i].src = "images/emptyBox.png";
        emptyBoxImg[i].id = count++;
        emptyBoxImg[i].style = "height:30px; width: 30px;";
        // emptyBoxImg.style.top=50+Math.floor(i/columns)*30;        
        // emptyBoxImg.style.left=400+i%columns*30;  
        document.querySelector('.canvas').appendChild(emptyBoxImg[i]); 
    }
}
init();
function drawBoards(){
    $('button').toggle();
    canvas.toggle();
    canvas.css("display", "flex");
}
var imgArr = [];
function play (evt) {
    if(arr.includes(parseInt(evt.target.id))) {
        emptyBoxImg[evt.target.id].src = 'images/mine.jpg';
        // mine = true;
    } else if(mine === false){
        if (arr.includes(parseInt(evt.target.id) - 17 )) boxNum++;
        if (arr.includes(parseInt(evt.target.id) - 16 )) boxNum++;
        if (arr.includes(parseInt(evt.target.id) - 15 )) boxNum++;
        if (arr.includes(parseInt(evt.target.id) + 15 )) boxNum++; 
        if (arr.includes(parseInt(evt.target.id) + 16)) boxNum++; 
        if (arr.includes(parseInt(evt.target.id) + 17)) boxNum++; 
        if (arr.includes(parseInt(evt.target.id) - 1)) boxNum++;
        if (arr.includes(parseInt(evt.target.id) + 1)) boxNum++; 
        emptyBoxImg[evt.target.id].src = `images/${boxNum}.png`;
        boxNum = 0;
        // score++;
    }
    endGame();
    // emptyBoxImg[evt.target.id].src = `images/1.png`;
    console.log(evt.target.id);
}
$(function(){
    flag.on('contextmenu', function(e){
        e.preventDefault();
        console.log(e.target.id);
        // $("e.target.id").attr("src") = "../images/2.png";
        emptyBoxImg[e.target.id].src = "images/flag.png";
        flaged++;
        $('.flagboard').text(flaged);
    });
});
// $(function(){
//     $('flagboard').on('contextmenu', function(e){
//         e.text("hi");
//     });
// });
function endGame(){
    if(mine === true){
        // var end = document.createElement("div");
        // end.id = "endGame";
        // end.textContent = "Game Over!!!";
        alert("Game Over!!!");
    }
}
