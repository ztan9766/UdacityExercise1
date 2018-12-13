var VictoryBoard = function(){
  this.won = false;
}

VictoryBoard.prototype.render = function(){
  if(this.won){
    ctx.font = "60px Georgia";
    ctx.fillStyle = "red"
    ctx.textAlign = "center";
    ctx.fillText("Victory !!!", 250, 300);
  }
}

VictoryBoard.prototype.win = function(){
  this.won = true;
  allEnemies.forEach(function(enemy) {
    enemy.hide();
  });
  player.hide();
}

// 这是我们的玩家要躲避的敌人
var Enemy = function() {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.x = -200; //off screen
  this.y = -200;
  this.speed = 0;
  // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = "images/enemy-bug.png";
};

Enemy.prototype.reset = function(){
  this.x = enemyActiveRange.min;
  this.y = enemyActiveRange.arrayOfY[Math.floor(Math.random()*enemyActiveRange.arrayOfY.length)]
  this.speed = Math.floor(150 * Math.random() + 40);
}

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
  if(VictoryBoard.won) return
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  this.x += this.speed * dt;
  if(this.x > enemyActiveRange.max){
    this.reset()
  }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.hide = function() {
  this.x = -200; //off screen
  this.y = -200;
  this.speed = 0;
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var PlayerObject = function() {
  this.x = -200; //off screen
  this.y = -200;
  this.sprite = "images/char-boy.png";
}

PlayerObject.prototype.update = function(coordinateX, coordinateY) {
    if(VictoryBoard.won) return
    if (typeof coordinateX == "undefined" || typeof coordinateY == "undefined")
      return;
    this.x =
      coordinateX > border.max.x
        ? border.max.x
        : coordinateX < border.min.x
        ? border.min.x
        : coordinateX;
    this.y =
      coordinateY > border.max.y
        ? border.max.y
        : coordinateY < border.min.y
        ? vic.win()
        : coordinateY;
}

PlayerObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

PlayerObject.prototype.handleInput = function(direction) {
    switch (direction) {
      case "up":
        this.update(this.x, this.y - oneUnitY);
        break;
      case "down":
        this.update(this.x, this.y + oneUnitY);
        break;
      case "left":
        this.update(this.x - oneUnitX, this.y);
        break;
      case "right":
        this.update(this.x + oneUnitX, this.y);
        break;
    }
}
PlayerObject.prototype.reset = function(){
    this.x = startPoint.x;
    this.y = startPoint.y;
}
PlayerObject.prototype.hide = function(){
    this.x = -200; //off screen
    this.y = -200;
}

var vic = new VictoryBoard();
var player = new PlayerObject();
var allEnemies = [];

for(var j = 0; j < maxNumOfEnemy; j++){
  var newEnemy = new Enemy();
  allEnemies.push(newEnemy);
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
