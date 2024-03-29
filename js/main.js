/*----- constants -----*/
const minesweeper = {
  oneImg: "images/1.png",
  twoImg: "images/2.png",
  threeImg: "images/3.png",
  fourImg: "images/4.png",
  fiveImg: "images/5.png",
  sixImg: "images/6.png",
  sevenImg: "images/7.png",
  eightImg: "images/8.png)",
  mineImg: "images/mine.jpg",
  flagImg: "images/flag.png",
  emptyBox: "images/emptyBox.png",
  rows: 16,
  columns: 16,
  mines: 50,
  revealed: 0,
  flags: 0,
  numbers: 0,
  flagsArr: []
};
const sound = new Audio("sounds/explosion.mp3");
/*----- variables -----*/
var width,
  mobWidth,
  gameTime,
  cells,
  emptyBoxArray,
  mineArray,
  revealArray,
  mines,
  gameOver,
  score,
  revealed,
  timerBool = true;
var time = 00;
var minute = 00;
/*----- cached element references -----*/
const canvas = document.querySelector(".canvas");
const main = document.querySelector("main");
const scoreBoard = document.querySelector(".scoreboard");
const flagBoard = document.querySelector(".flagboard");

/*----- event listeners -----*/
var $startBtn = $(".start");
var $canvas = $("main");
canvas.addEventListener("click", play);

/*----- functions -----*/
init();

function init() {
  cells = {
    x: 0,
    y: 0
  };
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
      emptyBoxArray[count] = document.createElement("img");
      emptyBoxArray[count].src = minesweeper.emptyBox;
      emptyBoxArray[count].setAttribute("datax", cells.x);
      emptyBoxArray[count].setAttribute("datay", cells.y);
      emptyBoxArray[count].id = count;
      canvas.appendChild(emptyBoxArray[count]);
      count++;
      cells.x++;
    }
    emptyBoxArray[count] = document.createElement("img");
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
  quickSort(mineArray, 0, mineArray.length - 1);
  for (var i = 0; i < minesweeper.rows * minesweeper.columns; i++) {
    if (mineArray.includes(i)) revealArray[i] = "mine";
    else revealArray[i] = 0;
  }
}

function swap(arr, leftIndex, rightIndex) {
  let temp = arr[leftIndex];
  arr[leftIndex] = arr[rightIndex];
  arr[rightIndex] = temp;
}

