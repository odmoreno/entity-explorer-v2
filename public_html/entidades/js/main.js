/*
 *    main.js
 *    Explorador de entidades
 */

var LOG = false;

/*** Datos a cargar */
const promises = [
  d3.json("../data/info.json"),
  d3.json("../data/nodos.json"),
  d3.json("../data/data.json"),
  d3.json("../data/links.json"),
  d3.json("../data/glinks.json"),
  d3.json("../data/UNres.json"),
  d3.json("../data/paises.json"),
];

Promise.all(promises)
  .then((allData) => {
    let info = allData[0];
    asambleistas = allData[1];
    sesiones = allData[2];
    enlaces = allData[3];
    gEnlaces = allData[4];
    unResolutions = allData[5];
    paisesUN = allData[6];

    partidos = info.partidos;
    codPartidos = info.codPartidos;
    regiones = info.regiones;
    provincias = info.provincias;
    comisiones = info.comisiones;

    partidosId = Object.values(partidos);
    regionesId = Object.values(regiones);
    provId = Object.values(provincias);
    comisionesId = Object.values(comisiones);

    console.log("info", info)
    console.log("asams", asambleistas)
    console.log("votaciones", sesiones)
    console.log("Enlaces", enlaces)
    console.log("UN Res", unResolutions);
    console.log("Paises", paisesUN);

    manageData();
  })
  .catch((err) => console.log(err));

function manageData() {

  console.log("LODASH", _.round(4.006))
  
  createGroups();
  //testChart()
  initChart();
  //udpateChartCvn(0)
  //createTimelineEvents();
  //createTimelineEvents2();
  //id, option, flag, height, maxHeight, orientation) {
  
  timelineLarge = new TimelineObj(
    'timelineVis',
    organismoOp,
    false,
    '275px',
    '585px',
    'top', //orientacion
    'box'
  );
  console.log(timelineLarge)
  timeline = timelineLarge.timeline
  //console.log(timeline)
  startShortTl()
  console.log("Current dataset", organismoOp)
}


/**Eventos */

//buyscador de entidades
$("#searchEntity")
  .on("input", function () {
      listaResultados.innerHTML = ''
      valueText =  this.value
      findEntities(this.value)
      if(this.value != ''){
        searchSesiones(this.value)
      }
  })
  .on("click", function () {
      listaResultados.innerHTML = ''
      valueText =  this.value
      findEntities(this.value)
      if(this.value != ''){
        searchSesiones(this.value)
      }
  })

$("#searchArea")
  .on("mouseleave", function(){
    fueradelbuscadorEntidades()
  })

  //Buscar los votos  
$("#searchVotes")
.on("input", function () {
    //LOG && console.log('On input', this.value)
    //resetFlags()
    let value =  this.value
    searchSesiones(value)
})
.on("click", function () {
    //LOG && console.log('On click', this.value)
    //resetFlags()
    searchSesiones(this.value)
})

//buscar entidades dentro del layout
$("#searchEntityList")
.on("input", function () {
  //console.log("On input")
  entityList.innerHTML = ''
  searchEntitysinList(this.value)
})
.on("click", function () {
  //console.log("On click")
  entityList.innerHTML = ''
  this.value = ''
  $("#searchEntityList")[0].innerHTML = ''
  searchEntitysinList('')

})

$('.input-daterange').datepicker({
  orientation: "top auto",
  language: "es",
  autoclose: true,
});

$('.input-daterange input').each(function() {
  $(this).datepicker('clearDates');
  
  $(this)
    .datepicker()
    .on("changeDate", function (e) {
      console.log($(this).attr("id"));
      console.log("changeDate:", e.date);
      datesRange[$(this).attr("id")] = e.date;
      //console.log($(this).datepicker())
      console.log(datesRange);
      $(this).datepicker("update", e.date);
      setWindowsTimeline();
    });

  
  

});



function setWindowsTimeline () {
  let values = Object.values(datesRange)
  console.log(datesRange)
  oninputDates(values)
  
  //if(values.length == 2 ){
  //  shortTimeline.setWindow(values[0], values[1]);
  //}

}


//const canvas = document.getElementById('canvas')
$(document).keydown(function(e) {
  if(e.key == "Shift"){
     console.log("SHIFT press")
     svgTl.on('.zoom', null);

     if(!hasbrush){
       createBrush();
       hasbrush = true
     }
     //shiftPressed = true
   }
})
.keyup(function(e) {
  if (e.key == "Shift") { 
    console.log("SHIFT up")
    if(hasbrush){
      svgTl.call(zoomTl2)
      //d3.select('.brush').remove()
      hasbrush = false
    }
    //shiftPressed = false;
  }
});

