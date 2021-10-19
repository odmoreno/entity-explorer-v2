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
    this.insertBefore = insertBefore;
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "beforeend",
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
    this.closeNotifier = closeNotifierFunction;
  };

  getDatesRangeHandler = (datesFunction) => {
    this.setDatesRange = datesFunction;
  };

  eventHandler = (e) => {
    this.eventMouse = e;
  };

  getTotalVotes = (votos) => {
    console.log("votos:", votos)
    this.size = Object.values(votos).length
  }

  getDates = (datesFunction) =>{
    this.datesTl = datesFunction
  }

  closeTooltip = () => {
    //console.log("DOUBLE")
    this.detach();
    //this.closeNotifier();
  };

  create() {
    let divArea = document.createElement("div");
    divArea.className = "div-area";
    const areaTemplate = document.getElementById("selected-area");
    const areaBody = document.importNode(areaTemplate.content, true);
    //divArea.append(areaBody);

    //console.log(divArea)
    let dragZone = document.createElement("div");
    dragZone.className = "dragzone";
    dragZone.setAttribute("draggable", "true");
    let selectedArea = document.createElement("div");
    selectedArea.className = "selection-area";

    divArea.appendChild(dragZone);
    divArea.appendChild(selectedArea);

    const getBounding = this.hostElement.getBoundingClientRect();
    this.hostElBottom = getBounding.bottom;
    this.hostElLeft = getBounding.left;
    this.hostElTop = getBounding.top;
    this.hostElHeight = this.hostElement.clientHeight;
    console.log(getBounding);

    this.x = Math.abs(getBounding.left - this.eventMouse.x) + 5;
    //this.y =
    //  Math.abs(getBounding.bottom - this.eventMouse.y - this.hostElHeight) + 5;
    this.y = '30'
    this.bottomArea = Math.abs(getBounding.right - this.eventMouse.x) + 5;

    console.log("Y:", this.y);

    selectedArea.style.position = "absolute";
    selectedArea.style.left = this.x + "px"; // 500px
    selectedArea.style.top = this.y + "px";
    selectedArea.style.width = 0;
    selectedArea.style.height = 0;
    selectedArea.style.backgroundColor = "rgba(255, 0, 0, 0.3)";

    dragZone.style.position = "absolute";
    dragZone.style.left = this.x + "px"; // 500px
    dragZone.style.top = this.y - 20 + "px";
    dragZone.style.width = 0;
    dragZone.style.height = "20px";
    dragZone.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    //dragZone.style.borderTopLeftRadius = "5px";
    //dragZone.style.borderTopRightRadius = "5px";
    let leftSide = document.createElement("div");
    let rigthSide = document.createElement("div");
    leftSide.id = "leftArea"
    leftSide.className = 'textZone'
    rigthSide.className = 'textZone'
    rigthSide.id = "rigthArea"

    leftSide.style.left = this.x - 36 + "px";
    leftSide.style.top = this.y - 20 + "px";
    //rigthSide.style.left = this.bottomArea + "px"
    rigthSide.style.top = this.y - 20 + "px";
  
    divArea.appendChild(leftSide);
    divArea.appendChild(rigthSide);

    this.element = divArea;
    this.selectArea = selectedArea;
    this.dragZone = dragZone;
    this.connectDraggable();

    this.rigthSide = rigthSide;
    this.leftSide = leftSide;
    
  }

  update = (e) => {
    this.eventMouse = e;

    const leftpos =
      this.eventMouse.x - this.x < 0 ? this.eventMouse.x + "px" : this.x + "px";

    const rigthpos =
      this.eventMouse.y - this.y < 0 ? this.eventMouse.y + "px" : this.y + "px";

    const newX = Math.abs(this.hostElLeft - this.eventMouse.x) + 5;
    const newY =
      Math.abs(this.hostElBottom - this.eventMouse.y - this.hostElHeight) + 5;

    //console.log()
    d3.select(".selection-area")
      .style("left", leftpos)
      .style("top", rigthpos)
      //.style("top", this.hostElTop)
      .style("width", Math.abs(newX - this.x) + "px")
      .style("height", this.hostElHeight + "px");
    //.style("height", Math.abs(newY - this.y) + "px");

    d3.select(".dragzone").style("width", Math.abs(newX - this.x) + "px");
    //console.log("LEFT:", d3.select("#leftArea"))
    //this.leftSide.style.left = this.x - 36 + "px";
    d3.select("#leftArea").style("left", ()=> {
      //console.log(this.x -36 + "px")
      return this.x -30 + "px";
    })
    const text = this.getDateText()
    this.leftSide.innerHTML = text

  };

  getDateText (){
    console.log("DAATES:", this.datesTl,  this.datesTl['first'])
    let first = this.datesTl['first']
    console.log(first.getDate(), first.getMonth())
    let text = ('0'+first.getDate()).slice(-2) +'/'+ (first.getMonth()+1)
    return text
  }

  hideTextInfo(){
    this.rigthSide.style.display ="none"
    this.leftSide.style.display = "none"
  }

  showTextInfo(){
    this.rigthSide.style.display ="block"
    this.leftSide.style.display = "block"
  }

  changeDateInfo(first, last){

    let textFirst = ('0'+first.getDate()).slice(-2) +'/'+ (first.getMonth()+1)
    let textLast = ('0'+last.getDate()).slice(-2) +'/'+ (last.getMonth()+1)
    return [textFirst, textLast]
  }

  connectMouseEventsOnBrush = () => {
    //console.log(this);
    //console.log(this.selectArea);
    this.selectArea.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.isDown = true;
      console.log("mouse down");
      this.hideTextInfo();
      this.offset = [
        this.selectArea.offsetLeft - e.clientX,
        this.selectArea.offsetTop - e.clientY,
      ];
      return false;
    });

    this.selectArea.addEventListener("mouseup", (e) => {
      this.isDown = false;
      console.log("mouse up");
      //console.log(this.p1.time, this.p2.time)
      this.setDatesRange(this.p1.time, this.p2.time)
      this.showTextInfo()
      const info = this.changeDateInfo(this.p1.time, this.p2.time)
      console.log("TOTAL", this.size)
      this.dragZone.innerHTML = `${this.size}  votaciones`
      this.leftSide.innerHTML = info[0]
      this.rigthSide.innerHTML = info[1]
      e.stopPropagation();
    });

    this.selectArea.addEventListener("mousemove", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.isDown) {
        //console.log("mouse move", e);
        const boundBoxCanvas = this.hostElement.getBoundingClientRect();
        const leftCanvas = boundBoxCanvas.left
        //console.log(boundBoxCanvas)

        const boundBoxDiv = this.selectArea.getBoundingClientRect();
        const leftside = boundBoxDiv.left
        //console.log(boundBoxDiv)

        if (leftside - 5 <= leftCanvas) {
          this.selectArea.style.left = e.clientX + this.offset[0] + 'px';
        } else {
          this.selectArea.style.left = e.clientX + this.offset[0] + 'px';
          this.dragZone.style.left = e.clientX + this.offset[0] + 'px';
          this.leftSide.style.left = e.clientX + this.offset[0] - 36 + 'px';
          this.rigthSide.style.left =
            e.clientX + this.offset[0] + boundBoxDiv.width+ 8 + 'px';
        }

        const getBounding = this.selectArea.getBoundingClientRect();

        var x1 = document.createEvent("MouseEvent");
        x1.initMouseEvent(
          "mousemove",
          true,
          true,
          window,
          0,
          0,
          0,
          getBounding.left,
          getBounding.top,
          false,
          false,
          false,
          false,
          0,
          null
        );
        //console.log(x1.x);

        var x2 = document.createEvent("MouseEvent");
        x2.initMouseEvent(
          "mousemove",
          true,
          true,
          window,
          0,
          0,
          0,
          getBounding.right,
          getBounding.bottom,
          false,
          false,
          false,
          false,
          0,
          null
        );
        //console.log(x2.x);

        this.p1 = shortTimeline.getEventProperties(x1);
        this.p2 = shortTimeline.getEventProperties(x2);
        //console.log(this.p1.time, this.p2.time)
        //this.setDatesRange(this.p1.time, this.p2.time)
      }
    });
  };

  connectDraggable() {
    console.log(this)
    this.dragZone.addEventListener('dragstart', (event) => {
      event.dataTransfer.effectAllowed = "move";
      var item = {
        id: new Date(),
        content: 'yVotos',
      };
      //event.dataTransfer.setData("text/plain", JSON.stringify(item));
      event.dataTransfer.setData("text/plain", "yVotos");
      //console.log("drag start", event);
    })

    this.dragZone.addEventListener("dragend", (event) => {
      console.log("Drag END", event);
      //console.log(event);
    });
  }
}

