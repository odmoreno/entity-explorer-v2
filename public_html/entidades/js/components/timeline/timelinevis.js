/** 
 * Timeline de vis.js
 */
var LOGV = false
var timeline
var defaultOptions;

var selectionVertical = document.getElementById("selectionVertical");
var selectVertical = document.getElementById("selectVertical");
var fit = document.getElementById("fit");

var datas;

function createTimelineEvents() {
  
  datas = new vis.DataSet([]);
  // create visualization
  var container = document.getElementById("timelineVis");

  defaultOptions = {
    showMajorLabels: false,
    showMinorLabels: false,
    editable: false,
    //editable: {
    //  add: true,
    //  remove: true
    //},
    //zoomKey: 'shiftKey',
    //selectable: true,
    //multiselect: true,
    //sequentialSelection: true,
    stack: false,
    showCurrentTime: false,
    //verticalScroll: true,
    horizontalScroll: true,

    height: "285px",
    maxHeight: "240px",
    orientation: "bot",
    //min: new Date(2017, 4, 1), // lower limit of visible range
    //max: new Date(2021, 5, 20),
    //max: new Date(2021, 6, 24), // upper limit of visible range
    zoomFriction: 4,
    moveable: true,
    zoomable: true,
    //zoomMin: 1000 * 60 * 60 * 24 ,//*31, // one day in milliseconds
    //zoomMax: 1000 * 60 * 60 * 24 * 31 * 9, // about three months in milliseconds
    tooltip: {
      followMouse: true,
    },
    onAdd: function (item, callback) {
      //LOGV && console.log("********* ONadd:", item);
      console.log("********* ONadd:", item);
      //callback(item);
    },
    onRemove: function (item, callback) {
      LOGV && console.log("item on remove:", item);
      callback(item);
      removeSes(item.id);
    },
    onUpdate: function () {
      alert("PIKOUGHPIUGHPÑIU");
    },
  };

  timeline = new vis.Timeline(container);
  timeline.setOptions(defaultOptions);
  timeline.setItems(datas);

  //d3.select("#btn-remove-all").style("display", "block")
  timeline.on('drop', function (properties) {
    console.log('DROP');
    console.log(properties)
    const prjId = properties.event.dataTransfer.getData('text/plain');
    const obj = JSON.parse(prjId);
    console.log(prjId);
    console.log(obj);
    console.log(obj.content);

  });

  timeline.on("click", function (properties) {
    var id = properties.item;
    if ((id || id == 0) && !flagClickbuttonItem) {
      LOGV && console.log("Click", properties);
      LOGV && console.log(id);
      console.log("Click", properties);
      console.log("currentOP:", currentOptChart);
      console.log("ID click", id);
      console.log("flag:", flagClickbuttonItem);
      currentId = reverseDIVotes[id];
      currentSes = dictIVotes[currentId];
      timeline.setSelection(id, { focus: false });

      if (currentOptChart == "2") {
        console.log("CVN");
        updateInfoChart2(currentSes);
        updateCvn();
        let listEntity = Object.values(entidades);
        entityList.innerHTML = "";
        ListEntitys(listEntity, colorMap, false);
      } else if (currentOptChart == "1") {
        $("#svgClusters").attr("fill", "#2e59d9");

        d3.selectAll(".grp")
          .transition()
          .duration(durationRect)
          .style("opacity", "1");
        d3.selectAll(".labeltext")
          .transition()
          .duration(durationRect)
          .style("opacity", "1");

        updateInfoChart2(currentSes);
        updateCluster(currentSes, false);
        let list = sortByOption(optionSort, nodosActuales);
        entityList.innerHTML = "";
        ListEntitys(list, colorMap, false);
        //d3.select('#g1').attr("transform", "translate(" + (-width/2 -50) + "," + (-height / 2  -50 ) + ")");
      } else if (currentOptChart == "3") {
        $("#svgParlamento").attr("fill", "#2e59d9");
        console.log("Curules");
        removeAllLinks();
        updateInfoChart2(currentSes);
        updateCurules();

        colorMap = "voto";
        optionSort = 5;
        //sortFunction(nodosActuales);
        let list = sortByOption(optionSort, nodosActuales);
        entityList.innerHTML = "";
        ListEntitys(list, colorMap, false);
      } else if (currentOptChart == "4") {
        //currentOptChart = value;
        $("#svgSets").attr("fill", "#2e59d9");
        showPsets();
        createSet();
      }

      let slider = $("#slider-votos").data("ionRangeSlider");
      slider.update({
        from: currentId,
      });
      updateSliderStyle();
    }
  });

  //mouseOver
  timeline.on("mouseOver", function (properties) {
    var id = properties.item;
    if (id || id == 0) {
      LOGV && console.log(id);
      var element = d3.select("#h" + id);
      //console.log(element)

      let parent = element.select(function () {
        return this.closest(".vis-readonly"); // Get the closest parent matching the selector string.
      });

      //console.log(parent)

      let visdelete = parent.select(".vis-delete");
      //console.log(visdelete)
      //console.log("Mouseover,", properties)
    }
  });
}


