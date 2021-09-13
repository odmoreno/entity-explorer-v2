/*
 *    busqueda.js
 *    Componente para la lista de asambleistas contenidas en el grafico y el buscador de entidades
 */

var LOGO = true

//Resultados ubicados en el buscador
let listaResultados = document.getElementById('resultadosDiv');

//diccionario de ids por conjunto de entidades para los encabezados
let dictIds = {}
let flagNoAsambsDict = true

/**Functiones para el buscador */

//Funcion principal que busca entidades
function findEntities (searchText) {
  listaResultados.innerHTML = ' '
  
  let text = searchText.toLowerCase()
  
  if(organismoOp == 1){
    OrgFilter1(text, searchText)
  }
  else if(organismoOp == 2){
    OrgFilter2(text, searchText)
  }
  
  if(searchText === "") listaResultados.innerHTML = ''
}

//Filtro Asamblea Nacional
function OrgFilter1(text, searchText){

  if(text == 'partidos')
      filterPartidos(searchText, true)     
  else if (text.includes("regi"))
      filterRegion(searchText, true)
  else if ( text.includes("prov") )
      filterProv(searchText, true)    
  else if ( text.includes("comision") )
      filterComisiones(searchText, true)    
  else if (text.includes("todo"))
      filterAll()
  else {
      filterAsams(searchText, false)
  }

}

//Filtro Naciones Unidas
function OrgFilter2(text, searchText){
 
  if (text.includes("todo"))
    filterAll()
  else 
    filterEntidades(searchText)

  //filterAll(searchText)
}

filterEntidades = (text) => {
  const regex = new RegExp(`\\b.*${text}.*?\\b`, "gi");
  let conjuntoDeEntidades = [];
  let matches = Object.values(paisesUN).filter((pais) => {
    if (pais.name.match(regex)) {
      conjuntoDeEntidades.push(pais.ccode);
    }
    return pais.name.match(regex);
  });
  LOGO && console.log("Entidades filtrados: ", matches)
  dictIds['cEntidades'] = conjuntoDeEntidades

  outputAsambleistas(matches)
  LOGO && console.log("ids:", dictIds['cEntidades'])
  
};

filterAsams = (text, flag) => {
  const regex = new RegExp(`\\b.*${text}.*?\\b`, 'gi')

  let conjuntoDeAsambs = []
  let matches = Object.values(nodosActuales).filter(sess => {
      //console.log(sess)
      if(sess.id.match(regex)){
        //console.log(sess)
        conjuntoDeAsambs.push(sess.numeroId)
      }
      return sess.id.match(regex)
  })

  //dictIds['cAsambs'] = conjuntoDeAsambs
  LOGO && console.log("asams filtrados: ", matches)
  //sortFunction(matches)
  //console.log("dict:", dictIds, conjuntoDeAsambs)
  if(flagNoAsambsDict || dictIds['cPartido'].length == 0 ){ //&& dictIds['cProvincia'].length == 0 ) ){
    LOGO && console.log("enter", conjuntoDeAsambs)
    dictIds['cAsambs'] = conjuntoDeAsambs
    //dictIds['cAsambs'] = matches
  }
  else{
    LOGO && console.log("ops")
  }

  outputAsambleistas(matches)
  LOGO && console.log("ids:", dictIds['cAsambs'])
}

filterAll = () => {
  //const regex = new RegExp(`\\b.*${text}.*?\\b`, 'gi')
  let data = []
  let info = []
  let matches;

  if(organismoOp == 1){
    matches = Object.values(nodosActuales)
    dictIds['cAsambs'] = matches
  }
  else if (organismoOp == 2){
    matches = Object.values(paisesUN)
    dictIds['cEntidades'] = matches
    dictIds['cTodos'] = matches 
  }
  
  info.push("Todos")
  info.push(matches)
  data.push(info)
  
  outputEntidades(data, 'Todos')
}