class SelectionArea {
  hasActiveBrush = false;
  hasOneBrush = false;
  mousedownFired = false;

  constructor(id) {
    this.id = id;
    this.datesLimit = {};
    this.drawArea = document.getElementById("canvas");
    this.shortTl = document.getElementById("pointTimeline");
    this.startDate = new DatePicker("datepicker1");
    this.endDate = new DatePicker("datepicker2");
    this.connectEvents();
    this.brush = new Brush(this.id);
  }

  startRect = (e) => {
    e.stopPropagation();
    const currentBrush = document.elementFromPoint(e.clientX, e.clientY);
    console.log(currentBrush.className);
    if (
      this.hasOneBrush === true &&
      (currentBrush.className === "div-area" ||
        currentBrush.className === "selection-area" ||
        currentBrush.className === "dragzone")
    ) {
      console.log("Dentro del brush");
      return;
    } else if (
      this.hasOneBrush === true &&
      (currentBrush.className !== "div-area" ||
        currentBrush.className !== "selection-area" ||
        currentBrush.className !== "dragzone")
    ) {
      console.log("Borra");
      this.hasOneBrush = false;
      d3.selectAll(".div-area").remove();
      this.startRect(e);
      return;
    }
    if (!this.hasActiveBrush) {
      console.log("creando");
      this.createBrush(e);
      this.drawArea.style.cursor = "crosshair";
      this.hasActiveBrush = true;
      //this.hasOneBrush = true
    }
  };

