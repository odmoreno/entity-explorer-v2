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

class DatePicker {
  constructor(id){
    this.id = id
      this.datepicker = document.getElementById(this.id)
      //$(`#${id}`).datepicker();
  }

  update = (currentDate) => {
      //console.log("picker:", this.datepicker)
      const value = currentDate.toLocaleDateString("es-ES")
      //console.log(currentDate)
      //console.log(value)
      this.datepicker.value = value
      $(`#${this.id}`).datepicker('update', currentDate)
      //this.datepicker.setDate(currentDate)
      //this.datepicker('update', '');
  }
}

class Brush extends Component{

  isDown = false;
  offset = [0, 0];
  
  constructor(hostElementId){
    super(hostElementId);
    this.id = hostElementId
    this.hostElement = document.getElementById(hostElementId);
    //this.create();
    //this.connectMouseEvent();
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

  connectMouseEvent = () => {
    console.log(this);
    console.log(this.element);

    this.element.addEventListener("mousedown", function (e) {
      this.isDown = true;
      console.log("mouse down")
      //this.offset = [
        //  divOverlay.offsetLeft - e.clientX,
        //  divOverlay.offsetTop - e.clientY,
        //];
      });
    
    this.element.addEventListener("mouseup", function () {
        this.isDown = false;
        console.log("mouse up")
    });

    this.element.addEventListener("mousemove", function (e) {
      e.preventDefault();
      if (this.isDown) {
        console.log("mouse move")
        //divOverlay.style.left = e.clientX + offset[0] + "px";
        //divOverlay.style.top = e.clientY + offset[1] + "px";
      }
    });
  }
  
}

class SelectionArea {
  hasActiveBrush = false;
  hasOneBrush = false;
  

  constructor(id) {
    this.id = id;
    this.datesLimit = {};
    this.drawArea = document.getElementById("canvas");
    this.startDate = new DatePicker("datepicker1");
    this.endDate = new DatePicker("datepicker2");
    this.connectClickEvent();
    this.connectMouseEvent();
    this.connectDraggable();
    this.brush = new Brush(this.id);
  }

  startRect = (e) => {
    //console.log("Click in canvas", e)
    //console.log(this)
    if (this.hasActiveBrush) {
      this.drawArea.style.cursor = "default";
      this.hasActiveBrush = false;
      globalThis.hasOpenBrush = false;
      this.brush.attach(false);
      this.brush.connectMouseEvent()
      //console.log("Dates:", this.datesLimit)
      this.getSessionsInRange();
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
      globalThis.hasOpenBrush = true;
    }
    e.stopPropagation();
  };

  setMousePos = (e) => {
    if (this.hasActiveBrush && this.hasOneBrush) {
      //console.log("mouse move in canvas")
      var properties = shortTimeline.getEventProperties(e);
      // properties contains things like node id, group, x, y, time, etc.
      //console.log('mousemove properties:', properties.time);
      this.getDatesRange(properties);
      this.brush.update(e);
    }
  };

  getDatesRange(properties) {
    if (!this.datesLimit["first"]) {
      this.datesLimit["first"] = properties.time;
      this.startDate.update(properties.time);
    } else {
      this.datesLimit["last"] = properties.time;
      this.endDate.update(properties.time);
    }
  }

  getSessionsInRange = () => {
    let firstDay, lastDay;

    //if(globalThis.datesTimeline['first']<globalThis.datesTimeline['last']){
    //  firstDay = globalThis.datesTimeline['first']
    //  lastDay = globalThis.datesTimeline['last']
    //}
    //else{
    //  firstDay = globalThis.datesTimeline['last']
    //  lastDay = globalThis.datesTimeline['first']
    //}
    firstDay = this.datesLimit["first"];
    lastDay = this.datesLimit["last"];

    console.log(firstDay);
    console.log(lastDay);
    //console.log(sesiones)
    this.votaciones = [];

    Object.values(sesiones).forEach((v) => {
      //console.log(v)
      let fecha = v.fecha.split("-");
      let vDate = new Date(fecha[0], fecha[1] - 1, fecha[2]);
      if (vDate >= firstDay && vDate <= lastDay) {
        //console.log(vDate)
        this.votaciones.push(v);
      }
    });
    console.log(this.votaciones);
    listaResultados.innerHTML = "";
    outputVotes(this.votaciones);
    dictIds["yVotos"] = this.votaciones;
    delete this.datesLimit["first"];

    console.log(this.datesLimit);
  };

  connectDraggable() {
    this.drawArea.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", "yVotos");
      event.dataTransfer.effectAllowed = "move";
      console.log("drag start", event);
    });

    this.drawArea.addEventListener("dragend", (event) => {
      console.log("Drag END", event);
      console.log(event);
    });
  }

  connectClickEvent() {
    this.drawArea.addEventListener("click", this.startRect);
  }

  connectMouseEvent() {
    this.drawArea.addEventListener("mousemove", this.setMousePos);
  }
}

const divArea = new SelectionArea('canvas')

const rangeData = divArea.getDatesRange()
console.log(rangeData)