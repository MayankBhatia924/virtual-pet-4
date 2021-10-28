var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

var bath,play, sleep,eat;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/happydog.png");
play=loadImage("images/Garden.png");
bath=loadImage("images/WashRoom.png");
bedroom=loadImage("images/BedRoom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(600,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

    
  eat = createButton("Feed");
  play = createButton("Play");
  bath = createButton("Bath");
  sleep = createButton("Sleep")
  feed = createButton("Feed the dog");
  addFood = createButton("Add Food");

  eat.position(770,70)
  play.position(870,70)
  bath.position(950,70)
  sleep.position(1050,70)
  addFood.position(650,70);
  feed.position(500,70);

  feed.mousePressed(feedDog);
  addFood.mousePressed(addFoods);
  sleep.mousePressed(Sleep);
  eat.mousePressed(Feed);
  play.mousePressed(Play);
  bath.mousePressed(Bath);


  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(500,350,150,150);
  
  dog.scale=0.15;
  
}
  function draw() {
  foodObj.display();

  currentTime=hour();
  if(gameState==="playing"){
      foodObj.garden();
    
   }else if(gameState==="sleeping"){
      foodObj.bedroom();
     
   }else if(gameState==="bathing"){
   background(bath);
     
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    eat.show()
   }else{
    feed.show();
    addFood.show();
    eat.hide();
    foodObj.display();
   }
 
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
function Play(){
  update("playing")

}

function Bath(){
  update("bathing")
}
function Feed(){
  update("hungry")
}
function Sleep(){
  update("sleeping")
  
}