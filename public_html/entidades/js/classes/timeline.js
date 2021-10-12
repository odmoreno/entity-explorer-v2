//Modelo para los timeline Vis js


class Timeline {
  defaultOptions = {};
  items = {};
  timeline = {};

  constructor(id, height, maxHeight, orientation) {
    this.height = height; // 285px normal, 50px el corto
    this.maxHeight = maxHeight //300px max
    this.orientation = orientation // bot para el corto, top para el largo
    this.id = id;
    this.container = document.getElementById(id);
  }

  create() {
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
      moveable: true,
      zoomable: true,
      tooltip: {
        followMouse: true,
      },
    };

    //this.timeline = new 
  }
}