filterPartidos = (text, flag) => {
  const regex = new RegExp(`\\b.*${text}.*?\\b`, 'gi')

  let matches = []
  let partidosSet = [] //ids de asambs que hacen match con el partido

  if(!flag){
    matches = Object.keys(partidos).filter(partido => {
      return partido.match(regex)
    })
  }else
    matches = Object.keys(partidos)

  //console.log("matches list partidos:", matches)
  let asambs = []
  let results;
  results = buscarPartidosOpciones(matches, partidosSet, asambs)
  dictIds['cPartido'] = partidosSet
  flagNoAsambsDict = false

  if(matches.length > 1){
    
    //let asambsunitario = results[0][1]\
    dictIds['cAsambs'] = partidosSet
    outputEntidades(results, 'Partido')
    outputAsambleistas(asambs)

  }
  else if(matches.length == 1){
    //let asambs = []
    //results = buscarPartidosOpciones(matches, partidosSet, asambs)
    dictIds['cAsambs'] = partidosSet
    outputEntidades(results, 'Partido')
    let asambsunitario = results[0][1]
    outputAsambleistas(asambsunitario)

  }
  //console.log("Partidos set:", partidosSet)
  LOGO && console.log(dictIds)

}

buscarPartidosOpciones = (list, partidosSet, asambs) => {
  let data = []
  list.forEach( op => {
    let partido = op.toLowerCase()
    let asambsPartidos = Object.values(nodosActuales).filter(sess => {
      if(sess.partido.match(partido) ){
        //console.log("sess", sess)
        partidosSet.push(sess.numeroId) 
        asambs.push(sess)
      }
      return sess.partido.match(partido)
    })
    let info = []
    
    
    if(asambsPartidos.length>0){
      info.push(partido)
      info.push(asambsPartidos)
  
      //console.log(partido, asambsPartidos)
      data.push(info)
      //console.log(data)
  
    }
    
  })
  return data 
}

filterRegion = (text, flag) => {
  const regex = new RegExp(`\\b.*${text}.*?\\b`, 'gi')

  let matches = []
  let regionesSet = [] //ids de asambs que hacen match con la region(es)
  //matches = Object.keys(regiones).filter(region => {
  //  return region.match(regex)
  //})

  if(!flag){
    matches = Object.keys(regiones).filter(region => {
        return region.match(regex)
    })
  }else
    matches = Object.keys(regiones)

  let results;
  flagNoAsambsDict = false
  let asambs = []
  results = buscarRegionOpciones(matches, regionesSet, asambs)
    LOGO && console.log("results:", regionesSet)
    dictIds['cRegión'] = regionesSet
    

  if(matches.length > 1){
    
    dictIds['cAsambs'] = regionesSet
    outputEntidades(results, 'Región')
    //let asambsunitario = results[0][1]
    outputAsambleistas(asambs)
  }
  else if(matches.length == 1){
    //let asambs = []
    //results = buscarRegionOpciones(matches, regionesSet, asambs)
    outputEntidades(results, 'Región')
    //dictIds['cRegión'] = regionesSet
    dictIds['cAsambs'] = regionesSet
    //let asambsunitario = results[0][1]
    outputAsambleistas(asambs)
  }
}

buscarRegionOpciones = (list, set, asambs) => {
  let data = []
  list.forEach( op => {
    let partido = op.toLowerCase()
    let asambsRegion = Object.values(nodosActuales).filter(sess => {
      if(sess.region.match(partido)){
        //console.log("sess")
        set.push(sess.numeroId) 
        asambs.push(sess)
      }
      return sess.region.match(partido)
    })
    let info = []

    if(asambsRegion.length>0){
      
      info.push(partido)
      info.push(asambsRegion)
      data.push(info)
    }

  })
  //console.log("Regiones:", data)
  return data
}