function removeAllSessionsTimeline2() {

  console.log("Removiendo todas las votaciones del timeline");

  let valuesDICT = Object.keys(idSesiones);
  console.log("a:", valuesDICT, idSesiones);
  console.log(datas)
  datas.remove(0)
  for(let key in valuesDICT){
    let id = parseInt(valuesDICT[key])
    console.log(id)
    datas.remove(id)
    //removeSes(id)
    //updateSlider()
    //datas.delete(id)
    delete idSesiones[id]
  }

  let slider = $("#slider-votos").data("ionRangeSlider");
  slider.update({
    min: 0,
    max: 1,
    from: 0,
    step: 1,
    grid: false 
  })

  //updateEmptyChart()
  updateEmptyInfo()
  //nodes = []
  //sortFunction(nodosActuales)

  currentOptChart = 1
  flagEmptyChart = true
  //flagEmptySes = true

  d3.selectAll('.grp').attr("opacity", "0")

  optionColor1()

  
  nodosCentrales()
  fillemptyicons()


  console.log("Dict de sesiones id:", idSesiones)
  //d3.timeout(chart, 500)
//
  console.log("entidades:", entidades)
  console.log("Nodos actuales:", nodosActuales)
  //console.log("nodos:", nodes)
}

function getContent2(item) {
    var itemDiv = document.createElement("div");
    itemDiv.className = "form-check"
    itemDiv.id = "h" + item.sesId

    var span3 = document.createElement("label");
    span3.className = "form-check-label textbox";
    span3.for = "h" + item.sesId
    span3.appendChild(document.createTextNode(item.asunto));
    itemDiv.appendChild(span3);

    var button = document.createElement("button");
    button.className = 'button-itemTimeline'
    //<i class="far fa-trash-alt"></i>
    var icon = document.createElement("i")
    icon.className = 'far fa-trash-alt'
    button.appendChild(icon)
    itemDiv.appendChild(button)


    itemDiv.onmouseover = function(){
        //x[0].style.display = "block"
        //flagClickbuttonItem = false
        button.style.display = "block";
    };

    itemDiv.onmouseout = function() {
        //x[0].style.display = "none"
        button.style.display = "none";
    };

    button.onmouseover = function(){
        flagClickbuttonItem = true
    }

    button.onmouseout = function(){
        flagClickbuttonItem = false
    }

    button.onclick = function() {remove()};

    function remove() {
        console.log("Remove button", item)    
        datas.remove(item.sesId)
        removeSes(item.sesId)

        let valuesDICT = Object.keys(idSesiones)
        console.log("a:",valuesDICT ,idSesiones)
        if(valuesDICT.length > 1){
            setRangeTimeline()
        }
        else if (valuesDICT.length == 1){
            console.log("solo queda uno",  valuesDICT ,idSesiones)
            //timeline.setSelection(valuesDICT[0], {focus: false});
        }
        //flagClickbuttonItem = false
    }
    
    return itemDiv
}

function removeAllSessionsTimeline() {
  /**1. comprabar IDs de sesion
   * 2. Remover todas las sesiones del timeline
   * 3. Remover todas las sesiones para el canvas
   * 4. remover lista de entidades a la derecha
   * 5. actualizar el canvas a vacio 0 entidades en la lista
   */
  console.log("Removiendo todas las votaciones del timeline");

  let valuesDICT = Object.keys(idSesiones);
  console.log("a:", valuesDICT, idSesiones);
  console.log(datas)
  datas.remove(0)
  //d3.select("#pointTimeline").selectAll("div").remove()
  shortTimeline.destroy();
  for(let key in valuesDICT){
    let id = parseInt(valuesDICT[key])
    console.log(id)
    datas.remove(id)
    //removeSes(id)
    //updateSlider()
    //datas.delete(id)
    delete idSesiones[id]
  }

  let slider = $("#slider-votos").data("ionRangeSlider");
  slider.update({
    min: 0,
    max: 1,
    from: 0,
    step: 1,
    grid: false 
  })

  //updateEmptyChart()
  updateEmptyInfo()
  //nodes = []
  //sortFunction(nodosActuales)

  currentOptChart = 1
  flagEmptyChart = true
  //flagEmptySes = true

  d3.selectAll('.grp').attr("opacity", "0")

  optionColor1()

  
  //nodosCentrales()
  fillemptyicons()


  console.log("Dict de sesiones id:", idSesiones)
  //d3.timeout(chart, 500)
//
  console.log("entidades:", entidades)
  console.log("Nodos actuales:", nodosActuales)
  //console.log("nodos:", nodes)
}

