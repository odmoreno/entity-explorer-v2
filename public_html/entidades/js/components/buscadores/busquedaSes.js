/**
 * Busqueda de sesiones
 */

var LOGBS = true

//let listaResultadosV = document.getElementById('busquedaDiv');


fueradelbuscadorVotos = () => {
    listaResultadosV.innerHTML = ''
}

function searchSesiones(searchText) {
    let votesSet =[] //ids de sesiones
    let sesSet = [] //ids de sesiones

    //dictIds['wVotos'] = votesSet
    //dictIds['wSesiones'] = sesSet
    
    //listaResultadosV.innerHTML = ''
    // /listaResultados.innerHTML = ''

    LOGBS && console.log("rawText:", searchText)
    let word = validateInput(searchText)
    LOGBS && console.log("search: ", word)
    
    let ses;
    if(organismoOp == 1) ses = Object.values(sesiones)
    else  ses = Object.values(unResolutions)
    
    //let matchesSes = validateSes(searchText, ses)
    let matches = filterData(word, ses, votesSet)

    if (searchText.length === 0) {
        matches = []
        //listaResultadosV.innerHTML = ''
    }
    //if (matchesSes.length > 7)
    //    matchesSes = matchesSes.slice(0, 6)

    if (matches.length > 13)
        matches = matches.slice(0, 15)

    LOGBS && console.log("votesset:", votesSet)
    dictIds['wVotos'] = votesSet

    LOGBS && console.log("data:", matches)
    //outputSesiones(word)
    
    //if(searchText == '') 
    //outputSesiones2(matches)
    outputVotes(matches)
    addListeners()
}

//valida si ingreso algun numero que pueda ser una sesion
function validateInput(text) {
    let value = text
    let searchSes = text.split(" ")
    numberFlag = false
    //asuntoFlag = true
    searchSes.forEach(function (word) {
        let num1 = parseInt(word)
        LOGBS && console.log(num1)
        if (!isNaN(num1)) {
            LOGBS && console.log("Es un numero: ", num1)
            value = word
            numberFlag = true
            //asuntoFlag = false
        }
    })
    return value
}

//Recoge todas las sesiones posibles que hagan match
function validateSes(text, ses){
    let matches1 = ses.filter((sess) => {
      let id = sess.sesion.toString()
      const regex2 = new RegExp(`\\b.*${text}.*?\\b`, 'gi')

      if(id == text){
        LOGBS && console.log("Id unica de sesion", text)
        numberFlag = true
      }
      if(id.match(text)){
          return sess
      }  
      //else if (sess.asunto.match(regex2)) {
      //    console.log("con asunto ")
      //  return sess
      //}

    });

    var values = matches1.map(function(item){ return item.sesion});
    LOGBS && console.log("sesiones:", values)

    var uniqueArray = [];
        
    // Loop through array values
    for(var value of values){
        if(uniqueArray.indexOf(value) === -1){
            uniqueArray.push(value);
        }
    }
    //return uniqueArray;
    LOGBS && console.log("unicos:", uniqueArray);

    LOGBS && console.log("Ses Match:", matches1)

    if(text == '0') return uniqueArray = [0]
    else return uniqueArray
}

function filterData(text, ses, set) {
    sesFlag = false
    let matches1 = []
    let matches2 = ses.filter(sess => {
        const regex2 = new RegExp(`\\b.*${text}.*?\\b`, 'gi')
        //console.log(regex2)
        //sess.asunto.match(regex2) .replace(regex2, '<b>'+text+'</b>')

        return sess.asunto.match(regex2)
    });
    LOGBS && console.log("matches2:", matches2)
    if (numberFlag == true) {
        //filtrar por sesion
        matches1 = ses.filter(sess => {
            const regex = new RegExp(`^${text}`, 'gi')
            //console.log(regex)
            let sesionN = sess.sesion.toString();

            if(sesionN.match(regex)){
                //console.log("sesion", sess)
            }

            if (sesionN === text)
                sesFlag = true
            return sesionN.match(regex)
        });
    }
    LOGBS && console.log("Sesiones:", matches1)
    LOGBS && console.log("Asuntos:", matches2)
    if (matches1.length > 0) {
        //sesFlag = true
        matches1.sort((a, b) => (a.votacion > b.votacion) ? 1 : ((b.votacion > a.votacion) ? -1 : 0))
        matches1.map(match => {
            LOGBS && console.log(match)
            set.push(match.sesId)
        })
        
        return matches1
    } else {
        LOGBS && console.log(matches2)
        let words = matches2.map(match => {
            var newtext = match.asunto.replace(text, '<b>' + text + '</b>')
            //console.log(newtext)
            match.bold = newtext
            set.push(match.sesId)
            return match
        })
        LOGBS && console.log("words:", words)
        return words
    }

}