filterProv = (text, flag) => {
  const regex = new RegExp(`\\b.*${text}.*?\\b`, 'gi')
  
  let matches = []
  let provinciasSet = [] //ids de asambs que hacen match con la(s) provincia(s)
  //matches = Object.keys(provincias).filter(prov => {
  //  return prov.match(regex)
  //})
  
  if(!flag){
    matches = Object.keys(provincias).filter(prov => {
        return prov.match(regex)
    })
  }else
    matches = Object.keys(provincias)
  
  let results;
  let asambs = []
  results = buscarProvinciasOpciones(matches, provinciasSet, asambs)
    LOGO && console.log("results:", provinciasSet)
    dictIds['cProvincia'] = provinciasSet
    
  if(matches.length > 1){
    
    dictIds['cAsambs'] = provinciasSet
    outputEntidades(results, 'Provincia')
    //let asambsunitario = results[0][1]
    outputAsambleistas(asambs)
  }
  else if(matches.length == 1){
    //let asambs = []
    //results = buscarProvinciasOpciones(matches, provinciasSet, asambs)
    //dictIds['cProvincia'] = provinciasSet
    //dictIds['cAsambs'] = provinciasSet
    LOGO && console.log("set:", provinciasSet)
    LOGO && console.log("asambs:",  asambs)
    dictIds['cAsambs'] = provinciasSet
    outputEntidades(results, 'Provincia')
    //let asambsunitario = results[0][1]
    outputAsambleistas(asambs)
  }
}

buscarProvinciasOpciones = (list, provinciasSet, asambs) => {
  let data = []
  list.forEach( op => {
    let prov = op.toLowerCase()
    LOGO && console.log("prov:", prov)
    let asambsRegion = Object.values(nodosActuales).filter(sess => {
      if(sess.provincia.match(prov)){
        //console.log("sess", sess)
        provinciasSet.push(sess.numeroId) 
        asambs.push(sess)
      }
      return sess.provincia.match(prov)
    })
    let info = []
   

    if(asambsRegion.length>0){
      
      info.push(prov)
      info.push(asambsRegion)
      data.push(info)
    }

  })
  LOGO && console.log("Provincias:", data)
  return data  
}

/**Lista de entidades Individuales */
function outputAsambleistas (nodos) {
  let list = Object.values(nodos)
  LOGO && console.log("LIST:", list)
  list.sort(value => { return value.visitado ? 1 : -1})

  let flag = document.getElementById("asambs")
  if(flag){
    LOGO && console.log("duplicado asambs")
    flag.remove();
  }

  //id="cAsambs" draggable="true" ondragstart="drag(event)"
  if (list.length > 0){
    LOGO && console.log("list:", list.length, list)
    let header = 
      `<div  class="card-listU" id="asambs">
        <div draggable="true" ondragstart="drag(event)">
          <a href="#collapseAsambs2" id="${organismoOp == 1 ? 'cAsambs'  : 'cEntidades'}"  
            class="d-block card-headerU py-2" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
            <div class="d-flex justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary" style="text-transform:capitalize" >
                  ${organismoOp == 1 ? 'Legisladores'  : 'Paises Naciones Unidas'}</h6>
              <h6 > (${list.length})</h6>
            </div>
          </a>
        </div>
        <div class="collapse show" id="collapseAsambs2">
          <div id="bodyAsambs2" class="card-body">
          </div>
        </div>
      </div>`

    listaResultados.innerHTML += header
    let html = list.map(element => 
      `<div  id="e${ organismoOp == 1? element.numeroId : element.ccode}"  class="card-listU py-1 ${!element.visitado ? 'draggme' : 'nodrag2 noselect'}"
          draggable="${!element.visitado ? true : false}" ondragstart="drag(event)" 
          style="border-bottom-color: ${element.visitado ? color(element, colorMap) : '#e3e6f0'};">

          <div class="d-flex flex-row ml-1 justify-content-between">
            <div  class=" d-flex flex-row l mb-1" style=" width: 100%; align-items: center;">

            <svg height="15" width="15" class="mr-1" style="width: 15px; overflow: visible;">
                <circle cx="6" c="6"  r="6" fill="${color(element, colorMap)}" 
                  stroke="${d3.rgb(color(element, colorMap)).darker(1)}" stroke-width="1"/></svg>
        
              <span class="${element.visitado ? 'entitySelected': 'entityAway'}" style="width: 85%;">
                      ${element.name} </span>
            </div>
          </div>
      </div>`
    ).join('');

    let entidadesListCard = document.getElementById('bodyAsambs2');
    entidadesListCard.innerHTML += html
  }
  
}

