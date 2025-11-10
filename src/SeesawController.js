import SeesawModel from "./SeesawModel.js";
import SeesawView from "./SeesawView.js";

export default class SeesawController {
  constructor() {
    this.model = new SeesawModel();
    this.view = new SeesawView();

    this.xCoords = 0;

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  init() {
    const restored = this.model.restoreState();
    if (restored) {
      this.renderFromState();
    } else {
      this.model.createNextRandomWeight();
      this.view.updateInfo({
        leftWeight: this.model.leftSideWeight,
        rightWeight: this.model.rightSideWeight,
        angle: this.model.currentAngle,
        nextWeight: this.model.nextWeight
      });
    }

    this.view.sceneElement.addEventListener("click", this.handleClick);
    this.view.sceneElement.addEventListener("mousemove", this.handleMouseMove);
    document.getElementById("resetButton").addEventListener("click", this.handleReset);
  }

  handleClick(event) {
    this.calcXCoordForPivot(event);
    this.view.removeNextWeightVisualization();

    const weight = this.model.nextWeight;

    this.model.addWeightToSeesaw(weight, this.xCoords);
    this.view.addWeightToSeesawVisualization(weight, this.xCoords, this.model.currentAngle);

    const angle = this.model.calcTiltAngle(weight, this.xCoords);

    const logEntry = this.model.addLogEntry(weight, this.xCoords); 
    this.view.createLog(logEntry);

    const nextWeight = this.model.createNextRandomWeight();
    this.view.updateInfo({
      leftWeight: this.model.leftSideWeight,
      rightWeight: this.model.rightSideWeight,
      angle,
      nextWeight
    });

    this.model.saveState();
  }

  handleMouseMove(event) {
    this.calcXCoordForPivot(event);
    this.view.visualizeNextWeight(this.xCoords, this.model.nextWeight);
  }

  handleReset() {
    this.model.seesawWeights = { rightSide: [], leftSide: [], origin: [] };
    this.model.leftSideWeight = 0;
    this.model.rightSideWeight = 0;
    this.model.torque = 0;
    this.model.currentAngle = 0;
    this.model.logs = [];

    this.view.clearWeights();
    this.view.clearLogs();
    this.model.createNextRandomWeight();
    this.view.updateInfo({
      leftWeight: 0,
      rightWeight: 0,
      angle: 0,
      nextWeight: this.model.nextWeight
    });
    this.model.saveState();
  }

  calcXCoordForPivot(event) {
    const pivotPos = this.view.pivotElement.getBoundingClientRect();
    const plankPos = this.view.plankElement.getBoundingClientRect();
    let xCoords = event.clientX - (pivotPos.left + pivotPos.width / 2);
    const plankWidth = plankPos.width / 2;
    if (xCoords > plankWidth) xCoords = plankWidth;
    else if (xCoords < -plankWidth) xCoords = -plankWidth;
    this.xCoords = xCoords;
  }

  renderFromState() {
    this.view.updateInfo({
      leftWeight: this.model.leftSideWeight,
      rightWeight: this.model.rightSideWeight,
      angle: this.model.currentAngle,
      nextWeight: this.model.nextWeight
    });

    this.model.seesawWeights.leftSide.forEach(item => {
      this.view.addWeightToSeesawVisualization(item.weight, item.xCoord, this.model.currentAngle);
    });
    this.model.seesawWeights.origin.forEach(item => {
      this.view.addWeightToSeesawVisualization(item.weight, item.xCoord, this.model.currentAngle);
    });
    this.model.seesawWeights.rightSide.forEach(item => {
      this.view.addWeightToSeesawVisualization(item.weight, item.xCoord, this.model.currentAngle);
    });

    this.model.logs.forEach(entry => this.view.createLog(entry));
  }
}