function outputSesiones2(matches){
    
    LOGBS && console.log('Dict IDs',dictIds)
    console.log("sesion matches:", matches)

    if (matches.length > 0) {
      const header = `<div class="card-listU">
        <a href="#collapseSesiones" class="d-block card-headerU py-2" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
            <div class="d-flex justify-content-between">
                <h6 id="wSesiones" class="m-0 font-weight-bold text-primary" style="text-transform:capitalize" draggable="true" 
                    >Sesiones</h6>
                <h6 >  (${dictIds['wVotos'].length}) Votaciones</h6>
            </div>
        </a>
        <div class="collapse show" id="collapseSesiones">
          <div id="body-sesiones" class="card-body">
          </div>
        </div>
      </div>`;
    
      LOGBS && console.log("Matches Sess:", matches)
      listaResultados.innerHTML += header

      const html = matches
        .map(
          (element) =>
            `<div id="x${element}" class="card-listU itemSes py-1" draggable="true" 
                style="border: 2px solid #f8f9fc; align-items: baseline;">
        <div class="d-flex flex-row ml-3 justify-content-between">  

            <div  class=" d-flex flex-row l mb-1" style="align-items: center;" 
                onmouseover="overSesiones(${element})" 
                onmouseleave="onLeaveSesiones(${element})">
                <span style="color: #54575b;"> Sesión ${element}  </span>
            </div>

        </div>    

      </div>`
        )
        .join("");

      let entidadesListCard = document.getElementById('body-sesiones');
      entidadesListCard.innerHTML += html  

    }
    
}

/**Lista de sesiones */
function outputSesiones(option) {

    /**<div  class=" card py-2 </div> "> */
    if (sesFlag) {
        const header =
         `<div class="card-listU">
            <a href="#collapse${option}" class="d-block card-headerU py-2" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
              <h6 class="m-0 font-weight-bold text-primary" style="text-transform:capitalize">Sesión</h6>
            </a>
            <div class="collapse show" id="collapse${option}">
              <div id="body-${option}" class="card-body">
              </div>
            </div>
        </div>`

        //listaResultadosV.innerHTML += header
        listaResultados.innerHTML += header

        let element = sesiones[option]
        //console.log(option, element)
        const html =
        `<div id="x${element.sesId}" class="card-listU itemSes py-1 ${!element.flag ? 'draggme' : 'nodrag'}" 
          draggable="${!element.flag ? true : false}" style="border: 2px solid #f8f9fc;">
          <div class="d-flex flex-row ml-3 justify-content-between">

            <div  class=" d-flex flex-row l mb-1" style="align-items: center;" 
              onmouseover="overSesiones(${element.sesId})" onmouseleave="onLeaveSesiones(${element.sesId})">
              <span class="${element.flag ? 'entitySelected' : 'entityAway'}"  > 
                     Sesión ${option} </span>
            </div>
          </div>
        </div>`//.join('');

        let entidadesListCard = document.getElementById('body-' + option);
        //console.log(entidadesListCard)
        //entityList.innerHTML += html
        entidadesListCard.innerHTML += html
    }
}

