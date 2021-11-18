/**
 * Controlador de todos los layouts
 */

let LOGL = false;


var nodes;
let nodosActuales ={}

//Manipular graficos
let currentOptChart = "1"

let doNotAnimate = false

//chart de entidades
let flagEmptySes = true
let flagEmptyChart = true

//item button handler click
let flagClickbuttonItem = false

//flag para informar si se agregaron nuevas entidades al canvas y poder actualizar
// si es true se hacen cambios, sino no se conservan
let newEntityAddedFlag = true

let defaultColorFlag = true


let codeVotes = {
  "0" : "abstencion",
  "1" : "ausente",
  "2" : "si",
  "3" : "no",
  "4" : "blanco"
}

let voteCodes = {
  "abstencion": 0,
  "ausente": 1,
  "si": 2,
  "no": 3,
  "blanco": 4
}

/**
 *"1" : "yes",
  "2" : "abstain",
  "3" : "no",
  "8" : "absent",
  "9" : "not a member",
 */
let UNcodes = {
  "1" : "si",
  "2" : "abstencion",
  "3" : "no",
  "8" : "ausente",
  "9" : "blanco",

}

let votesSet = [0, 1, 2, 3, 4]

let valueText = '';

let idsOpacidad = {}

//Dimensiones del chart principal
let height = 720//$('#chart').height()
let width = $('#chart').width()
let margin = {left: 80, right: 20, top: 70, bottom: 100};

console.log("Tam:", width)

console.log(height)
let durationRect = 1000

/** D3 html  */
const svg = d3.select("#chart").append("svg").attr('id', 'svg1')
  .attr("viewBox", [-width / 2, (-height / 2) - 25, width + 100, height + 100])
  .attr("width", width) // + margin.left + margin.right)
  .attr("height", height) // + margin.top + margin.bottom)
  .attr("ondrop", "drop(event)")
  .attr("ondragover", "allowDrop(event)")
  //.style("background-color", 'red')
  .append("g")
  .attr('id', 'g1')
  .attr("transform", "translate(" + (-width / 2 + 50) + "," + (-height / 2 - 50) + ")")
  .call(d3.zoom().scaleExtent([0.9, 8]).on("zoom", zoomed))
  //.attr("transform", "translate(" + (-50) + "," + (-30 ) + ")");
  .on("click", ()=> {
    console.log("SVG CLICK")
    //circles.attr("opacity", "1")
    //texts.style("opacity", "1")
    //desopacarLista()
    //Object.keys(idsOpacidad).forEach((id)=>{
    //  let element = idsOpacidad[id]
    //  d3.select("#"+ id).attr("fill", (element) => color(element, globalThis.colorMap))
    //  idsOpacidad[id].value = 2
    //})

    loopIdsOpacidad()

    d3.event.stopPropagation();

  })

var rect = svg.append("rect")
  .attr("fill", "none")
  .attr("width", width)
  .attr("height", height)
  //.attr(
  //  "transform",
  //  "translate(" + (-width / 2 + 50) + "," + (-height / 2 - 50) + ")"
  //)
  .attr("pointer-events", "all")

//Elementos del svg 
let g = svg.append("g")
        .attr('id', 'group')

let circles = g.selectAll("nodeCircle").attr("transform", "translate(0,0)").style("pointer-events", "all");
let grptexts = svg.append("g").attr('id', 'grpTexts').attr("transform", "translate(0,0)")
let texts = g.selectAll("text").attr("transform", "translate(0,0)")

let pl = svg
  .append("g")
  .attr("id", "plenosuperior")
  .attr("transform", "translate(" + 0 + ", " + 0 + ")")
  .style("opacity", "0");

let sup = d3.select("#plenosuperior");

let pl2 = d3
  .select("#chart-area")
  .select("svg")
  .append("g")
  .attr("id", "curul")
  .attr("transform", "translate(" + -400 + ", " + -200 + ")");

      
//d3.select("#svg1")
//  .append("rect")
//  .attr("fill", "none")
//  .attr("pointer-events", "all")
//  .attr("width", width)
//  .attr("height", height)
//  .attr(
//    "transform",
//    "translate(" + (-width / 2 + 50) + "," + (-height / 2 - 50) + ")"
//  )
//  .call(d3.zoom().scaleExtent([0.9, 8]).on("zoom", zoomed));

let tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html(function (d) {
    //console.log(d)
    return showTipBy(d)
  })
  .offset([-12, 0]);
svg.call(tip);

showTipBy = (d) => {
  if(organismoOp == 1){
    //console.log(d)
    let html = `<div class="d-flex flex-column" id="tooltip">
        <strong class="p-1 textTip"><span style="color: #1375b7" >${
          d.nombre
        } (${partidosInfo[d.codpartido].shortname})</span></strong>
        <span id="asambTip" class="p-1" style="display: none;"><span style='text-transform:capitalize' >Legislador ${
          d.tipo == "nacional" ? d.tipo : ` por ${d.provincia}`
        }</span></span>
        <span id="votoTip" class="p-1" style="display: none;"><span style='text-transform:capitalize' >Voto: ${
          d.voto
        }</span></span>
        <span id="partidoTip" class="p-1" style="display: none;"><span style='text-transform:capitalize' >Partido: ${
          d.partido
        }</span></span>
      </div>`;
    return html;
  }
  else if(organismoOp == 2){
    let html = `<div class="d-flex flex-column" id="tooltip">
        <strong class="p-1 textTip"><span style="color: #1375b7" >${
          d.nombre
        } (${d.idnombre})</span></strong>
        <span id="asambTip" class="p-1" style="display: none;"><span style='text-transform:capitalize' >${groupCodes[d.region]}</span></span>
        <span id="votoTip" class="p-1" style="display: none;"><span style='text-transform:capitalize' >Voto: ${
          d.voto
        }</span></span>
      </div>`;
    return html;
  }
}


//Context Menu
var menu = [
  {
    title: "Resaltar",
    action: function (elm, d, i) {
      LOGC && console.log("Resaltar");
      LOGC && console.log(d);

      if (d.labelFlag == false) {
        LOGC && console.log("no visitado");
        d3.select("#node" + d.numeroid)
          .attr("stroke", "orange")
          .attr("stroke-width", 3.0);
        //d3.select("#text" + d.numeroid).attr("visibility", "visible");
        d3.select("#e" + d.numeroid).style("border", "2px solid orange");
        d.labelFlag = true;
        entidades[d.numeroid].labelFlag = true;
      } else {
        d3.select("#node" + d.numeroid)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0);
        //d3.select("#text" + d.numeroid).attr("visibility", "hidden");
        d3.select("#e" + d.numeroid).style("border", "2px solid white");
        d.labelFlag = false;
        entidades[d.numeroid].labelFlag = false;
      }
    },
  },
  {
    title: "Eliminar",
    action: function (elm, d, i) {
      LOGC && console.log(elm, d, i);
      LOGC && console.log("Eliminar!");
      LOGC && console.log(d);
      //removeEntityChart(d.numeroid);
    },
  },
];




function removeAllLinks(){
  d3.timeout( mainLinksR , 500)
}

function mainLinksR(){
  let links = d3.selectAll('.links').style('opacity','0')
  //console.log("ELEMENTS:", links)
  //links.remove()
}

function updateChartHandler(){
  console.log("ses handler:", currentSes)
  updateCluster(currentSes, false)
}


function hideVotesGrp(){
  d3.selectAll(".grp").transition().duration(durationRect).attr("opacity", "0") 
}

function showVotesGrp(){
  d3.selectAll(".grp").transition().duration(durationRect).attr("opacity", "1") 
}

function optionColor1() {
  console.log("option 1", defaultColorFlag)
  
  if(organismoOp == 1){      
    if (defaultColorFlag) {
      //colorMap = "partidos";
      globalThis.colorMap = "partidos"
      optionSort = 1;
      console.log("default", colorMap)
    } else {
      //colorMap = $("#colores-select").val();
      globalThis.colorMap = $("#colores-select").val();
    }  
  }
  else if(organismoOp == 2){
    globalThis.colorMap = "region";
  }

}

function optionColor2() {
  console.log("option 2", defaultColorFlag)

  if(organismoOp == 1){      
    if (defaultColorFlag) {
      globalThis.colorMap = "voto";
      optionSort = 1;
      console.log("default", colorMap)
    } else {
      globalThis.colorMap = $("#colores-select").val();
    }
  }
  else if(organismoOp == 2){
    globalThis.colorMap = "voto";
  }

  
}


