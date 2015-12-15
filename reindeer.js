function Reindeer(name, speed, stamina, recoveryTime) {
  this.name = name;
  this.speed = speed;
  this.stamina = stamina;
  this.recoveryTime = recoveryTime;
  this.energy = stamina;
  this.restTime = 0;
  this.distance = 0;
  this.points = 0;
}

Reindeer.prototype.distanceAtTime = function(time){
  var cycle = this.stamina + this.recoveryTime,
      fullCycles = Math.floor(time/cycle),
      lastCycle = time%cycle, // seconds last cycle will last
  
      fullCyclesDistance = fullCycles * this.speed * this.stamina,
      lastCycleDistance = (lastCycle < this.stamina) ? lastCycle*this.speed : this.stamina*this.speed,
      fullDistance = fullCyclesDistance + lastCycleDistance;
  return fullDistance;
}

Reindeer.prototype.step = function() {
  if(this.energy > 0) {
    this.energy--;
    this.distance += this.speed * 1;
  } else {
    this.restTime++;
    if(this.restTime >= this.recoveryTime) {
      this.restTime = 0;
      this.energy = this.stamina;
    }
  }
  return this.distance;
}