function partition(arr, left, right) {
  let pivot = arr[Math.floor((right + left) / 2)],
    i = left,
    j = right;
  while (i <= j) {
    while (arr[i] < pivot) {
      i++;
    }
    while (arr[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(arr, left, right) {
  let index;
  if (arr.length > 1) {
    index = partition(arr, left, right);
    if (left < index - 1) quickSort(arr, left, index - 1);
    if (index < right) quickSort(arr, index, right);
  }
  return arr;
}

var startBtn = $startBtn.on("click", function() {
  minesweeper.mines = parseInt($(".minesnum").val());
  minesweeper.rows = parseInt($(".rownum").val());
  minesweeper.columns = parseInt($(".rownum").val());
  if (parseInt($(".rownum").val()) >= 100) {
    minesweeper.columns = 100;
    minesweeper.rows = 10;
  }
  if (parseInt($(".rownum").val()) <= 10) {
    minesweeper.columns = 10;
    minesweeper.rows = 10;
  }

  if ($(".rownum").val().length === 0) {
    minesweeper.columns = 16;
    minesweeper.rows = 16;
  }
  if (minesweeper.mines >= 1000) minesweeper.mines = 1000;
  if ($(".minesnum").val().length === 0) minesweeper.mines = 50;

  width = minesweeper.columns * 30 + 5;

  mobWidth = minesweeper.columns * 19 + 5;
  var x = window.matchMedia("(min-width: 768px)");
  myFunction(x);
  x.addListener(myFunction);
  function myFunction(x) {
    if (x.matches) {
      $("main").css("width", `${width}`);
    } else {
      $("main").css("width", `${mobWidth}`);
    }
  }
  $canvas.toggle(2000);
  $canvas.css("display", "flex");
  $(render()).toggle(2000);
  $startBtn.toggle(2000);
  $(".inputs").toggle(2000);
  timer();
});

$(".resetgame").on("click", function() {
  window.location.href = "https://pmeisam.github.io/minesweeper/";
});

function play(evt) {
  var x = parseInt(evt.target.id % minesweeper.rows);
  var y = parseInt(Math.floor(evt.target.id / minesweeper.columns));
  var idx = parseInt(evt.target.id);
  if (mines === 0 && arrayEqual(mineArray, minesweeper.flagsArr)) {
    $(".winboard p").html(`You Unfortunately Won :( <br>Time: ${gameTime}`);
    $(".winboard").css("color", "rgba(97,207,78,1)");
    $(".winboard").css("display", "flex");
    $(".resetgame").css("display", "block");
    $("main").css("display", "fixed");
    document.querySelector(".faceImg").src = "images/sunglasses.jpg";
  }
  if (evt.target.id === NaN) return;
  if (mineArray.includes(idx)) {
    evt.target.src = minesweeper.mineImg;
    for (var i = 0; i < minesweeper.mines; i++)
      emptyBoxArray[mineArray[i]].src = minesweeper.mineImg;
    sound.play();
    gameOver = true;
    timerBool = false;
    $(".winboard p").html(`You Lost hahaha ;)<br>Time: ${gameTime}`);
    $(".winboard").css("color", "rgba(233,77,96,1)");
    $(".winboard").css("display", "flex");
    $(".resetgame").css("display", "block");
    $("main").css("display", "fixed");
    document.querySelector(".faceImg").src = "images/dead.png";
  } else if (gameOver === false) {
    if (mineFinder(x, y) === 0) reveal(x, y);
    else if (
      evt.target != $(".canvas") &&
      evt.target.attributes.src.nodeValue !== "images/flag.png"
    ) {
      evt.target.src = `images/${mineFinder(x, y)}.png`;
      minesweeper.numbers++;
    }
  }
}

function mineFinder(a, b) {
  var count = 0;
  if (arrayCheck(a - 1, b - 1)) count++;
  if (arrayCheck(a, b - 1)) count++;
  if (arrayCheck(a + 1, b - 1)) count++;
  if (arrayCheck(a - 1, b)) count++;
  if (arrayCheck(a + 1, b)) count++;
  if (arrayCheck(a - 1, b + 1)) count++;
  if (arrayCheck(a, b + 1)) count++;
  if (arrayCheck(a + 1, b + 1)) count++;
  return count;
}

var arrayCheck = function(a, b) {
  if (a < minesweeper.rows && b < minesweeper.columns && a >= 0 && b >= 0) {
    if (mineArray.includes(b * minesweeper.columns + a)) {
      return true;
    } else return false;
  } else return false;
};

$(function() {
  $("main").bind("taphold", tapholdHandler);
  function tapholdHandler(evt) {
    $(evt.target).preventDefault();
    if (
      !emptyBoxArray[evt.target.id].src.includes("images/flag.png") &&
      checkImage(evt.target.id)
    ) {
      evt.target.src = minesweeper.flagImg;
      minesweeper.flags++;
      flagBoard.textContent = `${--mines}`;
      if (mines <= 0) {
        $(".winboard p").html(`You Unfortunately Won :(<br>Time: ${gameTime}`);
        $(".winboard").css("color", "rgba(97,207,78,1)");
        $(".winboard").css("display", "flex");
        $(".resetgame").css("display", "block");
        $("main").css("display", "fixed");
        document.querySelector(".faceImg").src = "images/sunglasses.jpg";
      }
    } else if (emptyBoxArray[evt.target.id].src.includes("images/flag.png")) {
      evt.target.src = minesweeper.emptyBox;
      flagBoard.textContent = `${++mines}`;
      minesweeper.flags--;
    }
  }
});

function arrayEqual(arr1, arr2) {
  let bool = true;
  if (arr1.length !== arr2.length) return false;
  arr1.forEach((el, i) => {
    if (arr1[i] !== arr2[i]) bool = false;
  });
  return bool;
}

$canvas.on("contextmenu", function(evt) {
  evt.preventDefault();
  if (
    !emptyBoxArray[evt.target.id].src.includes("images/flag.png") &&
    checkImage(evt.target.id)
  ) {
    evt.target.src = minesweeper.flagImg;
    minesweeper.flags++;
    flagBoard.textContent = `${--mines}`;
    minesweeper.flagsArr.push(parseInt(evt.target.id));
    quickSort(minesweeper.flagsArr, 0, minesweeper.flagsArr.length - 1);
    if (mines === 0 && arrayEqual(mineArray, minesweeper.flagsArr)) {
      $(".winboard p").html(`You Unfortunately Won :( <br>Time: ${gameTime}`);
      $(".winboard").css("color", "rgba(97,207,78,1)");
      $(".winboard").css("display", "flex");
      $(".resetgame").css("display", "block");
      $("main").css("display", "fixed");
      timerBool = false;
      document.querySelector(".faceImg").src = "images/sunglasses.jpg";
    }
  } else if (emptyBoxArray[evt.target.id].src.includes("images/flag.png")) {
    evt.target.src = minesweeper.emptyBox;
    flagBoard.textContent = `${++mines}`;
    minesweeper.flags--;
    minesweeper.flagsArr = minesweeper.flagsArr.filter(
      el => el != parseInt(evt.target.id)
    );
  }
});

function checkImage(a) {
  if (a <= 0) a = 0;
  else if (a >= minesweeper.columns * minesweeper.rows)
    a = minesweeper.columns * minesweeper.rows;
  if (emptyBoxArray[a].src.includes("images/emptyBox.png")) return true;
  else return false;
}

function reveal(x, y) {
  var idx = y * minesweeper.columns + x;
  var rows = minesweeper.rows;
  var columns = minesweeper.columns;
  if (x < 0 && y < 0 && x >= rows && y >= columns) return;
  else if (checkImage(idx) && mineFinder(x, y) === 0) {
    emptyBoxArray[idx].src = "images/0.jpg";
    if (mineFinder(x - 1, y) === 0 && x > 0) reveal(x - 1, y);
    else if (mineFinder(x - 1, y) !== 0 && x > 0) {
      emptyBoxArray[idx - 1].src = `images/${mineFinder(x - 1, y)}.png`;
    }
    if (mineFinder(x + 1, y) === 0 && x < rows - 1) reveal(x + 1, y);
    else if (mineFinder(x + 1, y) !== 0 && x < rows - 1) {
      emptyBoxArray[idx + 1].src = `images/${mineFinder(x + 1, y)}.png`;
    }
    if (mineFinder(x, y + 1) === 0 && y < columns - 1) reveal(x, y + 1);
    else if (mineFinder(x, y + 1) !== 0 && y < columns - 1) {
      emptyBoxArray[idx + columns].src = `images/${mineFinder(x, y + 1)}.png`;
    }
    if (mineFinder(x, y - 1) === 0 && y > 0) reveal(x, y - 1);
    else if (mineFinder(x, y - 1) !== 0 && y > 0) {
      emptyBoxArray[idx - columns].src = `images/${mineFinder(x, y - 1)}.png`;
    }
    if (mineFinder(x - 1, y - 1) === 0 && x > 0 && y > 0) reveal(x - 1, y - 1);
    else if (mineFinder(x - 1, y - 1) !== 0 && x > 0 && y > 0) {
      emptyBoxArray[idx - columns - 1].src = `images/${mineFinder(
        x - 1,
        y - 1
      )}.png`;
    }
    if (mineFinder(x + 1, y - 1) === 0 && x < columns - 1 && y > 0)
      reveal(x + 1, y - 1);
    else if (mineFinder(x + 1, y - 1) !== 0 && x < columns - 1 && y > 0) {
      emptyBoxArray[idx - columns + 1].src = `images/${mineFinder(
        x + 1,
        y - 1
      )}.png`;
    }
    if (mineFinder(x - 1, y + 1) === 0 && x > 0 && y < columns - 1)
      reveal(x - 1, y + 1);
    else if (mineFinder(x - 1, y + 1) !== 0 && x > 0 && y < columns - 1) {
      emptyBoxArray[idx + columns - 1].src = `images/${mineFinder(
        x - 1,
        y + 1
      )}.png`;
    }
    if (mineFinder(x + 1, y + 1) === 0 && x < columns - 1 && y < columns - 1)
      reveal(x + 1, y + 1);
    else if (
      mineFinder(x + 1, y + 1) !== 0 &&
      x < columns - 1 &&
      y < columns - 1
    ) {
      emptyBoxArray[idx + columns + 1].src = `images/${mineFinder(
        x + 1,
        y + 1
      )}.png`;
    }
  }
}

function timer() {
  setTimeout(function() {
    var timerDiv = document.querySelector(".timer");
    time++;
    if (time === 60) {
      minute++;
      time = 0;
    }
    // minute = minute < 10 ? "0" + minute : minute;
    // time = time < 10 ? "0" + time : time;
    timerDiv.textContent = `${minute < 10 ? "0" + minute : minute}:${
      time < 10 ? "0" + time : time
    }`;
    if (timerBool === true) timer();
    gameTime =`${minute < 10 ? "0" + minute : minute}:${
      time < 10 ? "0" + time : time
    }`
  }, 1000);
}
