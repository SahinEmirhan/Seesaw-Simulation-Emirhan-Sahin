export default class SeesawModel {
  constructor() {
    this.seesawWeights = {
      rightSide: [],
      leftSide: [],
      origin: []
    };
    this.leftSideWeight = 0;
    this.rightSideWeight = 0;
    this.torque = 0;
    this.currentAngle = 0;
    this.nextWeight = 0;
    this.logs = [];
    this.STATE_KEY = "seesawState";
  }

  addWeightToSeesaw(weight, xCoord) {
    if (xCoord > 0) {
      this.seesawWeights.rightSide.push({ weight, xCoord });
      this.rightSideWeight += weight;
    } else if (xCoord < 0) {
      this.seesawWeights.leftSide.push({ weight, xCoord });
      this.leftSideWeight += weight;
    } else {
      this.seesawWeights.origin.push({ weight, xCoord });
    }
  }

  calcTiltAngle(weight, xCoord) {
    this.torque += weight * xCoord;
    this.currentAngle = Math.max(-30, Math.min(30, this.torque / 10));
    return this.currentAngle;
  }

  createNextRandomWeight() {
    this.nextWeight = Math.ceil(Math.random() * 10);
    return this.nextWeight;
  }

  saveState() {
    const snapshot = {
      weights: this.seesawWeights,
      leftTotal: this.leftSideWeight,
      rightTotal: this.rightSideWeight,
      torque: this.torque,
      angle: this.currentAngle,
      nextWeight: this.nextWeight,
      logs : this.logs
    };
    localStorage.setItem(this.STATE_KEY, JSON.stringify(snapshot));
  }

  restoreState() {
    const raw = localStorage.getItem(this.STATE_KEY);
    if(!raw) return false;
    try {
      const stateObj = JSON.parse(raw);
      this.seesawWeights = stateObj.weights || { rightSide: [], leftSide: [], origin: [] };
      this.leftSideWeight = stateObj.leftTotal || 0;
      this.rightSideWeight = stateObj.rightTotal || 0;
      this.torque = stateObj.torque || 0;
      this.currentAngle = stateObj.angle || 0;
      this.nextWeight = stateObj.nextWeight || 0;
      this.logs = stateObj.logs || [];
      return true;
    } catch (err) {
      console.error("State parse error", err);
      return false;
    }
  }


  addLogEntry(weight, xCoord) {
    const entry = `${weight}kg weight dropped on ${
      xCoord < 0 ? "left side" : xCoord > 0 ? "right side" : "center"
    } at ${Math.abs(xCoord.toFixed(1))}px from center`;
    this.logs.push(entry);
    return entry;
  }
}