/**Lista de grupos de entidades */
function outputEntidades (matches, option) {
  /**<div  class=" card py-2 </div> "> */
  LOGO && console.log("entidad:", matches)
  let id = "div"+option
  let flag = document.getElementById(id)
  if(flag){
    LOGO && console.log("duplicado", option)
    flag.remove();
  }

  let oriiD = "c"+ option
  let totalAsambs = dictIds[oriiD]
  //console.log("op", oriiD, totalAsambs, dictIds)
  let listasamb = Object.values(totalAsambs)
  LOGO && console.log(option)
  LOGO && console.log("total:", dictIds, listasamb, listasamb.length)

  let header = 
    `<div class="card-listU" id=${id}>
      <div id="${oriiD}" draggable="true" ondragstart="drag(event)">
        <a href="#collapse${option}" id="${oriiD}" class="d-block card-headerU py-2" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
          <div class="d-flex justify-content-between">
            <h6   class="m-0 font-weight-bold text-primary" style="text-transform:capitalize">
              ${option}</h6>
            <h6 style="text-transform:capitalize"> (${(listasamb.length)}) Leg. </h6>
          </div>
        </a>
      </div>
      <div class="collapse show" id="collapse${option}">
        <div id="body-${option}" class="card-body">
        </div>
      </div>
    </div>`

  listaResultados.innerHTML += header

  LOGO && console.log('matches:', matches)
  //console.log("name: ", matches[0][0].replaceAll(/\s/g,''))
  let element = dictEntidades[option]
  
  if (matches.length > 0){
    let html = matches.map(match => 
      `<div id="o${match[0].replaceAll(/\s/g,'')}" class="card-listU py-1 ${!element.flag ? 'draggme' : 'nodrag'}" 
        draggable="${!element.flag ? true : false}" ondragstart="drag(event)" 
        
          style="border-bottom-color: ${element.flag ? fillColorByType(match[0], element.name) : '#e3e6f0'};">
        
        <div class="d-flex flex-row ml-1 justify-content-between" style="width: 100%; align-items: center;">
            
          <div  class=" d-flex flex-row l mb-1" style="align-items: center; width: 15%;">
            <svg height="15" width="25" class="mr-1">
              <g stroke="${d3.rgb(fillColorByType(match[0], element.name)).darker(1)}" stroke-width="1">
                <circle cx="6" cy="6" r="5"  fill="${fillColorByType(match[0], element.name)}" />
                <circle cx="12" cy="6" r="5"  fill="${fillColorByType(match[0], element.name)}" />
                <circle cx="9" cy="10" r="5"  fill="${fillColorByType(match[0], element.name)}" />
              </g>
            </svg>
          </div>
          <span class="${element.flag ? 'entitySelected': 'entityAway'}"  
            onmouseover="overEntidades()" onmouseleave="onLeaveEntidades()" style="width: 50%;"> 
                ${match[0]} </span>

          <div class="cantidad" style="width: 35%;">
            <span class="mr-2" style="color: #54575b ; text-transform:capitalize"> (${match[1].length}) Leg.</span>
          </div>

        </div>

      </div>`
      ).join('');
    //console.log(html)
    let entidadesListCard = document.getElementById('body-'+option);
    //console.log(entidadesListCard)
    //entityList.innerHTML += html
    entidadesListCard.innerHTML += html

    updateDictEntities(matches)
  } 
}