  createBrush(e) {
    this.brush.eventHandler(e);
    this.brush.getDatesRangeHandler(this.setDatesWhenMoveBrush)
    this.brush.create();
    this.brush.attach(true);
  }

  finishRect = (e) => {
    console.log("UP");
    //this.brush.attach(false);
    this.drawArea.style.cursor = "default";
    this.hasActiveBrush = false;
    this.hasOneBrush = true;
    this.getSessionsInRange();
    this.setDateright()
    this.brush.connectMouseEventsOnBrush();
  };

  setDateright(){
    this.brush.dragZone.innerHTML = `${this.lengthVotaciones}  votaciones`
    
    const total = this.getRigthSide()
    this.brush.rigthSide.style.left = total + 8 +'px'
    
    let text =
      ('0' + this.datesLimit['last'].getDate()).slice(-2) +
      '/' +
      (this.datesLimit['last'].getMonth()+1);
    this.brush.rigthSide.innerHTML = text
  
  }

  getRigthSide() {
    let left = this.brush.selectArea.style.left
    let height = this.brush.selectArea.style.width
    left = left.replace('px', '')
    height = height.replace('px', '')
    let total = parseInt(left) + parseInt(height)
    console.log(left, height, total)
    return total
  }

  setMousePos = (e) => {
    if (this.hasActiveBrush) {
      //console.log("mouse move in canvas");
      //e.preventDefault();
      var properties = shortTimeline.getEventProperties(e);
      // properties contains things like node id, group, x, y, time, etc.
      //console.log('mousemove properties:', properties.time);
      this.getDatesRange(properties);
      this.brush.getDates(this.datesLimit)
      this.brush.update(e);
      
    }
  };

  connectEvents() {
    //this.drawArea.addEventListener("click", this.clickEvent);
    this.drawArea.addEventListener("mousedown", this.startRect);
    this.drawArea.addEventListener("mouseup", this.finishRect);
    this.drawArea.addEventListener("mousemove", this.setMousePos);
  }

  getDatesRange = (properties) => {
    //console.log("get dates range", this)
    if (!this.datesLimit["first"]) {
      this.datesLimit["first"] = properties.time;
      this.startDate.update(properties.time);
    } else {
      this.datesLimit["last"] = properties.time;
      this.endDate.update(properties.time);
    }
  }

  setDatesWhenMoveBrush = (first, last) => {
    this.datesLimit["first"] = first
    this.datesLimit["last"] = last
    this.startDate.update(first);
    this.endDate.update(last);
    this.getSessionsInRange();
    this.brush.getTotalVotes(this.votaciones)
    //this.brush.getTotalVotes(this.votaciones)
  }

  getSessionsInRange = () => {
    let firstDay, lastDay;
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
    this.lengthVotaciones = Object.values(this.votaciones).length
  };
}

const divArea = new SelectionArea("canvas");

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



  clickEvent = (e) => {
    //console.log("click")
    if (!this.mousedownFired) {
      console.log("CLICK");
      this.mousedownFired = true;
      e.stopPropagation();
      return;
    }
  };
 */
