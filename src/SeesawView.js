export default class SeesawView {
  constructor() {
    this.plankElement = document.getElementById("plank");
    this.sceneElement = document.getElementById("scene");
    this.pivotElement = document.getElementById("pivot");
    this.seesawElement = document.getElementById("seesaw");
    this.angleElement = document.getElementById("angleDisplay");
    this.leftWeightElement = document.getElementById("leftWeight");
    this.rightWeightElement = document.getElementById("rightWeight");
    this.nextWeightElement = document.getElementById("nextWeight");
    this.logElement = document.getElementById("log");
    this.visualizedNextWeightElement = null;
    this.visualizedMarkerElement = null;
    this.seesawPos = this.seesawElement.getBoundingClientRect();
  }

  updateInfo({ leftWeight, rightWeight, angle, nextWeight }) {
    this.leftWeightElement.textContent = leftWeight;
    this.rightWeightElement.textContent = rightWeight;
    this.angleElement.textContent = angle.toFixed(2);
    this.nextWeightElement.textContent = nextWeight;
    this.plankElement.style.setProperty("--tilt", `${angle}deg`);
  }

  //adding weight to seesaw with animation.
  addWeightToSeesawVisualization(weight ,xCoord , angle ){
    const plankPos = this.plankElement.getBoundingClientRect();
        let newWeightElement = document.createElement('div');
        newWeightElement.className = 'new-weight';
        this.plankElement.append(newWeightElement);
        const xCoordsForPlank = (xCoord + plankPos.width / 2) * this.seesawPos.width / plankPos.width;
        const WeightSize = weight * 4 + 31;
        const alignedWeightPosition = xCoordsForPlank - WeightSize / 2;
        newWeightElement.style.left = `${alignedWeightPosition}px`;
        newWeightElement.style.rotate = `${-angle}deg`;
        
        newWeightElement.style.width = `${WeightSize}px`
        newWeightElement.style.height = `${WeightSize}px`;
        newWeightElement.style.lineHeight = `${WeightSize}px`;
        newWeightElement.innerHTML = `${weight}kg`
        let r = weight * 6 + 55;
        let g = weight * 12 + 55;
        let b = weight * 14 + 110;
        newWeightElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        newWeightElement.addEventListener('animationend', () => {
            newWeightElement.style.transition = "rotate 0.4s ease-in";
            requestAnimationFrame(() => {
            newWeightElement.style.rotate = "0deg"; 
            });
        }, { once: true });
}


//visualizes the next weight before placing it on the seesaw.
visualizeNextWeight(xCoord, nextWeight){
    if(!this.visualizedNextWeightElement){
        this.visualizedNextWeightElement = document.createElement('div');
        this.visualizedNextWeightElement.className = 'visualized-weight';
        this.visualizedMarkerElement = document.createElement('div');
        this.visualizedMarkerElement.className = 'visualized-marker';
        this.seesawElement.append(this.visualizedNextWeightElement , this.visualizedMarkerElement);
        let r = nextWeight * 6 + 55;
        let g = nextWeight * 12 + 55;
        let b = nextWeight * 14 + 110;
        this.visualizedNextWeightElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    
    const nextWeightPos = this.visualizedNextWeightElement.getBoundingClientRect();
    const xCoordsForPlank = xCoord + this.seesawPos.width / 2;
    const alignedWeightPosition = xCoordsForPlank - nextWeightPos.width / 2 ;
    
    this.visualizedNextWeightElement.style.left = `${alignedWeightPosition}px`;

    const WeightSize = nextWeight * 4 + 31;
    this.visualizedNextWeightElement.style.width = `${WeightSize}px`
    this.visualizedNextWeightElement.style.height = `${WeightSize}px`;
    this.visualizedNextWeightElement.style.lineHeight = `${WeightSize}px`;
    
    this.visualizedNextWeightElement.innerHTML = `${nextWeight}kg`

    const markerStartPosition = xCoordsForPlank;
    this.visualizedMarkerElement.style.height = `${this.seesawPos.top - nextWeightPos.bottom }px`
    this.visualizedMarkerElement.style.left = `${markerStartPosition}px`;

}

removeNextWeightVisualization() {
  if (this.visualizedNextWeightElement) {
    this.visualizedNextWeightElement.remove();
    this.visualizedNextWeightElement = null;
  }
  if (this.visualizedMarkerElement) {
    this.visualizedMarkerElement.remove();
    this.visualizedMarkerElement = null;
  }
}

createLog(entry){
  const logItemElement = document.createElement("div");
  logItemElement.className = "log-item";
  logItemElement.textContent = entry;
  this.logElement.appendChild(logItemElement);
}


 clearLogs() {
    this.logElement.querySelectorAll('.log-item').forEach(node => node.remove());
  }

  clearWeights() {
    this.plankElement.querySelectorAll('.new-weight').forEach(node => node.remove());
  }


}