/**Main js del slider */

//Manipular slider de votos
let listIndicesVotes = []
let dictIVotes = {}
let currentValueIndex=0;
let reverseDIVotes = {}
let totalDict;
let countIndex = 0; 
let flagindex = true


//Eventos del slider
$("#play-button").on("click", function () {
  var button = $(this);
  if (Object.keys(idSesiones).length > 0) {
    if (button.text() == "Play") {
      button.text("Pause");
      interval = setInterval(step, 1800);
    } else {
      button.text("Play");
      //d3.select('#reproductor').classed('fas fa-play')
      clearInterval(interval);
      setRangeTimeline();
    }
  }
});

$("#prev-button").on("click", function () {
  if (Object.keys(idSesiones).length > 0) {
    prevSes();
  }
});

$("#next-button").on("click", function () {
  if (Object.keys(idSesiones).length > 0) {
    nextSes();
  }
});

$("#slider-votos").ionRangeSlider({
  skin: "round",
  min: 0,
  max: 0,
  from: 0,
  step: 1,
  hide_min_max: true,
  //grid: true,
  //grid_snap: true
});
//Fin de eventos


function removeElementFromSlider(item){
  LOG && console.log("List of index:", listIndicesVotes)

  var index = listIndicesVotes.indexOf(item);
  if (index !== -1) {
    listIndicesVotes.splice(index, 1);
  }

  LOG && console.log("Final:", listIndicesVotes)
  //setRangeTimeline()
}


function udpateSliderVotes(){
  let slider = $("#slider-votos").data("ionRangeSlider");

  LOG && console.log("size:", listIndicesVotes.length-1, "from:", currentValueIndex)
  //console.log(listIndicesVotes.length-1, listIndicesVotes.length)
  let max = listIndicesVotes.length
  
  LOG && console.log("INDICES:", listIndicesVotes)
  LOG && console.log("SIZE:", totalDict)

  LOG && console.log("Indice NUM:", countIndex)
  //console.log("count:", countIndex)

  LOG && console.log(flagindex)
  let tmp = flagindex ? 1 : (countIndex  == 0 ? 0 : countIndex)
  LOG && console.log(tmp)
  slider.update({
    min: 0,
    max: max-1,
    from: 0,
    step: 1, 
    grid: true,
    grid_num: tmp, 
    //hide_min_max: true,
    onChange: function (data) {
      let numero = data.from
      currentValueIndex = numero
      //console.log("numero:", currentValueIndex)
      let sesId = dictIVotes[currentValueIndex]
      //console.log("SESION:", sesId)
      currentSes = sesId
      //updateChart(sesId, false)
      selectChart()

    },
    onFinish: function (data) { 
      let numero = data.from
      currentValueIndex = numero
      //console.log("numero:", currentValueIndex)
      let sesId = dictIVotes[currentValueIndex]
      //console.log("SESION:", sesId)
      findsesion(sesId)
    },
    //prettify_enabled: true,
    //prettify_separator: ',',
    prettify: function (n) {
      let valuesDICT = Object.keys(idSesiones)
      //console.log("Slider:", valuesDICT, n)
      let value = titleByOption(n)
      return value
    },  
  });
  //irs-grid-text
  LOG && console.log("SLider:", slider)
}

titleByOption = (n) => {
  if(organismoOp == 1){      
    if(valuesDICT.length > 1){
      let sesId = dictIVotes[n]
      var tag = sesiones[sesId]
      //console.log('tag:',tag)
      return "Sesión " + tag.sesion + " Votación " + tag.votacion
    }else return n
  }
  else if(organismoOp == 2){
    let sesId = dictIVotes[n]
    var tag = unResolutions[sesId]
    return tag.unres
  }
  
}