function outputVotes(matches) {

    if (matches.length > 0) {

        const header = `<div class="card-listU">
        <a href="#collapseAsambs3" class="d-block card-headerU py-2" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
            <div class="d-flex justify-content-between">
                <h6 id="wVotos"  class="m-0 font-weight-bold text-primary" style="text-transform:capitalize" draggable="true" 
                    > ${organismoOp == 1 ? 'Votaciones'  : 'Resoluciones'} </h6>
                <h6 > (${matches.length})</h6>
            </div>
        </a>
        <div class="collapse show" id="collapseAsambs3">
          <div id="bodyAsambs3" class="card-body">
          </div>
        </div>
      </div>`;

        LOGBS && console.log("Matches votes:", matches)
        //listaResultadosV.innerHTML += header
        listaResultados.innerHTML += header

        //'Votación '+ element.votacion
        const html = matches.map(element =>
                `<div  id="v${element.sesId}"  class="card-listU itemVotes py-1 ${!element.visitado ? 'draggme' : 'nodrag2 noselect'}"
          draggable="${!element.visitado ? true : false}"  
          style="border: 2px solid #f8f9fc;">

          <div class="d-flex flex-row ml-3 justify-content-between">
            <div  class=" d-flex flex-row l mb-1" style="align-items: center;">

              <div class="d-flex flex-column" onmouseover="overVotes(${element.sesId})" onmouseleave="onLeaveVote(${element.sesId})">
                <div class="d-flex flex-row">
                  ${ sesFlag ? ' ' : `<span class='mr-2'  style="color: #034EA2; font-weight: bold;"> Sesión ${organismoOp == 1? element.sesion : element.anio}</span>`}
                  <span class='mr-2' style="color: #034EA2; font-weight: bold;"> ${organismoOp == 1? element.name : element.unres }</span> 
                </div>
                <span style="color: #54575b;"> (${organismoOp == 1? (element.fecha +' '+ element.hora): element.date }) : </span>
                <span> ${ element.bold ? element.bold : element.asunto } ... </span> 
              </div>

            </div>
          </div>
      </div>`
        ).join('');

        let entidadesListCard = document.getElementById('bodyAsambs3');
        entidadesListCard.innerHTML += html

        //listaResultadosV.innerHTML = html
    }
}


function overVotes(id) {
    d3.select("#v" + id).style("border", "2px solid orange")
}

function onLeaveVote(id) {
    d3.select("#v" + id).style("border", "2px solid #f8f9fc")
}

function overSesiones(id) {
    d3.select("#x" + id).style("border", "2px solid orange")
}

function onLeaveSesiones(id) {
    d3.select("#x" + id).style("border", "2px solid #f8f9fc")
}

/**FUNCIONES de drag con los resultados y drop con el grafico */
function drag2(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop2(ev) {
    ev.preventDefault();
}

function drop2(ev) {
    ev.preventDefault();
    LOGBS && console.log("Hola, ingreso de entidad en el timeline")
    var data = ev.dataTransfer.getData("text")
    //var id = document.getElementById(data)
    //console.log(id)
    LOGBS && console.log(data)
    let idnew = data.substring(1)
    let item = sesiones[idnew]

    if (idnew  == "w"){
        LOGBS && console.log("Votaciones")
        LOGBS && console.log(dictIds)
    }

}


function handleDragStart(event) {
    var dragSrcEl = event.target;

    LOGBS && console.log("drag:", dragSrcEl)
    LOGBS && console.log(dragSrcEl.id)

}

function handleDragEnd(e) {
    let element = e.target; // This is the same element as we used before
    let id = element.id
    let idnew = id.substring(1)
    LOGBS && console.log("ID END:", element.id)

    let item;
    let fecha;
    let hora;
    
    if (organismoOp == 1) {
      item = sesiones[idnew];
      fecha = item.fecha.split("-");
      hora = item.hora.split(":");
    } else if (organismoOp == 2) {
      item = unResolutions[idnew];
      fecha = item.date.split("-");
    }

    LOGBS && console.log("item:", item)
    
    if(!dictLinks[item.sesId])
        dictLinks[item.sesId] = {}

    LOGBS && console.log("DICT LINKS:", dictLinks)
    LOGBS && console.log("fecha:", fecha, "hora:", hora)

    timeline.setOptions({
        showMajorLabels: true,
        showMinorLabels: true,
    });
    

    let node = {
        'id': item.sesId,
        'className': 'timelineElement' + ' m_' + item.sesId, //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
        'group': item.anio,
        'content': getContent2(item),
        'asunto': item.asunto,
        'title': organismoOp == 1 ? item.name : item.unres,
        "type": "box",
        'start': startDateSelec(fecha, hora),
        'end': endDateSelect(fecha, hora), 
    }

    datas.add(node)
    LOGBS && console.log(datas)
    //datas.remove(0)
    LOGBS && console.log(datas)

    getIdSes(item.sesId)


    currentSes = item.sesId
    

    let slider = $("#slider-votos").data("ionRangeSlider");
    slider.update({
      from: currentId
    })
    
    //var dir = -2
    //var range = timeline.getWindow();
    //var interval = range.end - range.start;
    //timeline.setWindow({
    //  start: range.start.valueOf() - interval * dir * 0.2,
    //  end: range.end.valueOf() + interval * dir * 0.2,
    //});
    //timeline.fit()
    if(!flagEmptySes)
        getAllLinks()

    timeline.setSelection(item.sesId, {focus: false});
    setRangeTimeline()
    
    selectChart()

    d3.select("#btn-remove-all").style("display", "block")
}

startDateSelec = (fecha, hora) =>{
    if(organismoOp == 1){
       return  new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]), parseInt(hora[1]))
    }
    else {
        return new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), 0, 0)
    }
}

