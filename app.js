var canvas = document.querySelector('#race'),
    stats = document.querySelector('#stats'),
    ctx = canvas.getContext('2d');

var r = new XMLHttpRequest(),
    data,
    reindeer;

var Race = {
  furthest: 0,
  currentTime: 0,
  step: function() {
    var furthest = reindeer.reduce((p,c)=>Math.max(p,c.step()),0);
    this.furthest = furthest;
    reindeer.forEach(function(r){
      if(r.distance == furthest) r.points++;
    });
  },
  race: function(time) {
    for(var i=1; i<=time; i++) {
      this.step();
    }
  },
  go: function(duration) {
    var interval = window.setInterval(function(){
      if(duration<=0) clearInterval(interval);
      duration--;
      Race.currentTime++;
      Race.step();
      draw(canvas,ctx);
    },10);
  }
}

r.onreadystatechange = function(data){
  if (r.readyState !=4 || r.status !=200) {
    return;
  }
  //console.log(r.responseText);
  data = JSON.parse(r.responseText);
  reindeer = data.map(d=>new Reindeer(d[0],d[1],d[2],d[3]));
  console.log('ready');
  draw(canvas,ctx);
  
  Race.go(2503);
}

r.open("GET", "data.json", true);
r.send();

function renderStats() {
  
}

var offset = 0;

function draw(canvas,ctx) {
  if(Race.furthest > canvas.width-100) offset = Race.furthest - (canvas.width-100);
  var markup = `<h2>Time: ${Race.currentTime}</h2><table>\n<th>Reindeer</th><th>Distance</th><th>Points</th><th>Energy</th>`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for(var i=(0-(offset-(offset%100))); i<=canvas.width + offset; i+=100) {
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.moveTo(i-offset,0);
    ctx.lineTo(i-offset,canvas.height);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillText(i,i-offset,canvas.height-5);
  }
  
  reindeer.forEach(function(r,i){
    var energy = 0;
    if(r.energy==0) {
      energy = r.percentRecovered()*100;
      var fillString = "rgb(255," + Math.floor(r.percentRecovered()*255) + ",0)";
      ctx.fillStyle = fillString;
    } else {
      energy = (r.energy/r.stamina)*100;
      ctx.fillStyle = "rgb(255,255,0)";
    }
    markup += `<tr><td>${r.name}</td><td>${r.distance}</td><td>${r.points}</td><td><div class="stat"><div class="val" style="width:${energy}%"></div></div></tr>`;
    ctx.fillRect(r.distance-offset,11+i*11,9,9);
  });
  markup += "</table>";
  stats.innerHTML = markup;
}

window.addEventListener("keydown",function(e){
  if(e.which == 32) {
    Race.step();
    draw(canvas,ctx);
  }
});

console.log(new Date());