function updateValuesForSlider(){

  LOG && console.log("current List:", listIndicesVotes)
  listIndicesVotes.sort( (a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
  LOG && console.log("sorted List:", listIndicesVotes)

  dictIVotes = {}
  reverseDIVotes ={}
  //countIndex = -1
  for (var i = 0; i < listIndicesVotes.length; i++) {
    dictIVotes[i] = listIndicesVotes[i]
    reverseDIVotes[listIndicesVotes[i]] = i
    LOG && console.log(i, dictIVotes[i])
    //countIndex = countIndex +1
  }

  //console.log(countIndex)
  LOG && console.log("Dict resultante:", dictIVotes)
  LOG && console.log("REverse dict resultante:", reverseDIVotes)
}

function updateSliderStyle() { 

  var div = d3.select('#slider-div')
  var labelsSlider = div.selectAll('.irs-grid-text')
  //console.log("Labnles:", labelsSlider)
  //console.log("a:", labelsSlider._groups)
  //console.log("a:", labelsSlider._groups[0])

  //.irs-grid-pol
  labelsSlider.style('opacity','0')
  div.select('.irs-single').style('top','60px')
  
  //irs-grid-pol small
  div.selectAll('.irs-grid-pol small').style('width','0px')
}

function updateSlider(){
  updateValuesForSlider()
  udpateSliderVotes()
  updateSliderStyle()
}

step = () =>{ 
  
  LOG && console.log("currentID:", currentId)
  LOG && console.log("currentSes:", currentSes)
  //currentId = parseInt(currentId)+1
  //LOG && 
  LOG && console.log("reverse id", reverseDIVotes)
  LOG && console.log("lastid:", lastIdS, reverseDIVotes[lastIdS])
  LOG && console.log("Lastcode", reverseDIVotes[lastIdS])
  if(currentId == reverseDIVotes[lastIdS]){
    console.log("limite", currentId, lastIdS)
    //currentId = parseInt(firstIds)
    currentId = reverseDIVotes[parseInt(firstIds)]
    console.log("CurrentID first", currentId, reverseDIVotes[firstIds])
  }
  else if(currentId < reverseDIVotes[lastIdS]) {
    currentId = parseInt(currentId)+1
    console.log(currentId)
  }

  currentSes = dictIVotes[currentId]
  LOG && console.log(dictIVotes)
  LOG && console.log("currentID update:", currentId)
  LOG && console.log("CurrentSES:", currentSes)

  if (currentOptChart == "2") {
    console.log("CVN");
    updateCvn();
    //optionSort = 2;
    optionColor1()
    updateInfoChart2(currentSes)
    let listEntity = Object.values(entidades);
    //sortFunction(listEntity);
    entityList.innerHTML = ''
    ListEntitys(listEntity, colorMap, false)
  } else if (currentOptChart == "1") {
    // clusters

    $("#svgClusters").attr("fill", "#2e59d9");
    //optionSort = 2;
    optionColor1()
    updateInfoChart2(currentSes)
    updateCluster(currentSes, false);
    //sortFunction(nodosActuales);
    let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)

  } else if (currentOptChart == "3") {
    $("#svgParlamento").attr("fill", "#2e59d9");
    console.log("Curules");
    removeAllLinks();
    hideVotesGrp();
    //colorMap = "voto"
    updateInfoChart2(currentSes);
    optionColor2()
    updateCurules();
    //optionSort = 5;
    //sortFunction(nodosActuales);
    let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)
  }
  else if(currentOptChart == "4"){
    //currentOptChart = value;
    $("#svgSets").attr("fill", "#2e59d9");
    showPsets();
    createSet();
  }


  let slider = $("#slider-votos").data("ionRangeSlider");
  slider.update({
    from: currentId
  })
  updateSliderStyle()

  timeline.setSelection(currentSes, {focus: false});

}