endDateSelect = (fecha, hora) => {
    if(organismoOp == 1){
       return  new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), 23, 59)
    }
    else {
        return new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), 0, 0)
    } 
}

function handleDragStart2(event) {
    var dragSrcEl = event.target;
    LOGBS && console.log("Drag23")

}

function handleDragEnd2(e) {
    let element = e.target; // This is the same element as we used before
    let id = element.id
    let idnew = id.substring(1)
    LOGBS && console.log("ID END:", element.id)

    let item = sesiones[idnew]
    LOGBS && console.log("item:", item.sesion)


    let sesionesList = Object.values(sesiones)
    LOGBS && console.log(sesionesList)
    let newList = [... sesionesList]
    let sVotes = newList.filter(v => v.sesion == item.sesion)
    LOGBS && console.log('SES:', sVotes)

    timeline.setOptions({
        showMajorLabels: true,
        showMinorLabels: true,
    });

    //if(!dictLinks[currentSes])
    //dictLinks[currentSes] = {}

    sVotes.map(item => {
        LOGBS && console.log("item ses:", item)
        
        if(!dictLinks[item.sesId])
            dictLinks[item.sesId] = {}

        let fecha = item.fecha.split('-')
        let hora = item.hora.split(':')
        LOGBS && console.log(fecha)
        let node = {
            'id': item.sesId,
//      'className': 'timelineElement', //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
            'className': 'timelineElement' + ' m_' + item.sesId, //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
            'group': item.anio,
            'content': getContent2(item),
            'asunto': item.asunto,
            'title': item.name,
            "type": "box",
            'start': new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]), parseInt(hora[1])),
            'end': new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), 23, 59),
        }

        datas.add(node)
        //console.log("datas:", datas)
        
        getIdSes(item.sesId)

        //currentSes = firstIds
        //updateChart(firstIds, false)

        

        //Object.assign(options, defaultOptions, newOpt);
        //timeline.setOptions(options);

    })

    if(!flagEmptySes)
        getAllLinks()
    //timeline.fit()

    LOGBS && console.log("FIRST ID:", firstIds)
    currentSes = firstIds
    timeline.setSelection(firstIds, {focus: false});

    selectChart()
    setRangeTimeline()
}

function addListeners() {
    var items = document.querySelectorAll(".itemVotes");
    LOGBS && console.log("items", items)

    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        item.addEventListener("dragstart", handleDragStart.bind(this), false);
        item.addEventListener('dragend', handleDragEnd.bind(this), false);
    }

    var votosItems = document.getElementById("wVotos");

    if(votosItems){
        votosItems.addEventListener("dragstart", handleDragStart3.bind(this), false);
        votosItems.addEventListener('dragend', handleDragEnd3.bind(this), false);
    }
    
    var itemsSes = document.querySelectorAll(".itemSes");

    if (itemsSes) {
    LOGBS && console.log("iniciados");
      LOGBS && console.log("items", itemsSes);

      for (var i = itemsSes.length - 1; i >= 0; i--) {
        var item2 = itemsSes[i];
        //LOGBS && console.log("D:", item);
        item2.addEventListener("dragstart", handleDragStart4.bind(this), false);
        item2.addEventListener("dragend", handleDragEnd4.bind(this), false);
      }
    }

}