/**Manejar el chart del layout*/
function handlechart(value) {
  
  if (currentOptChart == value) {
    console.log("No actualizar");
  } else {
    $("#svgParlamento").attr("fill", "#cecece");
    $("#svgClusters").attr("fill", "#cecece");
    $("#svgCovotingNetworks").attr("fill", "#cecece");
    $("#svgSets").attr("fill", "#cecece");

    if (value == "2") {
      LOG && console.log("CVN");
      $("#svgCovotingNetworks").attr("fill", "#2e59d9");

      hidePsets()
      hideVotesGrp()

      d3.selectAll(".labeltext")
        .transition()
        .duration(durationRect)
        .style("display", "block");

      optionColor1()
      updateInfoChart2(currentSes)

      let listEntity = Object.values(entidades);
      let list = sortByOption(optionSort, listEntity)
      entityList.innerHTML = ''
      ListEntitys(list, globalThis.colorMap, false)

      d3.timeout(updateCvn, 500);
      currentOptChart = value;

      updateLegends()

    } else if (value == "1") {
      $("#svgClusters").attr("fill", "#2e59d9");
      //
      

      hidePsets()
      LOG && console.log("Entidades");
      currentOptChart = value;

      updateInfoChart2(currentSes)
      optionColor1()
      
      //removeAllLinks()
      if (!flagEmptyChart) {
        d3.timeout(updateChartHandler, 500);
      } else {
        if (!flagEmptySes) {
          updateNodes();
        }
      }
      //colorMap = "voto";
      //sortFunction(nodosActuales)
      let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, globalThis.colorMap, false)
      updateLegends()

    } else if (value == "3") {
      $("#svgParlamento").attr("fill", "#2e59d9");

      hidePsets()
      currentOptChart = value;
      removeAllLinks();
      hideVotesGrp()
      updateInfoChart2(currentSes)
      optionColor2()
      d3.timeout(updateCurules, 500);
      //sortFunction(nodosActuales);

      let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, globalThis.colorMap, false)
      
      updateLegends()
    }
    else if(value == "4"){
      currentOptChart = value;
      $("#svgSets").attr("fill", "#2e59d9");
      showPsets()
      hideVotesGrp()
      createSet()
      colorMap = "partidos";
      let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)
      
      updateLegends()
    }
  }
}

function showPsets(){
  d3.select("#g1").transition().duration(durationRect).attr("opacity", "0") 
  gsets.transition().duration(durationRect).attr("opacity", "1") 
  //leginline.transition().duration(durationRect).style('opacity', 1)
}

function hidePsets(){
  d3.select("#g1").transition().duration(durationRect).attr("opacity", "1") 
  gsets.transition().duration(durationRect).attr("opacity", "0") 
  //leginline.transition().duration(durationRect).style('opacity', 0)
}

function initChart() {
  
  if(organismoOp == 1){      
    testChart()
  }
  else if(organismoOp == 2){
    console.log("a")
  }
}


//Funcion con entidades por defecto agregadas
function testChart() {

  groups = _groups()

  d3.values(asambleistas).map(function (asamb) {
      if (true) {//asamb.partido == 'creo' || asamb.partido == 'suma'
          asamb.labelFlag = false
          //entidades[asamb.numeroId] = asamb
      }
  })
  LOGC && console.log("Entidades selecc: ", entidades)
  LOGC && console.log("total: ", d3.values(entidades).length)

  let newnodos = updateSesion(sesiones[currentSes])
  nodes = createNodes(newnodos, groups)

  colorMap = $('#colores-select').val()
  //updateInfoChart(sesiones[currentSes])

  //updateTable(nodes)

  //chart()
  //sortFunction(nodosActuales)
  ////ListEntitys(nodosActuales)

  LOGC && console.log("Nodos Actuales :", Object.values(nodosActuales).length, nodosActuales)
  LOGC && console.log("entidades: ", Object.values(entidades).length, entidades)
  LOGC && console.log("newnodes: ", Object.values(newnodos).length, newnodos)
  //console.log("Nodes:", nodes)
}


