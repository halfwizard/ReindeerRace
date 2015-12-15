var canvas = document.querySelector('#race'),
    stats = document.querySelector('#stats'),
    ctx = canvas.getContext('2d');

var r = new XMLHttpRequest(),
    data,
    reindeer;

var Race = {
  step: function() {
    var furthest = reindeer.reduce((p,c)=>Math.max(p,c.step()),0);
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
    while(duration>=0) {
      console.log(duration);
      window.setTimeout(function(duration){
        this.step();
        draw(canvas,ctx);
        duration--;
        this.go(duration);
      },10);
    }
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
  
  window.setInterval(function(){
    Race.step();
    draw(canvas,ctx);
  },10);
}

r.open("GET", "data.json", true);
r.send();

function renderStats() {
  
}

function draw(canvas,ctx) {
  var markup = "<table>\n<th>Reindeer</th><th>Distance</th><th>Points</th>";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(255,255,0)";
  reindeer.forEach(function(r,i){
    markup += `<tr><td>${r.name}</td><td>${r.distance}</td><td>${r.points}</td></tr>`;
    ctx.fillRect(r.distance,11+i*11,9,9);
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