function fillColorByType(d, option){
  let color;
  if (option == 'partidos'){
    color = colorPartidos2(codPartidos[d])
  }
  else if(option == 'region'){
    color = colorRegions(regiones[d])
  }
  else if ( option == "provincia") 
    color = colorProvincias(provincias[d])
  else if ( option == "todos")
    color = '#ffb700'
  //LOGO && console.log('color')
  return color
}

function updateDictEntities(matches){

  matches.map(match => {
    let code = match[0].replaceAll(/\s/g,'')
    dictElements[code] = match[1]
  })
  LOGO && console.log("dict de entidades :", dictElements)
}

function overEntidades(){}

function onLeaveEntidades(){}

fueradelbuscador = () => {
  pinnedlist.innerHTML = ''
  asambslist.innerHTML = ' '
}

fueradelbuscadorEntidades = () => {
  listaResultados.innerHTML = ''
}
//FIN 

/**FUNCIONES de drag con los resultados y drop con el grafico */
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  console.log("Hola, ingreso de entidad en el svg")
  var data = ev.dataTransfer.getData("text")
  var id = document.getElementById(data)
  var x = ev.offsetX
  var y = ev.offsetY

  let idnew = data.substring(0,1)

  LOGO && console.log(ev)
  LOGO && console.log('drop:', data, x, y)
  //console.log(d3.select(ev.target).attr('id'))
  //LOGO && console.log(id)
  LOGO && console.log('idnew:',idnew)
  //onGetIdList(data, x, y)
 // var data = ev.dataTransfer.getData("text");
 // ev.target.appendChild(document.getElementById(data));


  if( idnew == 'e'){
    //Mover una entidad
    onGetIdList(data, x, y)
  }
  else if (idnew == 'o'){
    //Mover un grupo
    LOGO && console.log("Mover muchos ", data)
    addAllEntities(data, x, y)
  }
  else if (idnew == 'c'){
    LOGO && console.log("ENCABEZADDO", data)
    LOGO && console.log(dictIds)
    addAllHeaders(data, x,y)
  }

 
}

function addAllHeaders(id,x,y){
  LOGO && console.log("ADD:", id, x , y)
  let listElements = dictIds[id]
  LOGO && console.log("ids: ", listElements)

  for(let index in listElements){
    let element = listElements[index]
    let asamb;

    if(organismoOp == 1){
      asamb = asambleistas[element]
      
    }
    else{
      asamb = paisesUN[element]
      
    }
    
    //console.log(element, asamb)
    
    entidades[asamb.numeroId] = asamb
    entidades[asamb.numeroId].xOffset = x +170
    entidades[asamb.numeroId].yOffset = y +80
    entidades[asamb.numeroId].visitado = true
  }

  LOGO && console.log("entidades next: ", entidades)
  updateNodes()
}

/**Checkear las entidades y meterlas al canvass */
function onGetIdList(id, x , y){
  LOGO && console.log("ADD:", id, x , y)
  let idnew = id.substring(1)
  LOGO && console.log(idnew)

  let element;
  if(organismoOp == 1){
    element = asambleistas[idnew]
  }
  else{
    element = paisesUN[idnew]
    //element.numeroId = element.ccode
  }
  

  if(element.visitado == false){
    if (!(element.numeroId in entidades)){
      entidades[element.numeroId] = element
      entidades[element.numeroId].xOffset = x +170
      entidades[element.numeroId].yOffset = y +80
      LOGO && console.log(entidades, d3.values(entidades).length)
    }
    else{
      entidades[element.numeroId].visitado = true
    }
    element.visitado = true
    LOGO && console.log("checked", element.visitado);
    updateNodes()
    
  }
  else {
    entidades[element.numeroId].visitado = false
    updateNodes()
  }
}

