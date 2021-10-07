class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  detach() {
    if (this.element) {
      this.element.remove();
      // this.element.parentElement.removeChild(this.element);
    }
  }

  attach(insertBefore = false) {
    this.insertBefore = insertBefore
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? 'afterbegin' : 'beforeend',
      //'afterbegin',
      this.element
    );
  }
}

class Brush extends Component{
  constructor(hostElementId){
    super(hostElementId);
    this.id = hostElementId
    this.hostElement = document.getElementById(hostElementId);
    //this.create();
  }

  closeNotifierHandler = (closeNotifierFunction) => {
    this.closeNotifier = closeNotifierFunction
  }

  eventHandler = (e) => {
    this.eventMouse = e
  }

  closeTooltip = () => {
    //console.log("DOUBLE")
    this.detach();
    this.closeNotifier();
  };

  create(){
    //console.log('created...', this.eventMouse);
    let selectedArea = document.createElement('div');
    selectedArea.className = 'selection-area';
    selectedArea.setAttribute("draggable", "true")
    const areaTemplate = document.getElementById('selected-area');
    const areaBody = document.importNode(areaTemplate.content, true);
    selectedArea.append(areaBody);

    const getBounding = this.hostElement.getBoundingClientRect();
    this.hostElBottom = getBounding.bottom
    this.hostElLeft = getBounding.left
    this.hostElHeight = this.hostElement.clientHeight;
    console.log(getBounding);

    this.x = Math.abs(getBounding.left - this.eventMouse.x) + 5;
    this. y =
      Math.abs(getBounding.bottom - this.eventMouse.y - this.hostElHeight) + 5;
    console.log('Y:', this.y);

    selectedArea.style.position = 'absolute';
    selectedArea.style.left = this.x + 'px'; // 500px
    selectedArea.style.top = this.y + 'px';
    selectedArea.style.width = 0;
    selectedArea.style.height = 0;
    

    this.hostElement.addEventListener('dblclick', this.closeTooltip);
    this.element = selectedArea;
  }

  update = (e) =>{
    this.eventMouse = e;

    const leftpos =
      this.eventMouse.x - this.x < 0 ? this.eventMouse.x + 'px' : this.x + 'px';

    const rigthpos =
      this.eventMouse.y - this.y < 0 ? this.eventMouse.y + 'px' : this.y + 'px';  

    const newX = Math.abs(this.hostElLeft - this.eventMouse.x) + 5;
    const newY = Math.abs(this.hostElBottom - this.eventMouse.y - this.hostElHeight) + 5;
    
    d3.select(".selection-area").style('left', leftpos)
                .style('top', rigthpos)
                .style('width', Math.abs(newX - this.x) + 'px')
                .style('height', Math.abs(newY - this.y) + 'px')
  }
  
}

class SelectionArea {
  hasActiveBrush = false;
  hasOneBrush = false;

  constructor(id){
    this.id = id;
    this.drawArea = document.getElementById('canvas');
    this.connectClickEvent();
    this.connectMouseEvent();
    this.brush = new Brush(this.id);
  }

  startRect = (e) => {
    //console.log("Click in canvas", e)
    //console.log(this)
    if(this.hasActiveBrush){
      this.drawArea.style.cursor = "default"
      this.hasActiveBrush = false
      globalThis.hasOpenBrush = false
      this.brush.attach(false);
      console.log("Dates:", globalThis.datesTimeline)
      this.getSessionsInRange()
      return;
    }
    if(!this.hasOneBrush){

      this.brush.closeNotifierHandler(() => {
        this.hasActiveBrush = false;
        this.hasOneBrush = false;
      });
      this.brush.eventHandler(e)
      this.brush.create();
      this.brush.attach(true);
      //this.brush.init( () => { this.hasActiveBrush = false;}, e )
  
      this.drawArea.style.cursor = 'crosshair';
      this.hasActiveBrush = true;
      this.hasOneBrush = true
      globalThis.hasOpenBrush = true

    }
    
  }

  setMousePos = (e) => {
    if(this.hasActiveBrush && this.hasOneBrush){
      console.log("mouse move in canvas")
      this.brush.update(e)
    }
  
  }

  getSessionsInRange = () => {
    let firstDay = globalThis.datesTimeline['first']
    let LastDay = globalThis.datesTimeline['last']

    //console.log(firstDay, LastDay)
    //console.log(sesiones)
    this.votaciones = []

    Object.values(sesiones).forEach(v => {
      //console.log(votacion)
      let fecha = v.fecha.split("-"); 
      let vDate = new Date(fecha[0], fecha[1]- 1, fecha[2]); 
      if(vDate>= firstDay && vDate<= LastDay){
        console.log(vDate)
        this.votaciones.push(v)
      }
    })
    console.log(this.votaciones)
    outputVotes(this.votaciones)

  }

  connectClickEvent(){
    this.drawArea.addEventListener('click', this.startRect)
  }

  connectMouseEvent(){
    this.drawArea.addEventListener('mousemove', this.setMousePos)
  }


}

const divArea = new SelectionArea('canvas')