window.addEventListener('click', function(e){    
  if (document.getElementById('div-entity').contains(e.target) || document.getElementById('searchEntity').contains(e.target)){
    // Clicked in box
    //console.log("Inside")
  } else{
    console.log("outside")
    entityList.innerHTML = ''
    this.value = ''
    searchEntitysinList('')
    // Clicked outside the box
  }
  $(document).keydown(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
       console.log("Trigger ESC")
       fueradelbuscadorEntidades()
     }
     else if(e.key == "Shift"){
       //console.log("SHIFT press")
       shiftPressed = true
     }
  })
  .keyup(function(e) {
    if (e.key == "Shift") { 
      //console.log("SHIFT up")
      shiftPressed = false;
    }
  });
});

$('#colores-select').multiselect({
  buttonWidth: '100%',
  onChange: function () {
      //editColorsNodes()
      colorMap = $('#colores-select').val()
      defaultColorFlag = false
      console.log("cambio de color a:", colorMap)
      //selectChart()
      updateNodes()
  }
});


getIdSes = (id) =>{
  flagEmptyChart = false
  LOG && console.log("Anadir sesion ", id)
  //resetFlags()
  addSesion(id)
}

function addSesion(id){
  if (id in idSesiones) {
    LOG && console.log("Esta en uso")   
    return;
  }else {
    
    if(organismoOp == 1){      
      idSesiones[id] = sesiones[id]
    }
    else if(organismoOp == 2){
      idSesiones[id] = unResolutions[id]
    }


    listIndicesVotes.push(id)
    totalDict = listIndicesVotes.length -1 
    if(!flagindex)
      countIndex = countIndex +1
  
    
    updateSlider()
    flagindex = false
  }
  
  LOG && console.log("Sesiones anadidas:", idSesiones)
  currentSes = id
  //let sesionesID = d3.keys(idSesiones)
  //let index = sesionesID.indexOf(currentSes)
  //console.log("index:", index, "id:", currentSes)
  //currentId = index
  currentId = reverseDIVotes[id]
  //console.log("ReverseDICT:", reverseDIVotes, "currentID:", currentId)
  
  let valuesDICT = Object.keys(idSesiones)
  LOG && console.log("KEYS:", valuesDICT)
  lastIdS = valuesDICT[valuesDICT.length-1]
  firstIds = valuesDICT[0]
  LOG && console.log("LastVALUE:", lastIdS, "FIRST:", firstIds)
  //addSesionToList(id)
  //updateChart(id, false)
}

function addSesion2(id){
  flagEmptyChart = false
  LOG && console.log("Anadir sesion ", id)
  if (id in idSesiones) {
    LOG && console.log("Esta en uso")   
    return;
  }else {
    
    if(organismoOp == 1){      
      idSesiones[id] = sesiones[id]
    }
    else if(organismoOp == 2){
      idSesiones[id] = unResolutions[id]
    }


    listIndicesVotes.push(id)
    totalDict = listIndicesVotes.length -1 
    if(!flagindex)
      countIndex = countIndex +1
    updateSlider()
    flagindex = false
  }
  currentSes = id
  currentId = reverseDIVotes[id]

  let valuesDICT = Object.keys(idSesiones)
  LOG && console.log("KEYS:", valuesDICT)
  lastIdS = valuesDICT[valuesDICT.length-1]
  firstIds = valuesDICT[0]
  LOG && console.log("LastVALUE:", lastIdS, "FIRST:", firstIds)
  
}

function removeSes(id) {
  let tmpid = 'sesion' + id
  LOG && console.log("Function onclick", tmpid)
  idSesiones[id].estado = 0

  LOG && console.log(idSesiones)
  delete idSesiones[id]

  removeElementFromSlider(id)
  countIndex = countIndex -1
  updateSlider()

  console.log("SEsiones:", sesiones)

  let valuesDICT = Object.keys(idSesiones)
  LOG && console.log("KEYS:", valuesDICT)
  console.log("KEYS:", valuesDICT)
  console.log("REverseKEYS:", reverseDIVotes)
  
  lastIdS = valuesDICT[valuesDICT.length-1]
  firstIds = valuesDICT[0]
  currentSes = firstIds

  currentId = reverseDIVotes[firstIds]

  LOG && console.log("CurrentSES:", currentSes)
  LOG && console.log("CurrentID:", currentId)
  console.log("CurrentSES:", currentSes)
  console.log("CurrentID:", currentId)

  flagClickbuttonItem = true

  updateChartByOption(currentSes)

  findsesion(currentSes)
}

