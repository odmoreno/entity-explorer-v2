/**Listas de entidades ubicadas en la derecha */
let LOGLI = false

let optionSort = 1
let dictElements ={}

let dictEntidades = {
  'Región': {label: false, name: 'region'},
  'Partido': {label: false, name: 'partidos'},
  'Provincia': {label: false, name: 'provincia'},
  'Todos': {label: false, name: 'todos'},
}


//Lista de asambleistas en la derecha
let entityList = document.getElementById('entity-list');

//Bandera para identificar si se debe transicionar la lista de entidades
let transitionFlag = true

//Lista de asambleistas ubicado a la derecha
function ListEntitys (nodos, _colorMap = colorMap, _transitionFlag = transitionFlag) {
  let list = Object.values(nodos)
  //LOGO && 
  list = list.filter(element => element.visitado) 
  LOGO && console.log("LIST:", list, _colorMap)
  if(currentOptChart ==4){
    list = list.sort((a,b) => {
      if(a.codpartido > b.codpartido) return 1 
      if(a.codpartido < b.codpartido ) return -1

      if (dictTmp[a.voto] > dictTmp[b.voto]) return 1;
	    if (dictTmp[a.voto] < dictTmp[b.voto]) return -1;
    })
  }
  d3.select('#div-entity').style('height','792px')
  const html = list.map(element => 
    `<div id="e${element.numeroId}" class="card-list asamb-list nodrag noselect" 
        style="margin-bottom: 10px;  border: ${!element.labelFlag ? '2px solid white' : '2px solid orange' }  ">
        <div class="d-flex flex-row justify-content-between">
          <div style="align-items: center;">

            <svg height="22" width="22" style="margin-right: 2px;">
              <circle class="circle_entity" cx="9" cy="10" r="8" fill="${color(element, _colorMap)}" 
                stroke="${d3.rgb(color(element, _colorMap)).darker(1)}" stroke-width="1" 
                style="opacity: ${_transitionFlag ? '0.2' : '1'};"
                /></svg>

            <span id="z${element.numeroId}" class="${element.visitado ? 'entitySelected': 'entityAway'}"  
                  onmouseover="overEntity(${element.numeroId})" onmouseleave="onLeaveEntity(${element.numeroId})"> 
                    ${element.nombre} </span>
          </div>
          <div class="dropdown no-arrow">
            <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-h fa-sm fa-fw text-gray-400"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
              <div class="dropdown-header">Opciones:</div>
                <a class="dropdown-item" onclick="removeEntityChart(${element.numeroId})" style="display: ${element.visitado ? 'block': 'none'} ;">Remover del gráfico</a>
                <a class="dropdown-item" id="quitar${element.numeroId}" onclick="quitarResaltado(${element.numeroId})" style="display: ${element.visitado && element.labelFlag ? 'block': 'none'} ;">Quitar resaltado</a>
                <a class="dropdown-item" id="fijar${element.numeroId}" onclick="fijarResaltado(${element.numeroId})" style="display: ${element.visitado && !element.labelFlag ? 'block': 'none'} ;">Fijar resaltado</a>
            </div>
          </div>
        </div>
    </div>`
  ).join('');

  entityList.innerHTML += html
  divTootltip()

  if (_transitionFlag){
    //d3.select("#entity-list")
    //  //.selectAll('circle')
    //  .transition()
    //  .duration(durationRect)
    //  .style("opacity", 1);
    d3.selectAll('.circle_entity').transition().duration(durationRect).style("opacity", 1);
  }
    

}

function divTootltip(){
  const asambsDivs = document.querySelectorAll('.entitySelected');
  LOGO && console.log("tips:", asambsDivs);

  asambsDivs.forEach(change => change.addEventListener("mouseover", function() {
    let id = change.id.substring(1)
    let d;

    if(organismoOp == 1){
      d = entidades[id]
    }
    else{
      d = paisesUN[id]
      //element.numeroId = element.ccode
    }

    LOGLI && console.log("Change:", id, d)
    
    tippy(change, {
      allowHTML: true,
      //theme: 'light',
      placement: 'left',
      content: organismoOp == 1? op1ToolTip(d) :  op2TootlTip(d),
      offset: [0, 50],
    });
    const instance = change._tippy;
    //instance.setContent("Updated content!");
  }));
}

op1ToolTip = (d) =>{
  return `<div class="d-flex flex-column">
      <span id="asambTip" class="p-1" ><span >Legislador ${d.tipo == 'nacional' ? d.tipo : ` por <b> ${d.provincia.toUpperCase()} </b>`  }</span></span>
      <span id="votoTip" class="p-1" ><span style='text-transform:capitalize; align-content: center;' >${!flagEmptyChart ? 'Voto: ' + d.voto : '' }</span></span>
      <span id="partidoTip" class="p-1" ><span style='text-transform:capitalize; align-content: center;' >Partido: ${ d.partido }</span></span>
  </div>`
}

op2TootlTip = (d) => {
  return `<div class="d-flex flex-column">
      <span id="asambTip" class="p-1" ><span >Pais ${d.name}</span></span>
      <span id="grupoTip" class="p-1" ><span >${groupCodes[d.region]}</span></span>
      <span id="votoTip" class="p-1" ><span style='text-transform:capitalize; align-content: center;' >${
        !flagEmptyChart ? "Voto: " + d.voto : ""
      }</span></span>
  </div>`;
};