// Create node data.
createNodes = (nodos, groups) => {
  console.log("GRUPO NUEVOI DE NODOS:", nodos)
  let nodes = [];

  let votoNo = nodos.filter((nodo) => nodo.voto == "no");
  let votoBla = nodos.filter((nodo) => nodo.voto == "blanco");
  let votoAbs = nodos.filter((nodo) => nodo.voto == "abstencion");
  let votoSi = nodos.filter((nodo) => nodo.voto == "si");
  let votoAus = nodos.filter((nodo) => nodo.voto == "ausente");

  sortByOptionVotes(votoNo, votoBla, votoAbs, votoSi, votoAus);

  pointsForMatrix(votoNo, groups, nodes, "no");
  pointsForMatrix(votoBla, groups, nodes, "bla");
  pointsForMatrix(votoAbs, groups, nodes, "abs");
  pointsForMatrix(votoSi, groups, nodes, "si");
  pointsForMatrix(votoAus, groups, nodes, "aus");

  LOGL && console.log("Create for votes:", nodes);

  let validnodes = [];
  validnodes = [...nodes];

  return validnodes;
};

sortByOptionVotes = (votoNo, votoBla, votoAbs, votoSi, votoAus) => {
  //colorMap = $("#colores-select").val();
  //if (colorMap == "provincia") {
  let colorOption = globalThis.colorMap
  console.log("Color opt sort:", colorOption)
  if (colorOption == "provincia") {
    optionSort = 4;
    votoNo.sort((a, b) =>
      a.provincia > b.provincia? 1: b.provincia > a.provincia? -1
        : b.nombre > a.nombre? -1: a.nombre > b.nombre? 1: 0
    );
    votoBla.sort((a, b) =>
      a.provincia > b.provincia
        ? 1
        : b.provincia > a.provincia
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAbs.sort((a, b) =>
      a.provincia > b.provincia
        ? 1
        : b.provincia > a.provincia
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoSi.sort((a, b) =>
      a.provincia > b.provincia
        ? 1
        : b.provincia > a.provincia
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAus.sort((a, b) =>
      a.provincia > b.provincia
        ? 1
        : b.provincia > a.provincia
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
  } else if (colorOption == "region") {
    optionSort = 3;
    votoNo.sort((a, b) =>
      a.region > b.region
        ? 1
        : b.region > a.region
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoBla.sort((a, b) =>
      a.region > b.region
        ? 1
        : b.region > a.region
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAbs.sort((a, b) =>
      a.region > b.region
        ? 1
        : b.region > a.region
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoSi.sort((a, b) =>
      a.region > b.region
        ? 1
        : b.region > a.region
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAus.sort((a, b) =>
      a.region > b.region
        ? 1
        : b.region > a.region
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
  } else {
    optionSort = 2;
    votoNo.sort((a, b) =>
      a.codpartido > b.codpartido
        ? 1
        : b.codpartido > a.codpartido
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoBla.sort((a, b) =>
      a.codpartido > b.codpartido
        ? 1
        : b.codpartido > a.codpartido
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAbs.sort((a, b) =>
      a.codpartido > b.codpartido
        ? 1
        : b.codpartido > a.codpartido
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoSi.sort((a, b) =>
      a.codpartido > b.codpartido
        ? 1
        : b.codpartido > a.codpartido
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
    votoAus.sort((a, b) =>
      a.codpartido > b.codpartido
        ? 1
        : b.partido > a.partido
        ? -1
        : b.nombre > a.nombre
        ? -1
        : a.nombre > b.nombre
        ? 1
        : 0
    );
  }
};

//create points for matrix , and return nodes
pointsForMatrix = (votos, groups, nodes, opc) => {
  let dictM = {};
  let dataset = [];
  let count = 0;

  let sizeVotos = votos.length;
  let rowSize = 5;

  if (sizeVotos > 20) rowSize = 7;
  if (sizeVotos > 30) rowSize = 8;
  if (sizeVotos > 40) rowSize = 9;
  if (sizeVotos > 50) rowSize = 10;
  if (sizeVotos > 60) rowSize = 11;
  if (sizeVotos > 70) rowSize = 12;
  if (sizeVotos > 80) rowSize = 13;
  if (sizeVotos > 90) rowSize = 14;
  if (sizeVotos > 100) rowSize = 15;
  if (sizeVotos > 110) rowSize = 16;

  let size = Math.ceil(sizeVotos / rowSize);
  LOGL && console.log("Size:", size);

  for (var y = 0; y < size; y++) {
    var tempData = [size];
    for (var x = 0; x < rowSize; x++) {
      var dataDict = {
        x: x * rectSpaceSize,
        y: y * rectSpaceSize,
        //x: x*(rectSpaceSize+3), y: y*(rectSpaceSize+8)
      };
      tempData[x] = dataDict;
      dictM[count] = dataDict;
      count = count + 1;
    }
    dataset.push(tempData);
  }
  //console.log("Dataset:", dataset)
  //console.log("Dict:", dictM)

  votos.map(function (d, i) {
    groups[d.voto].cnt += 1;

    let tmp = groups[d.voto].x;
    if (votos.length > 2)
      tmp = groups[d.voto].x + calculateSpace(opc, sizeVotos);

    let nodeu = {
      id: "node" + d.numeroId,
      numeroId: d.numeroId,
      x: tmp + dictM[i].x, //Math.random() * (-10 - 60) + (-10),
      y: groups[d.voto].y + dictM[i].y,
      oldx: tmp + dictM[i].x, //Math.random() * (-10 - 60) + (-10),
      oldy: groups[d.voto].y + dictM[i].y,
      xOffset: d.xOffset,
      yOffset: d.yOffset,
      voto: d.voto,
      lastvoto: d.lastvote,
      group: d.voto,
      partido: d.partido,
      codpartido: d.codpartido,
      nombre: d.nombre,
      idnombre: organismoOp == 1? d.id : d.country,
      opacidad: 1,//d.opacidad,
      provincia: d.provincia,
      region: d.region,
      tipo: d.tipo,
      comisiones: d.comisiones,
      curul: d.curul,
      visitado: d.visitado,
      labelFlag: d.labelFlag,
    };

    nodes.push(nodeu);
  });
};
calculateSpace = (opc, size) => {
  let value;
  if (rectSize == 40) {
    value = -140;
  } else if (rectSize == 35) {
    value = -120;
  } else if (rectSize == 30) {
    value = -100;
  } else if (rectSize == 25) {
    value = -75;
  }

  if (opc == "si") {
    if (size > 10) {
      value = value + 17;
    }
    if (size > 30) {
      value = value - 20;
    }
    if (size > 40 || size > 50) {
      value = value - 30;
    }
    if (size > 60 || size > 70) {
      value = value - 40;
    }
    if (size > 80 || size > 90) {
      value = value - 50;
    }
    if (size > 100 || size > 110 || size > 120) {
      value = value - 75;
    }
  } else if (opc == "no") {
    if (size > 10) {
      value = value + 5;
    }

    if (size > 10) {
      value = value + 20;
    }
    if (size > 20) value = value - 10;

    if (size > 30 || size > 40 || size > 50) {
      value = value - 55;
    }
    if (size > 60 || size > 70 || size > 80) {
      value = value - 65;
    }
    if (size > 90 || size > 100 || size > 110) {
      LOGL && console.log("mayor a 100", value);
      value = value - 40;
    }
  } else if (opc == "abs") {

    if (size > 10) value = value + 20;
    if (size > 20) value = value -20;

   
    if (size > 30 || size > 40 || size > 50) {
      value = value -25;
    }
    if (size > 60 || size > 70 || size > 80) {
      value = value - 45;
    }
    if (size > 90 || size > 100 || size > 110) {
      value = value - 40;
    }
  } else if (opc == "aus") {
    LOGL && console.log("AUS:", value);
    if (size >= 2) value = value -15;
    if (size >= 3) {
      value = value + 20;
    }
    if (size >= 5) value = value + 20;
    if (size > 10) value = value - 35;
    if (size > 20) value = value - 40;
    if (size > 29 || size > 40 || size > 49 ) {
      value = value - 35;
    }
    if (size > 60 || size > 70 || size > 80) {
      value = value - 55;
    }
    if (size > 90 || size > 100 || size > 110) {
      value = value - 85;
    }
  }

  return value;
};

createNodesCenter = (nodos) => {
  let nodes = [];
  nodos.sort((a, b) =>
    a.codpartido > b.codpartido
      ? 1
      : b.codpartido > a.codpartido
      ? -1
      : b.nombre > a.nombre
      ? -1
      : a.nombre > b.nombre
      ? 1
      : 0
  );
  pointsForMatrixCenter(nodos, nodes);
  return nodes;
};

//create points for matrix , and return nodes, En el centro
pointsForMatrixCenter = (votos, nodes) => {
  let dictM = {};
  let dataset = [];
  let count = 0;

  let sizeVotos = votos.length;
  let rowSize = 5;

  let offsetV = -60;
  let offsetY = -40

  if (sizeVotos > 20){
    rowSize = 7;  
    offsetV = -80;  
  }
  if (sizeVotos > 30){
    rowSize = 8;  offsetV = -80;
  }
  if (sizeVotos > 40) {
    rowSize = 9;   offsetV = -80;
  }
  if (sizeVotos > 50) {
    rowSize = 10;  offsetV = -80;
  }
  if (sizeVotos > 60) {
    rowSize = 11;  offsetV = -80;
  }
  if (sizeVotos > 70) {
    rowSize = 12;  offsetV = -80;
  }
  if (sizeVotos > 80) {
    rowSize = 13;
    offsetV = -80;
  }
  if (sizeVotos > 90) {
    rowSize = 14;
    offsetV = -80;
  }
  if (sizeVotos > 100) {
    rowSize = 15;
    offsetV = -80;
  }
  if (sizeVotos > 110) {
    rowSize = 16; offsetV = -80;
  }

  if (sizeVotos > 20 || sizeVotos > 50) {
    offsetV = -90;
    offsetY = -80;
  }
  if (sizeVotos > 60 || sizeVotos > 90) {
    offsetV = -150; offsetY =  -90
  }
  if (sizeVotos > 100 || sizeVotos > 120){
    offsetV = -190; offsetY =  -100
  }
  if (sizeVotos > 120) offsetV = -280; offsetY =  -110

  let size = Math.ceil(sizeVotos / rowSize);
  LOGL && console.log("Size:", size);

  for (var y = 0; y < size; y++) {
    var tempData = [size];
    for (var x = 0; x < rowSize; x++) {
      var dataDict = {
        x: x * rectSpaceSize,
        y: y * rectSpaceSize,
        //x: x*(rectSpaceSize+4), y: y*(rectSpaceSize+9)
      };
      tempData[x] = dataDict;
      dictM[count] = dataDict;
      count = count + 1;
    }
    dataset.push(tempData);
  }
  votos.map(function (d, i) {
    //console.log(width/2, offsetV, dictM[i].x)
    //console.log(width/2 + offsetV + dictM[i].x)

    let nodeu = {
      id: "node" + d.numeroId,
      numeroId: d.numeroId,
      x: width / 2 + offsetV + dictM[i].x,
      y: height / 2 + offsetY + dictM[i].y,
      xOffset: d.xOffset,
      yOffset: d.yOffset,
      voto: d.voto,
      lastvoto: d.lastvote,
      group: d.voto,
      partido: d.partido,
      codpartido: d.codpartido,
      nombre: d.nombre,
      idnombre: organismoOp == 1? d.id : d.country,
      opacidad: d.opacidad,
      provincia: d.provincia,
      region: d.region,
      tipo: d.tipo,
      comisiones: d.comisiones,
      curul: d.curul,
      visitado: d.visitado,
      labelFlag: d.labelFlag,
    };
    nodes.push(nodeu);
  });
};

/// Resetea los valores de visitado de los nodos
function resetFlags() {
  for (let key in entidades) {
      if (entidades[key].visitado == true)
        entidades[key].visitado = false
  }
}


/**Default mode sin Layout */
function init(){

  console.log("INIT FUN")
  let newnodes = newNodesMatrix()
  nodes = createNodesCenter(newnodes)
  const testNodes =  createNodesCenter(newnodes)

  var hierarchy = d3.hierarchy({ children: testNodes }).sum(d => 0.1)

  console.log("hierachy:", hierarchy)

  var packed = d3.pack().size([width/4, height/4]).padding(3)(hierarchy);

  console.log("packed:", packed)

  colorMap = $("#colores-select").val();
  //console.log(newnodes)
  sortFunction(newnodes, colorMap)
  //updateLegends()

  drawnodescenter(packed.leaves())
}


function drawnodescenter(leaves){
  circles = circles
    .data(leaves, function (d) { 
      //console.log(d)
      return d.data.id; })
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "nodeCircle")
          .attr(
            "transform",
            (d) => "translate(" + d.data.xOffset + "," + d.data.yOffset + ")"
          )
          .attr("opacity", 0)
          .attr("stroke-width", (d) => (d.data.labelFlag ? 3.0 : 1))
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .attr("id", (d) => {
                //console.log("init", d)
                return d.data.id;
              })
              .attr("stroke", (d) => {
                var _color = color(d.data, colorMap);
                return d3.rgb(_color).darker(1);
              })
              .attr("fill", (d) => color(d.data, colorMap))
              //.attr("cx", (d) => d.x) //Offset)
              //.attr("cy", (d) => d.y) //Offset)
              .attr("transform", (d) => "translate(" + (d.x +width/3) + "," + (d.y + height/3 ) + ")")
              .attr("r", (d)=> d.r)
              .attr("opacity", 1)
          ),
      (update) =>
        update
          .attr("id", (d) => d.data.id)
          .transition()
          .duration(durationRect)
          .attr("stroke", (d) => {
            console.log("update init")
            var _color = color(d.data, colorMap);
            return d3.rgb(_color).darker(1);
          })
          .attr("stroke-width", (d) => (d.data.labelFlag ? 3.0 : 1))
          //.attr("cx", (d) => d.x)
          //.attr("cy", (d) => d.y)
          .attr("transform", (d) => "translate(" + (d.x +width/3) + "," + (d.y + height/3 ) + ")")
          .attr("r", (d)=> d.r)
          .attr("fill", (d) => color(d.data, colorMap)),
      (exit) =>
        exit
          .transition()
          .duration(durationRect)
          .style("opacity", () => {
            console.log("eliminar");
            return 0;
          })
          .remove()
    ); 

    
  circles
    .on("mouseover", (d) => mouseOverRect(d.data))
    .on("mouseout", (d) => mouseOutRect(d.data));

}

function updateEmptyChart(){
  nodosActuales = {}
  for(let key in entidades){
    //let entidad = entidades[key]
    entidades[key].visitado = false
    delete entidades[key]
  }
  //updateEmptyInfo()
  console.log("entidades enceradas;", entidades, nodosActuales)
}

fillOp1 = (e) => {
  console.log("opcion 1", e)
  d3.select('#node' + e.numeroId).attr('fill', '#ffffff');
  let value = {
    element: e,
    value: 1,
  };
  idsOpacidad[e.numeroId] = value;
  d3.select('#el' + e.numeroId)
    .select('circle')
    .attr('fill', '#ffffff');
  console.log(idsOpacidad[e.numeroId])
};

fillOp2 = (e) => {
  console.log("opcion 2")
  d3.select('#node' + e.numeroId).attr('fill', color(e, globalThis.colorMap));
  idsOpacidad[e.numeroId].value = 2;
  d3.select('#el' + e.numeroId)
    .selectAll('circle')
    .attr('fill', color(e, globalThis.colorMap));
};

loopIdsOpacidad = () => {
  let values = Object.keys(idsOpacidad);
  console.log(values);
  if (values.length > 0) {
    Object.keys(idsOpacidad).forEach((id) => {
      let el = idsOpacidad[id].element;
      //console.log('el:', el);
      d3.select('#node' + el.numeroId).attr('fill', (el) =>
        color(el, globalThis.colorMap)
      );
      idsOpacidad[id].value = 2;
      let circle = d3.select('#el' + el.numeroId).select('circle');
      //console.log('circle:', circle);
      circle.attr('fill', color(el, globalThis.colorMap));
    });
  }
};

onclickcircle = (e) => {
  console.log("opcion 1", e)
  d3.selectAll(".nodeCircle").attr('fill', '#ffffff')
  console.log( d3.selectAll("nodeCircle"))
  d3.select('#node' + e.numeroId).attr('fill', color(e, globalThis.colorMap));
}