function updateChartByOption(){
  
  //if(currentOptChart == 1){
  //  d3.timeout( updateChartHandler, 500)
  //}
  //else{
  //  d3.timeout(updateCvn, 500)
  //}

  handlechart(currentOptChart)
  
  d3.timeout(()=>{

    flagClickbuttonItem = false
    console.log("UP flag:", flagClickbuttonItem)
  },500)
  

}


function createGroups (){
  let list = Object.values(asambleistas)
  partidosG = dataGroup(list, 'partido')
  regionesG = dataGroup(list, 'region')
  provG = dataGroup(list, 'provincia')
  comG = dataGroup(list, 'comision')

  LOG && console.log('Cluster Part: ', partidosG)
  LOG && console.log('Cluster Reg: ', regionesG)
  LOG && console.log('Cluster Prov: ', provG)
  LOG && console.log('Cluster Comision: ', comG) 
}

function  _groups ()  {
  const groups = {
    si: { x: (1.5 * width) / 6, y: height / 6, cnt: 0, fullname: "Sí" },
    no: { x: (3 * width) / 4, y: height / 6, cnt: 0, fullname: "No" },
    ausente: {
      x: width / 5,
      y: (2 * height) / 2.5,
      cnt: 0,
      fullname: "Ausente",
    },
    abstencion: {
      x: (3.5 * width) / 4,
      y: (2 * height) / 2.5,
      cnt: 0,
      fullname: "Abstención",
    },
    blanco: {
      x: width / 2 + 29,
      y: (2 * height) / 2.5,
      cnt: 0,
      fullname: organismoOp == 1 ? "Blanco" : "No miembro",
    },
  };
  return groups;
};


// funcion para obtener grupos
function dataGroup (newnodes, groupMap) {
  let group;
  if (groupMap == 'region')
      group = Array.from(d3.group(newnodes, d=> d.region))
  else if (groupMap == 'partido')
      group = Array.from(d3.group(newnodes, d=> d.partido))
  else if (groupMap == 'provincia')
      group = Array.from(d3.group(newnodes, d=> d.provincia))
  else if (groupMap == 'voto')
      group = Array.from(d3.group(newnodes, d=> d.voto))
  /*else if (groupMap == 'comision')
      group = Array.from(d3.group(newnodes, d=> {
        if(d.comisiones.length > 0){
          //console.log(d.comisiones[0].comision)
          return d.comisiones[0].comision
        }
        else{
          return ""
        }
      } ))*/

  return group;
}

/*Dropdown Menu*/
$('.dropdown2').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu2').slideToggle(300);
});
$('.dropdown2').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu2').slideUp(300);
});
$('.dropdown2 .dropdown-menu2 li').click(function () {
  $(this).parents('.dropdown2').find('span').text($(this).text());
  $(this).parents('.dropdown2').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/


handleDataset = (value) =>{

  console.log('HANDLE DATASET:', value);
  
  if (value == 1) {
    organismoOp = 1;
    colorMap = 'partido';
    globalThis.colorMap = 'partido';
  } else if (value == 2) {
    organismoOp = 2;
    colorMap = 'region';
    console.log('COLORMAP:', colorMap);
    globalThis.colorMap = 'region';
  }
  
  console.log('Global:', globalThis.colorMap, globalThis);
  //initChart()
  updateEmptyChart();
  
  
  circles
    .transition()
    .duration(durationRect)
    .style('opacity', () => {
      LOGC && console.log('eliminar');
      return 0;
    })
    .remove();

  texts.remove();
  grptexts.selectAll('.grp').remove();

  let listEntity = Object.values(entidades);
  let list = sortByOption(optionSort, listEntity);
  entityList.innerHTML = '';
  ListEntitys(list, colorMap, false);

  fueradelbuscadorEntidades();

  removeAllSessionsTimeline();

  idSesiones = {};
  lastIdS;
  firstIds;

  resetValuesSlider();
  createTimelineEvents2()
}

function fillemptyicons(){
  $("#svgParlamento").attr("fill", "#cecece");
  $("#svgClusters").attr("fill", "#cecece");
  $("#svgCovotingNetworks").attr("fill", "#cecece");
}

$('#collapseOne').on('hidden.bs.collapse', function () {
  // do something…
  const value = heightTl + marginTl.left +20
  console.log("HIDDEN", value)
  timeline.setOptions({
    height: 275+value + 'px',
  });
  d3.select('#fecha-rango').style("display", "none")
})


$('#collapseOne').on('shown.bs.collapse', function () {
  // do something…
  console.log("SHWON")
  timeline.setOptions({
    height: (275-value) + 'px',
  });
  d3.select('#fecha-rango').style("display", "block")
})