//Add todas las entidades del grupo
function addAllEntities(id, x, y){
  LOGO && console.log("ADD:", id, x , y)
  let idnew = id.substring(1)
  LOGO && console.log(idnew)

  let listElements = dictElements[idnew]
  LOGO && console.log("grupo: ", listElements)
  LOGO && console.log("entidades prev: ", entidades)

  for(let index in listElements){
    let element = listElements[index]
    //console.log(element)
    let idEl = element.numeroId
    entidades[idEl] = element
    entidades[idEl].xOffset = x +170
    entidades[idEl].yOffset = y +80
    entidades[idEl].visitado = true
    //entidades[idEl].voto = element.voto
    //entidades[idEl].curul = element.curul
  }
  LOGO && console.log("entidades next: ", entidades)
  updateNodes()
}

let tmpColorMap; 
function updateNodes () {

  flagEmptySes = false;

  if (flagEmptyChart) init()//nodosCentrales();
  else {
    console.log("cuidado ")
    if (currentOptChart == "1") {
      LOGO && console.log("CLUSTERS: update Nodes");
      //flagEmptySes = false;

      let newnodes = newNodesMatrix()
      groups = _groups();
      
      //tmpColor = $("#colores-select").val();
      //colorMap = 'partidos'

      optionColor1()
      updateInfoChart2(currentSes)

      nodes = createNodes(newnodes, groups);

      //entityList.innerHTML = "";
      //let list = sortByOption(optionSort, nodosActuales)
      //entityList.innerHTML = ''
      //ListEntitys(list, colorMap, false)
//
      //findEntities(valueText);
      updateCluster(currentSes, false)

      //d3.timeout(clusters, 500);
      sortFunction(nodosActuales);
      updateLegends()
      //updateTable(nodes)
      if (!flagEmptyChart) getAllLinks();
    } else if (currentOptChart == "3") {
      //currentOptChart = value
      LOGO && console.log("CURULES: update Nodes");
      //flagEmptySes = false;
      optionColor2()
      updateInfoChart2(currentSes)
      removeAllLinks();
      //showOptCurules()
      //hideVotesGrp()
      //colorMap = "voto"
      //$("#colores-select").val("voto").change();
      //$('#colores-select').multiselect('select', 'voto', true)
      //$('#colores-select').multiselect('deselect', 'partidos')
      //optionSort = 5

      //sortFunction(nodosActuales);
      

      d3.timeout(updateCurules, 500);

      let list = sortByOption(optionSort, nodosActuales)
      entityList.innerHTML = ''
      ListEntitys(list, colorMap, false)
      updateLegends()

      if (!flagEmptyChart) {
        LOGO && console.log("Entra");
        getAllLinks();
      }
    }else if(currentOptChart == "2"){
      hideVotesGrp()
      optionColor1()

      
      d3.timeout(updateCvn, 500);
      let listEntity = Object.values(entidades);
      sortFunction(listEntity, colorMap);
      updateLegends()
    }else if(currentOptChart == "4"){
      createSet()
    }
  }
  
  
}


function nodosCentrales(){
  let newnodes = newNodesMatrix()
  colorMap = $("#colores-select").val();
  nodes = createNodesCenter(newnodes)
  nodes.sort((a, b) => (a.codpartido > b.codpartido) ? 1 : ((b.codpartido > a.codpartido) ? -1 : (b.codpartido > a.codpartido) ? -1 : ((a.codpartido > b.codpartido) ? 1 : 0)))
  optionSort = 2
  console.log(nodosActuales)
  sortFunction(nodosActuales, colorMap)
  d3.timeout(chart, 500);
}

function newNodesMatrix(){
  let newnodes = [];
  for (let key in entidades) {
    if (entidades[key].visitado == true) newnodes.push(entidades[key]);
  }
  LOGO && console.log("newnodes:", newnodes);
  LOGO && console.log("Entidades:", entidades);

  return newnodes;
}