function overEntity(id){
  let element;

  if(currentOptChart == 4) onhoverParallelset(entidades[id])
  else {
    if(nodosAcumuladosFlag){
      element = entidades[id]
      if(element.visitado){
        d3.select("#e"+id).style("border", "2px solid orange")
        d3.select("#node"+id).attr("stroke", "orange").attr("stroke-width", 3.0)
        //d3.select('#text' + id).attr("visibility", "visible")
      }  
    }
    else{
      
      if(organismoOp == 1)element = nodosActuales[id]
      else element = paisesUN[id]

      LOGLI && console.log("element de nodos actuales:", element)
      if(element.visitado){
        d3.select("#e"+id).style("border", "2px solid orange")
        d3.select("#node"+id).attr("stroke", "orange").attr("stroke-width", 3.0)
        //d3.select('#text' + id).attr("visibility", "visible")
      }
    }
  }
  //tip3.attr('class', 'd3-tip animate').show(element)
}

function onLeaveEntity(id){
  let element;
  if(currentOptChart == 4) onleaveParallelset()
  else{
    if(nodosAcumuladosFlag){
      element = entidades[id]
      if(element.visitado && !element.labelFlag){
        var _color = d3.select("#node"+id).attr('fill')
        d3.select("#e"+id).style("border", "2px solid white")
        d3.select("#node"+id).attr("stroke", d3.rgb(_color).darker(1) ).attr("stroke-width", 1)
        //d3.select('#text' + id).attr("visibility", "hidden")
      } 
    }
    else{
      if(organismoOp == 1)element = nodosActuales[id]
      else element = paisesUN[id]
      if(element.visitado && !element.labelFlag){
        var _color = d3.select("#node"+id).attr('fill')
        d3.select("#e"+id).style("border", "2px solid white")
        d3.select("#node"+id).attr("stroke", d3.rgb(_color).darker(1) ).attr("stroke-width", 1)
        //d3.select('#text' + id).attr("visibility", "hidden")
      }
    }
  }
  
}

/**Opciones de la lista de asambleistas */
function removeEntityChart(id){
  entidades[id].visitado = false
  updateChartEntitys()
  findEntities(valueText)
}

function fijarResaltado(id){
  LOGO && console.log('Fijar ID:', id)
  let nodoCircle = d3.select("#node"+id)
  LOGO && console.log("Stroke:", nodoCircle.style("stroke"))

  nodoCircle.attr("stroke", "orange")
            .attr("stroke-width", 3.0)

  //d3.select('#text' + id).attr("visibility", "visible")

  d3.select("#e"+id).style("border", "2px solid orange")

  entidades[id].labelFlag = true

  d3.select('#fijar'+id).style("display", "none")
  d3.select('#quitar'+id).style("display", "block")
}

function quitarResaltado(id){
  d3.select("#node"+id).attr("stroke", "#fff").attr("stroke-width", 0)
  //d3.select('#text' + id).attr("visibility", "hidden")
  d3.select("#e"+id).style("border", "2px solid white")

  entidades[id].labelFlag = false
  d3.select('#fijar'+id).style("display", "block")
  d3.select('#quitar'+id).style("display", "none")
}

//Fin de las opciones de lista


/**Funciones para ordenar la lista de asambleistas */
function sortByOption(op, nodosDesordenados){

  let list = [... Object.values(nodosDesordenados)]
  //nodos.sort((a, b) => (a.curul > b.curul) ? 1 : ((b.curul > a.curul) ? -1 : 0))
  if(op == 1){
    list.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
  }
  else if (op == 2){
    list.sort((a, b) => (a.codpartido > b.codpartido) ? 1 : ((b.codpartido > a.codpartido) ? -1 : (b.nombre > a.nombre) ? -1 : ((a.nombre > b.nombre) ? 1 : 0)))
  }
  else if (op == 3){
    list.sort((a, b) => (a.region > b.region) ? 1 : ((b.region > a.region) ? -1 : (b.nombre > a.nombre) ? -1 : ((a.nombre > b.nombre) ? 1 : 0)))
  }
  else if (op == 4){
    list.sort((a, b) => (a.provincia > b.provincia) ? 1 : ((b.provincia > a.provincia) ? -1 : (b.nombre > a.nombre) ? -1 : ((a.nombre > b.nombre) ? 1 : 0)))
  }
  else if (op == 5){
    list.sort((a, b) => (a.voto > b.voto) ? 1 : ((b.voto > a.voto) ? -1 : (b.nombre > a.nombre) ? -1 : ((a.nombre > b.nombre) ? 1 : 0)))
  }
  else{
    list.sort((a, b) => (a.nombre > b.nombre) ? 1 : ((b.nombre > a.nombre) ? -1 : 0))
  }

  LOGO && console.log("sorted: ", list)
  return list
}

function sortHandler(val){
  optionSort = val
  sortFunction(nodosActuales)
}

function sortFunction(nodos, _colorMap = colorMap){
  let list = sortByOption(optionSort, nodos)
  entityList.innerHTML = ''
  ListEntitys(list, _colorMap)
}

//Fin de funciones de ordenamiento