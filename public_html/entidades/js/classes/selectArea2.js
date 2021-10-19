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

class Brush extends Component {
  isDown = false;
  offset = [0, 0];

  constructor(hostElementId) {
    super(hostElementId);
    this.id = hostElementId;
    this.hostElement = document.getElementById(hostElementId);
    //this.create();
    //this.connectMouseEvent();
  }

  closeNotifierHandler = (closeNotifierFunction) => {
    this.closeNotifier = closeNotifierFunction
  }

  eventHandler = (e) => {
    this.eventMouse = e;
  };

  closeTooltip = () => {
    //console.log("DOUBLE")
    this.detach();
    //this.closeNotifier();
  };

  create(){
    let divArea = document.createElement('div');
    divArea.className = 'div-area';
    const areaTemplate = document.getElementById('selected-area');
    const areaBody = document.importNode(areaTemplate.content, true);
    //divArea.append(areaBody);

    console.log(divArea)
    let dragZone = document.createElement('div');
    dragZone.className = 'dragzone'
    dragZone.setAttribute("draggable", "true")
    let selectedArea = document.createElement('div');
    selectedArea.className = 'selection-area';
    
    divArea.appendChild(dragZone);
    divArea.appendChild(selectedArea);

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
    selectedArea.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';

    dragZone.style.position = 'absolute';
    dragZone.style.left = this.x + this.x/7 + 'px'; // 500px
    dragZone.style.top = this.y - 15 + 'px';
    dragZone.style.width = 0;
    dragZone.style.height = '15px';
    dragZone.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    dragZone.style.borderTopLeftRadius = '5px'
    dragZone.style.borderTopRightRadius = '5px'

    this.element = divArea;
    this.selectArea = selectedArea
    this.dragZone = dragZone
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

    d3.select(".dragzone")
    .style('width', (Math.abs(newX - this.x)/1.2) + 'px')
    
  }

}

class SelectionArea {
  hasActiveBrush = false;
  hasOneBrush = false;
  mousedownFired = false;

  constructor(id) {
    this.id = id;
    this.datesLimit = {};
    this.drawArea = document.getElementById('canvas');
    this.shortTl = document.getElementById('pointTimeline');
    this.connectEvents();
    this.brush = new Brush(this.id);
  }

  startRect = (e) => {
    //console.log('down')
    if (this.hasOneBrush) {
      //Si hay uno eliminar el anterior, y crear uno nuevo
      //d3.selectAll('.div-area').remove();
      this.hasActiveBrush = false;
      this.hasOneBrush = false;
      //this.startRect(e);
      return;
    }
    console.log('DOWN');
    this.createBrush(e);
    this.drawArea.style.cursor = 'crosshair';
    this.hasActiveBrush = true;
    this.hasOneBrush = true;
    e.stopPropagation();
  };

  createBrush(e) {
    this.brush.closeNotifierHandler(() => {
      this.hasActiveBrush = false;
      this.hasOneBrush = false;
    });
    this.brush.eventHandler(e);
    this.brush.create();
    this.brush.attach(true);
  }

  finishRect = (e) => {
    console.log('UP');
    this.brush.attach(false);
    this.drawArea.style.cursor = 'default';
    this.hasActiveBrush = false;
    //this.hasOneBrush = true;
  };

  setMousePos = (e) => {
    if (this.hasActiveBrush) {
      console.log('mouse move in canvas');
      e.preventDefault();
      var properties = shortTimeline.getEventProperties(e);
      // properties contains things like node id, group, x, y, time, etc.
      //console.log('mousemove properties:', properties.time);
      //this.getDatesRange(properties);
      this.brush.update(e);
    }
  };

  clickEvent = (e) => {
    //console.log("click")
    if (!this.mousedownFired) {
      console.log("CLICK")
      this.mousedownFired = true;
      //e.stopPropagation();
      return;
    }
  };

  connectEvents() {
    //this.drawArea.addEventListener('click', this.clickEvent);
    this.drawArea.addEventListener('mousedown', this.startRect);
    this.drawArea.addEventListener('mouseup', this.finishRect);
    this.drawArea.addEventListener('mousemove', this.setMousePos);
  }
}

const divArea = new SelectionArea('canvas')

/**
 * this.mousedownFired = true;
    if (this.hasOneBrush) {
      //Si hay uno eliminar el anterior, y crear uno nuevo
      d3.selectAll('.div-area').remove();
      this.hasActiveBrush = false;
      this.hasOneBrush = false;
      //this.startRect(e);
      //return;
    }
    console.log('DOWN');
    this.createBrush(e);
    this.drawArea.style.cursor = 'crosshair';
    this.hasActiveBrush = true;

    e.stopPropagation();
 */

    /**
     * if (this.hasActiveBrush) {
      this.hasActiveBrush = false;
      //this.getSessionsInRange();
      return;
    }
    if (!this.hasOneBrush) {
      this.brush.closeNotifierHandler(() => {
        this.hasActiveBrush = false;
        this.hasOneBrush = false;
      });
      this.brush.eventHandler(e);
      this.brush.create();
      this.brush.attach(true);
      
      //this.brush.init( () => { this.hasActiveBrush = false;}, e )

      this.drawArea.style.cursor = "crosshair";
      this.hasActiveBrush = true;
      this.hasOneBrush = true;
      //globalThis.hasOpenBrush = true;
    }
     */