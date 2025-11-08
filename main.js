const plankElement = document.getElementById("plank");
const sceneElement = document.getElementById("scene");
const pivotElement = document.getElementById("pivot");
const seesawElement = document.getElementById("seesaw")
let nextWeightElement = document.getElementById("nextWeight");
let visualizedNextWeightElement = null;
let visualizedMarkerElement = null;
const pivotPos = pivotElement.getBoundingClientRect();
const plankPos = plankElement.getBoundingClientRect();
let currentAngle = 0;
let xCoords = 0;
let nextWeight = 0;

sceneElement.addEventListener("click", handleClick);
sceneElement.addEventListener("mousemove" , () => {handleMouseMove(event)})

document.addEventListener('DOMContentLoaded' , () => {
    createNextRandomWeight();
})

function handleClick(event){
    calcXCoordForPivot(event);
    createNextRandomWeight();
}

function handleMouseMove(event){
    calcXCoordForPivot(event);
    visualizeNextWeight();
}

//calculating x coords for pivot triangle.
function calcXCoordForPivot(event){
    xCoords = event.clientX - (pivotPos.left + pivotPos.width / 2);
    let plankWidth = plankPos.width / 2;
    
    if(xCoords > plankWidth) 
        xCoords = plankWidth;
    else if (xCoords < -plankWidth) 
        xCoords = -plankWidth;
}


//visualizes the next weight before placing it on the seesaw.
function visualizeNextWeight(){
    if(!visualizedNextWeightElement){
        visualizedNextWeightElement = document.createElement('div');
        visualizedNextWeightElement.className = 'visualized-weight';
        visualizedMarkerElement = document.createElement('div');
        visualizedMarkerElement.className = 'visualized-marker';
        seesawElement.append(visualizedNextWeightElement , visualizedMarkerElement);
    }

    nextWeightPos = visualizedNextWeightElement.getBoundingClientRect();
    const xCoordsForPlank = xCoords + plankPos.width / 2;
    const alignedWeightPosition = xCoordsForPlank - nextWeightPos.width / 2;
    visualizedNextWeightElement.style.left = `${alignedWeightPosition}px`;

    const WeightSize = nextWeight * 4 + 31;
    visualizedNextWeightElement.style.width = `${WeightSize}px`
    visualizedNextWeightElement.style.height = `${WeightSize}px`;
    visualizedNextWeightElement.style.lineHeight = `${WeightSize}px`;
    visualizedNextWeightElement.innerHTML = `${nextWeight}kg`

    const markerStartPosition = xCoordsForPlank;
    visualizedMarkerElement.style.height = `${plankPos.top - nextWeightPos.bottom }px`
    visualizedMarkerElement.style.left = `${markerStartPosition}px`;

}

// creating next random weight.
function createNextRandomWeight(){
    nextWeight = Math.ceil(Math.random()*10);
    nextWeightElement.innerHTML = nextWeight;
}