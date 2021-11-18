//Modelo para los timeline Vis js

let items;

class TimelineObj {
  defaultOptions = {};
  //items = {};
  //timeline = {};
  votosId = {};

  constructor(id, option, flag, height, maxHeight, orientation, type) {
    this.height = height; // 285px normal, 50px el corto  
    this.maxHeight = maxHeight; //300px max
    this.orientation = orientation; // bot para el corto, top para el largo
    this.id = id;
    this.orgOption = option;
    this.hasDataset = flag;
    this.type = type;
    this.hasContent = false;
    this.container = document.getElementById(id);
    this.create();
    this.connectDroppable();
  }

  create() {
    this.items = this.hasDataset ? this.createItems() : new vis.DataSet([]);
    //items = this.hasDataset ? this.createItems() : new vis.DataSet([]);
    //Configuracion por defecto
    this.defaultOptions = {
      showMajorLabels: false,
      showMinorLabels: false,
      stack: false,
      showCurrentTime: false,
      horizontalScroll: true,
      height: this.height,
      maxHeight: this.maxHeight,
      orientation: this.orientation,
      min: new Date(1954, 5, 1), //por defecto (configurable)
      max: new Date(2021, 11, 20), //por defecto (configurable)
      zoomFriction: 4,
      editable: false,
      moveable: true,
      zoomable: true,
      tooltip: {
        followMouse: true,
      },
      onAdd: function(item, callback){
        //console.log(callback)
        console.log(item)
      },
    };
    //Instaciar timeline con su div
    this.timeline = new vis.Timeline(this.container);
    this.timeline.setOptions(this.defaultOptions);
    this.timeline.setItems(this.items);
    //this.timeline.setItems(items);
    
  }

  setVisContentDiv(){
    console.log(document.getElementsByClassName("vis-itemset")[0])
    document.getElementsByClassName("vis-itemset")[0].style.removeProperty('height')
  }

  createItems() {
    let items = [];
    let elements = [];
    let list = [];

    list = this.selectSesions();
    logFiles("list sesiones", list);

    list.map((item) => {
      let fecha = item.fecha.split("-");
      let hora = item.hora ? item.hora.split(":") : "";
      const node = this.createNodeItem(item, fecha, hora);
      elements.push(node);
    });

    logFiles("items timeline", elements);
    items = new vis.Dataset(elements);
    return items;
  }

  createNodeItem(item, fecha, hora) {
    const node = {
      id: item.sesId,
      className: "stimelineElement" + " m_" + item.sesId,
      group: item.anio,
      content: this.hasContent ? this.getContent(item) : "",
      asunto: item.asunto,
      title: this.orgOption == 1 ? item.name : item.unres,
      type: this.type,
      start: startDateSelec(fecha, hora),
      end: endDateSelect(fecha, hora),
    };
    return node;
  }

  selectSesions() {
    let list;
    if (this.orgOption === 1) {
      list = Object.values(sesiones);
    } else if (this.orgOption === 2) {
      list = Object.values(unResolutions);
    }
    return list;
  }

  connectDroppable() {
    //console.log(this.container.closest('div div'))
    //console.log(this.container.firstChild)
    //this.timelineE = this.container.firstChild
    //this.container.style.zIndex = 999;
    //this.container.addEventListener("dragenter", (event) => {
    //  if (event.dataTransfer.types[0] === "text/plain") {
    //    this.container.classList.add("droppable");
    //    //event.preventDefault();
    //    console.log("DragEnter");
    //  }
    //});

    //this.container.addEventListener("dragover", (event) => {
    //  if (event.dataTransfer.types[0] === "text/plain") {
    //    event.preventDefault();
    //    //console.log("Dragover")
    //    //return false
    //  }
    //  //console.log(event)
    //});

    //this.container.addEventListener("dragleave", (event) => {
    //  //event.preventDefault();
    //  if (event.relatedTarget.closest("div") == this.container) {
    //    this.container.classList.remove("droppable");
    //    console.log(event.target.nodeName);
    //    console.log(event.target.id);
    //    console.log(event.target.href);
    //    console.log(event.target.className);
    //    console.log(event.target.innerHtml);
    //    console.log(event.relatedTarget.closest("div"));
    //    console.log("DRAGGG leave");
    //  }
    //});

    this.timeline.on('drop',  (properties) => {
      console.log('DROP');
      //const prjId = event.dataTransfer.getData('text/plain');
      //const obj = JSON.parse(prjId);
      //console.log(prjId);
      //console.log(obj);
      //console.log(obj.content);
      this.addVotesInArea();      
      this.setVisContentDiv();
    });
    
    //this.container.addEventListener("drop", this.dropevent);
  }

