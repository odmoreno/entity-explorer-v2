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
  constructor(id) {
    this.id = id;
    this.datepicker = document.getElementById(this.id);
    //$(`#${id}`).datepicker();
  }

  update = (currentDate) => {
    //console.log("picker:", this.datepicker)
    const value = currentDate.toLocaleDateString("es-ES");
    //console.log(currentDate)
    //console.log(value)
    this.datepicker.value = value;
    $(`#${this.id}`).datepicker("update", currentDate);
    //this.datepicker.setDate(currentDate)
    //this.datepicker('update', '');
  };
}


class Brush extends Component {
  constructor(hostElementId) {
    super(hostElementId);
    this.id = hostElementId;
    this.hostElement = document.getElementById(hostElementId);
    //this.create();
    //this.connectMouseEvent();
  }

  create(e) {
    let selectedArea = document.createElement('div');
    selectedArea.className = 'selection-area';
    selectedArea.setAttribute("draggable", "true")
    const areaTemplate = document.getElementById('selected-area');
    const areaBody = document.importNode(areaTemplate.content, true);
    selectedArea.append(areaBody);

    console.log("event", e)

    selectedArea.style.position = 'absolute';
    selectedArea.style.left = e.clientX + 'px'; // 500px
    selectedArea.style.top = e.clientY + 'px';
    selectedArea.style.width = 0;
    selectedArea.style.height = 0;
    selectedArea.style.backgroundColor = 'rgba(177, 177, 177, 0.5)';

    this.element = selectedArea
    this.connectDraggable()
  }

  update() {
    var el = document.getElementsByClassName('selection')[0];
    //var bbox = el.getBoundingClientRect(); //posiciones Absolutas
    var bbox = el.getBBox(); //Posiciones relativas
    //console.log(bbox);

    d3.select('.selection-area')
      .style('left', bbox.x + 'px')
      .style('top', bbox.y + 'px')
      .style('width', bbox.width/2 + 'px')
      .style('height', bbox.height/2 + 'px');
  }

  connectDraggable() {
    //console.log(this)
    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.effectAllowed = 'move';
      var item = {
        id: new Date(),
        content: 'yVotos',
      };
      //event.dataTransfer.setData("text/plain", JSON.stringify(item));
      event.dataTransfer.setData('text/plain', 'yVotos');
      //console.log("drag start", event);
    });

    this.element.addEventListener('dragend', (event) => {
      console.log('Drag END', event);
      //console.log(event);
    });
  }
}

let selectArea = new Brush('canvas')

let startDate = new DatePicker("datepicker1");
let endDate = new DatePicker("datepicker2");