nextSes = () => {
  LOG && console.log("currentID:", currentId);
  LOG && console.log("Last:", lastIdS, reverseDIVotes[lastIdS]);
  console.log("DICT VOTOS:", dictIVotes);
  console.log("currentID:", currentId);
  console.log("Last:", lastIdS, reverseDIVotes[lastIdS]);

  if (currentId == reverseDIVotes[lastIdS]) {
    console.log("limite");
    currentId = reverseDIVotes[firstIds]; //parseInt(firstIds)
  } else if (currentId < reverseDIVotes[lastIdS]) {
    console.log("menor");
    currentId = parseInt(currentId) + 1;
    console.log("currentID:", currentId);
  }

  console.log(currentId);
  currentSes = dictIVotes[currentId];
  //updateChart(currentSes, false)

  //if(currentOptChart == '2'){
  //  console.log("CVN")
  //  updateCvn()
  //}
  //else{
  //  console.log("Current SES: ", currentSes)
  //    updateChart(currentSes, false)
  //    d3.selectAll('.grp').transition().duration(durationRect)
  //      .style('opacity', '1')
  //    d3.selectAll('.labeltext').transition().duration(durationRect)
  //      .style('opacity', '1')
  //    //d3.select('#g1').attr("transform", "translate(" + (-width/2 +50) + "," + (-height / 2  -50 ) + ")");
  //}
  //selectChart()

  if (currentOptChart == "2") {
    console.log("CVN");
    updateCvn();
    //optionSort = 2;
    updateInfoChart2(currentSes)
    optionColor1()
    let listEntity = Object.values(entidades);
    //sortFunction(listEntity);
    ListEntitys(listEntity, colorMap, false)

  } else if (currentOptChart == "1") {
    // clusters

    $("#svgClusters").attr("fill", "#2e59d9");
    //optionSort = 2;
    optionColor1()
    updateInfoChart2(currentSes)
    updateCluster(currentSes, false);
    //sortFunction(nodosActuales);
    let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)

  } else if (currentOptChart == "3") {
    $("#svgParlamento").attr("fill", "#2e59d9");
    console.log("Curules");
    removeAllLinks();
    hideVotesGrp();
    //colorMap = "voto";
    updateInfoChart2(currentSes)
    optionColor2()
    updateCurules();
    //optionSort = 5;
    //sortFunction(nodosActuales);
    let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)
  }
  else if(currentOptChart == "4"){
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
  //findsesion(currentSes);

  timeline.setSelection(currentSes, {focus: false});

};

prevSes = () => {

  LOG && console.log("currentID:", currentId)
  LOG && console.log("First:", firstIds, reverseDIVotes[firstIds])

  if(currentId == reverseDIVotes[firstIds]){
    LOG && console.log("limite primero")
    currentId = reverseDIVotes[lastIdS] //parseInt(lastIdS)
    LOG && console.log(currentId, reverseDIVotes[lastIdS])
  }
  else if(currentId > reverseDIVotes[firstIds]) {
    currentId = parseInt(currentId) - 1
    LOG && console.log(currentId)
  }

  currentSes = dictIVotes[currentId]
  //updateChart(currentSes, false)

  if (currentOptChart == "2") {
    console.log("CVN");
    updateCvn();
    //optionSort = 2;
    updateInfoChart2(currentSes)
    optionColor1()
    let listEntity = Object.values(entidades);
    entityList.innerHTML = ''
    ListEntitys(listEntity, colorMap, false)

    //sortFunction(listEntity);
  } else if (currentOptChart == "1") {
    $("#svgClusters").attr("fill", "#2e59d9");
    showVotesGrp();
    //optionSort = 2;
    updateInfoChart2(currentSes)
    optionColor1()
    //sortFunction(nodosActuales);
    updateCluster(currentSes, false);
    let list = sortByOption(optionSort, nodosActuales)
    entityList.innerHTML = ''
    ListEntitys(list, colorMap, false)

    //d3.select('#g1').attr("transform", "translate(" + (-width/2 -50) + "," + (-height / 2  -50 ) + ")");
  } else if (currentOptChart == "3") {
    $("#svgParlamento").attr("fill", "#2e59d9");
    console.log("Curules");
    removeAllLinks();
    hideVotesGrp()
    //colorMap = "voto";
    optionColor2()
    updateInfoChart2(currentSes)
    updateCurules();
    //optionSort = 5;
    //sortFunction(nodosActuales);
    let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)
  }
  else if(currentOptChart == "4"){
    //currentOptChart = value;
    $("#svgSets").attr("fill", "#2e59d9");
    showPsets();
    createSet();
  }


  let slider = $("#slider-votos").data("ionRangeSlider");
  slider.update({
    from: currentId
  })

  updateSliderStyle()
  //findsesion(currentSes)
  timeline.setSelection(currentSes, {focus: false});
}
