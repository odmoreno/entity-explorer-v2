/**
 * Timeline de vis.js
 */
var LOGVS = true;

var datas2;
var shortTimeline;
var defaultOptions2;

const drawArea = document.getElementById('canvas');
//drawArea.addEventListener('click', startRect);
//drawArea.addEventListener('mousemove', setMousePos)

function startRect(ev) {
  console.log("Click in canvas")
  console.log(ev)
}

function setMousePos(ev){
  console.log("mouse move in canvas")
  //console.log(ev)
}

function createTimelineEvents2() {
  //console.log("Ses LIST:", Object.values(sesiones))

  datas2 = createDataset();

  //datas2 = new vis.DataSet([items]);

  var container = document.getElementById('pointTimeline');

  defaultOptions2 = {
    showMajorLabels: false,
    showMinorLabels: false,
    stack: false,
    showCurrentTime: false,
    horizontalScroll: true,
    height: '50px',
    maxHeight: '300px',
    orientation: 'bot',
    min: new Date(1954, 5, 1), // lower limit of visible range
    max: new Date(2021, 10, 20),
    //zoomMin: 1000 * 60 * 60 * 24 *31, // one day in milliseconds
    //zoomMax: 1000 * 60 * 60 * 24 * 31 * 9, // about three months in milliseconds
    zoomFriction: 4,
    moveable: true,
    zoomable: true,
    tooltip: {
      followMouse: true,
    },
  };

  shortTimeline = new vis.Timeline(container);
  shortTimeline.setOptions(defaultOptions2);
  shortTimeline.setItems(datas2);
  //shortTimeline.setWindow(values[0], values[1]);
  shortTimeline.fit();

  shortTimeline.on('click', function (properties) {
    var id = properties.item;
    //shortTimeline.setSelection(id, { focus: false });
    if ((id || id == 0) && !flagClickbuttonItem) {
      LOGV && console.log('Click', properties);
      LOGV && console.log(id);
      console.log('Click', properties);
      console.log('currentOP:', currentOptChart);
      console.log('ID click', id);
      console.log('flag:', flagClickbuttonItem);
      currentId = reverseDIVotes[id];
      currentSes = dictIVotes[currentId];

      if (currentOptChart == '2') {
        console.log('CVN');
        updateInfoChart2(currentSes);
        updateCvn();
        let listEntity = Object.values(entidades);
        entityList.innerHTML = '';
        ListEntitys(listEntity, colorMap, false);
      } else if (currentOptChart == '1') {
        $('#svgClusters').attr('fill', '#2e59d9');

        d3.selectAll('.grp')
          .transition()
          .duration(durationRect)
          .style('opacity', '1');
        d3.selectAll('.labeltext')
          .transition()
          .duration(durationRect)
          .style('opacity', '1');

        updateInfoChart2(currentSes);
        updateCluster(currentSes, false);
        let list = sortByOption(optionSort, nodosActuales);
        entityList.innerHTML = '';
        ListEntitys(list, colorMap, false);
        //d3.select('#g1').attr("transform", "translate(" + (-width/2 -50) + "," + (-height / 2  -50 ) + ")");
      } else if (currentOptChart == '3') {
        $('#svgParlamento').attr('fill', '#2e59d9');
        console.log('Curules');
        removeAllLinks();
        updateInfoChart2(currentSes);
        updateCurules();

        colorMap = 'voto';
        optionSort = 5;
        //sortFunction(nodosActuales);
        let list = sortByOption(optionSort, nodosActuales);
        entityList.innerHTML = '';
        ListEntitys(list, colorMap, false);
      } else if (currentOptChart == '4') {
        //currentOptChart = value;
        $('#svgSets').attr('fill', '#2e59d9');
        showPsets();
        createSet();
      }

      let slider = $('#slider-votos').data('ionRangeSlider');
      slider.update({
        from: currentId,
      });
      updateSliderStyle();
    }
  });

  //mouseOver
  shortTimeline.on('mouseOver', function (properties) {
    var id = properties.item;
    console.log("mouseOVER:", properties)
    if (id || id == 0) {
      LOGV && console.log(id);
      var element = d3.select('#h' + id);
      //console.log(element)

      let parent = element.select(function () {
        return this.closest('.vis-readonly'); // Get the closest parent matching the selector string.
      });

      //console.log(parent)

      let visdelete = parent.select('.vis-delete');
      //console.log(visdelete)
      //console.log("Mouseover,", properties)
    }
  });
}

function createDataset() {
  let items = [];
  let elements = [];
  let list = [];

  if (organismoOp == 1) {
    list = Object.values(sesiones);
  } else if (organismoOp == 2) {
    list = Object.values(unResolutions);
  }
  console.log('List');

  list.map((item) => {
    let fecha;
    let hora;

    if (organismoOp == 1) {
      fecha = item.fecha.split('-');
      hora = item.hora.split(':');
    } else if (organismoOp == 2) {
      fecha = item.date.split('-');
    }

    let node = {
      id: item.sesId,
      className: 'stimelineElement' + ' m_' + item.sesId,
      group: item.anio,
      //content: getContent(item),
      asunto: item.asunto,
      title: organismoOp == 1 ? item.name : item.unres,
      type: 'point',
      start: startDateSelec(fecha, hora),
      end: endDateSelect(fecha, hora),
    };

    elements.push(node);
  });

  /**
   * <div>Conversation</div><img src="../resources/img/community-users-icon.png" style="width:32px; height:32px;">'
   * '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"><label class="form-check-label" for="flexCheckDefault">Default checkbox</label></div>',
   
   *  '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"><label class="form-check-label" for="flexCheckDefault">'
   + item.name + '</label></div>',
   */
  LOGVS && console.log('items timeline:', elements);
  //console.log('dataset:', Object.values(elements))
  items = new vis.DataSet(elements);
  return items;
}