  dropevent = (event) => {
    event.preventDefault();
    const prjId = event.dataTransfer.getData("text/plain");
    //event.dataTransfer.dropEffect = 'copy';
    const objJson = JSON.parse(prjId)
    console.log("DROP", objJson);
    const firstKey = objJson.content.substring(0, 1);
    //logFiles("drop", prjId);
    if (firstKey == "w") {
      //votaciones
    } else if (firstKey == "y") {
      logFiles("Votos", dictIds);
      this.addVotesInArea();
    }
    this.container.classList.remove("droppable");
    //return false;
    //this.container.removeEventListener("drop", this.dropevent);
    this.container.addEventListener("drop", this.dropevent);
  }

  addVotesInArea() {
    console.log("add votes in area")
    this.hasContent = true;
    //this.connectDroppable()
    const votos = dictIds["yVotos"]; //Object.values(dictIds["yVotos"])
    logFiles('votos pusheados', votos);

    this.timeline.setOptions({
      showMajorLabels: true,
      showMinorLabels: true,
    });

    for (let key in votos) {
      const item = votos[key];
      //console.log("VOTOS:", item)
      let fecha = item.fecha.split("-");
      let hora = item.hora ? item.hora.split(":") : "";
      if (!dictLinks[item.sesId]) dictLinks[item.sesId] = {};
      //console.log("Antes")
      const flag = this.validateId(item);
      if (flag) {
        const node = this.createNodeItem(item, fecha, hora);
        //this.items.add(node);
        this.timeline.itemsData.update(node)
        addSesion2(item.sesId);
        //console.log(this.timeline)
        //console.log(this.timeline.getDataSet())
        //logFiles(`Node item ${item.sesId} `, node);
      }
    }
    //logFiles('Items', this.items);

    console.log(this.timeline)

    if (!flagEmptySes) getAllLinks();

    selectChart();
    this.setRangeTl();
    console.log("FIRST ID:", firstIds);
    currentSes = firstIds;
    currentId = reverseDIVotes[firstIds];
    this.timeline.setSelection(firstIds, { focus: false });
  }

  validateId(item) {
    if (!(item.sesId in this.votosId)) {
      //console.log("no existe alli")
      this.votosId[item.sesId] = 1;
      return true;
    }
    console.log("YA EXISTE");
    return false;
  }

  setRangeTl() {
    const range = this.timeline.getItemRange();
    let minTl = range.min;
    const maxTl = range.max;
    //logFiles('ranges', [minTl, maxTl]);
    const lastSesion =
      this.orgOption === 1 ? sesiones[lastIdS] : unResolutions[lastIdS];
    const fecha = lastSesion.fecha.split("-");
    const hora = lastSesion.hora ? lastSesion.hora.split(":") : "";
    //logFiles(`Sesion ultima ${lastIdS}`, lastSesion);
    let newMax = new Date(
      parseInt(fecha[0]),
      parseInt(fecha[1] - 1),
      parseInt(fecha[2]),
      parseInt(hora[0]) + 1,
      59
    );
    newMax.setDate(newMax.getDate() + 2);
    minTl.setDate(minTl.getDate() - 2);

    this.timeline.setWindow(minTl, newMax, { animation: false });
    this.timeline.setOptions({
      min: minTl,
      max: newMax,
    });
    this.timeline.fit()
  }

  getContent(item) {
    let itemDiv = document.createElement("div");
    itemDiv.className = "form-check";
    itemDiv.id = "h" + item.sesId;

    var span = document.createElement("label");
    span.className = "form-check-label textbox";
    span.for = "h" + item.sesId;
    span.appendChild(document.createTextNode(item.asunto));
    itemDiv.appendChild(span);

    let button = document.createElement("button");
    button.className = "button-itemTimeline";
    //<i class="far fa-trash-alt"></i>
    let icon = document.createElement("i");
    icon.className = "far fa-trash-alt";
    button.appendChild(icon);
    itemDiv.appendChild(button);

    itemDiv.addEventListener("mouseover", function () {
      button.style.display = "block";
    });
    itemDiv.addEventListener("mouseout", function () {
      button.style.display = "none";
    });
    button.addEventListener("mouseover", function () {
      flagClickbuttonItem = true;
    });
    button.addEventListener("mouseout", function () {
      flagClickbuttonItem = false;
    });
    button.addEventListener("click", () => {
      console.log(this);
      logFiles("Remove button", item);
      this.items.remove(item.sesId);
      removeSes(item.sesId);
      let valuesDICT = Object.keys(idSesiones);
      console.log("a:", valuesDICT, idSesiones);
      if (valuesDICT.length > 1) {
        setRangeTimeline();
      } else if (valuesDICT.length == 1) {
        console.log("solo queda uno", valuesDICT, idSesiones);
      }
    });

    return itemDiv;
  }
}

function logFiles(type, file) {
  let log = {
    Mensaje: type,
    File: file,
    script: 'Timeline',
  };
  console.log(log);
}