function handleDragStart3(event) {
    var dragSrcEl = event.target;
    LOGBS && console.log("DragVotes")

}

function handleDragEnd3(e) {
    LOGBS && console.log("drop 3 votos")

    let element = e.target;
    let id = element.id
    //let idnew = id.substring(1)
    LOGBS && console.log("ID END:", id)

    if(id == 'wVotos'){
        addAllVotesHeader()
    }
}

function addAllVotesHeader() {
    
  let elements = dictIds["wVotos"];
  LOGBS && console.log("hola", elements)
  timeline.setOptions({
    showMajorLabels: true,
    showMinorLabels: true,
  });

  for (let key in elements) {
    let sesId = elements[key];

    let item, fecha, hora;

    //let item = sesiones[sesId]; //votacion
    if (!dictLinks[sesId]) dictLinks[sesId] = {};

    //let fecha = item.fecha.split("-");
    //let hora = item.hora.split(":");
    
    if (organismoOp == 1) {
      item = sesiones[sesId];
      fecha = item.fecha.split("-");
      hora = item.hora.split(":");
    } else if (organismoOp == 2) {
      item = unResolutions[sesId];
      fecha = item.date.split("-");
    }

    LOGBS && console.log(item)
    LOGBS && console.log(fecha);
    

    let node = {
      id: item.sesId,
      //      'className': 'timelineElement', //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
      className: "timelineElement" + " m_" + item.sesId, //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
      group: item.anio,
      content: getContent2(item),
      asunto: item.asunto,
      title: organismoOp == 1 ? item.name : item.unres,
      type: "box",
      start: startDateSelec(fecha, hora),
      end: endDateSelect(fecha, hora), 
    };

    datas.add(node);
    //getIdSes(item.sesId); // item.sesId === sesId
    addSesion2(item.sesId)
    //updateChart(firstIds, false);
  }

  

  if (!flagEmptySes) 
    getAllLinks();

    selectChart()
    setRangeTimeline();
    LOGBS && console.log("FIRST ID:", firstIds)
    currentSes = firstIds
    //currentId = firstIds
    currentId = reverseDIVotes[firstIds]
    timeline.setSelection(firstIds, { focus: false });

    d3.select("#btn-remove-all").style("display", "block")
}

function handleDragStart4(event) {
    var dragSrcEl = event.target;
    LOGBS && console.log("Drag Sesiones")

}

function handleDragEnd4(e) {
    //LOGBS && 
    LOGBS && console.log("drop 4 Sesiones")

    let element = e.target;
    let id = element.id
    let idnew = id.substring(1)
    //LOGBS && 
    LOGBS && console.log("ID END:", id, idnew)
    
    addAllSesions(idnew)
    
}

function addAllSesions(id){
    LOGBS && console.log("anadir sesiones")

    let sesionesList = Object.values(sesiones)
    let newList = [... sesionesList]

    let sVotes = newList.filter(v => v.sesion == parseInt(id))
    LOGBS && console.log("SESS:", sVotes)

    timeline.setOptions({
        showMajorLabels: true,
        showMinorLabels: true,
    });

    sVotes.map(item => {
        LOGBS && console.log("item ses:", item)
        
        if(!dictLinks[item.sesId])
            dictLinks[item.sesId] = {}

        let fecha = item.fecha.split('-')
        let hora = item.hora.split(':')
        LOGBS && console.log(fecha)
        let node = {
            'id': item.sesId,
            'className': 'timelineElement' + ' m_' + item.sesId, //item.anio == '2017' ? 'orange' : (item.anio == '2018' ? 'green' : (item.anio == '2019' ? 'red' : (item.anio == '2020' ? 'magenta' : 'default') ) ),
            'group': item.anio,
            'content': getContent2(item),
            'asunto': item.asunto,
            'title': item.name,
            "type": "box",
            'start': new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]), parseInt(hora[1])),
            'end': endDateSelect(fecha, hora), 
        }
        //console.log(node)
        datas.add(node)
        //console.log("datas:", datas)
        //getIdSes(item.sesId)
        //currentSes = firstIds
        
        addSesion2(item.sesId)
    })
    
    if(!flagEmptyChart)
        getAllLinks()

    LOGBS && console.log("FIRST ID:", firstIds, currentSes)
    currentSes = firstIds
    //currentId = firstIds
    currentId = reverseDIVotes[firstIds]
    timeline.setSelection(firstIds, {focus: false});
    setRangeTimeline()
    selectChart()

    d3.select("#btn-remove-all").style("display", "block")
}

function selectChart() {
    LOGBS && console.log("select chart")
  if (currentOptChart == "1") {
    $("#svgClusters").attr("fill", "#2e59d9");
    showVotesGrp();
    optionColor1()
    LOGBS && console.log("CURRENT ID:", firstIds, currentSes)
    //updateChart(firstIds, false);
    d3.timeout(updateChartHandler, 500);
    //optionSort = 5;
    sortFunction(nodosActuales, colorMap);
    updateLegends()
  } else if (currentOptChart == "3") {
    $("#svgParlamento").attr("fill", "#2e59d9");
    //console.log("FIRST ID:", firstIds, currentSes)
    updateInfoChart2(currentSes)
    removeAllLinks();
    hideVotesGrp()
    optionColor2()
    d3.timeout(updateCurules, 500);
    //optionSort = 5;
    //console.log("color:", colorMap)
    sortFunction(nodosActuales, colorMap);
    updateLegends()

  } else if (currentOptChart == "2") {
    LOGBS && console.log("CVN");
    hideVotesGrp()
    //updateCvn();
    //optionSort = 5;
    optionColor1()
    updateInfoChart2(currentSes)
    let listEntity = Object.values(entidades);
    sortFunction(listEntity, colorMap);
    d3.timeout(updateCvn, 500);
    updateLegends()
  }
}

function setRangeTimeline() {
    let range = timeline.getItemRange()
    LOGBS && console.log("RANGE:", range)

    let minTl = range.min
    let maxTl = range.max
    LOGBS && console.log(minTl, maxTl)

    let lastSesionList = sesiones[lastIdS]
    let fecha;
    let hora;
    let newMax;

    if(organismoOp == 1){
        lastSesionList = sesiones[lastIdS]
        fecha = lastSesionList.fecha.split('-')
        hora = lastSesionList.hora.split(':')
        newMax = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]) + 1, 59)
    }
    else if(organismoOp == 2){
        lastSesionList = unResolutions[lastIdS]
        fecha = lastSesionList.date.split('-')
        newMax = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(0) + 1, 59)

    }

    LOGBS && console.log("LastSes:", lastIdS ,lastSesionList)


    //console.log("NEWMAX:", newMax,  parseInt(fecha[0]), parseInt(fecha[1]-1), parseInt(fecha[2]), parseInt(hora[0]) +1,  59)
    timeline.setWindow(minTl, newMax, {animation: false});

    
}

function findsesion(id) {

    let lastSesionList = sesiones[id]
    LOGBS && console.log("LastSes:", lastSesionList)
    let fecha = lastSesionList.fecha.split('-')
    let hora = lastSesionList.hora.split(':')
    let newMax = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]) + 1, 59)
    let newMin = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]) - 4, 59)

    //console.log("NEWMAX:", newMax,  parseInt(fecha[0]), parseInt(fecha[1]-1), parseInt(fecha[2]), parseInt(hora[0]) +1,  59)
    timeline.setWindow(newMin, newMax, {animation: true});

    timeline.setSelection(id, {focus: false});
    //flagClickbuttonItem = false
    //timeline.focus(id);
}

function findsesion2(id) {

    let lastSesionList = sesiones[id]
    LOGBS && console.log("LastSes:", lastSesionList)
    let fecha = lastSesionList.fecha.split('-')
    let hora = lastSesionList.hora.split(':')
    let newMax = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]) + 1, 59)
    let newMin = new Date(parseInt(fecha[0]), parseInt(fecha[1] - 1), parseInt(fecha[2]), parseInt(hora[0]) - 4, 59)

    //console.log("NEWMAX:", newMax,  parseInt(fecha[0]), parseInt(fecha[1]-1), parseInt(fecha[2]), parseInt(hora[0]) +1,  59)
    //timeline.setWindow(newMin, newMax, {animation: true});

    timeline.setSelection(id, {focus: false});
    //flagClickbuttonItem = false
    //timeline.focus(id);
}