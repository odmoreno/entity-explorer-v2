/**Zona de leyendas */
var LOGLY = true;

let legendsSvg = d3.select("#legend-area")
    .append("svg")
    .attr("height", "550")

let legends = legendsSvg.append("g")
    .attr("id", "lga")
    .attr("transform", "translate(10, 20)")


let dictLeg = {}
let legendFlag = true

let legendTagSearch = false

let newnodesLegends;

let cods = {
  creo: "creo",
  ap: "alianza pais",
  idp: "independiente",
  psc: "partido social cristiano",
  psa: "partido sociedad patriótica",
  id: "izquierda democrática",
  om: "otro movimiento",
  pac: "pachakutik",
  suma: "suma",
  mscc: "movimiento social conservador del carchi",
  mpup: "movimiento político unidos por pastaza",
  mpcg: "movimiento peninsular creyendo en nuestra gente",
  fe: "fuerza ecuador",
  a65: "ahora 65",
  jp: "juntos podemos",
  mat: "movimiento alianza tsáchila",
  midc: "movimiento integración democrática del carchi",
};

function updateLegends(){

  newnodesLegends = []
  
  LOGLY && console.log("current color Map:", colorMap)
  LOGLY && console.log("current nodos", entidades)

  legends.selectAll("g").remove()

  let nodosActuales = Object.values(entidades)

  dictLeg = {}

  newnodesLegends = nodosActuales.map( d => {
    //console.log(d)
    if(colorMap == "partidos"){
      if(!dictLeg[d.codpartido]){
        dictLeg[d.codpartido] = 1
        return d 
      }
    }
    else if (colorMap == "voto"){
      if(!dictLeg[d.voto]){
        dictLeg[d.voto] = 1
        return d 
      }
    }
    
  })

  newnodesLegends = newnodesLegends.filter(function(el) { return el; });
  
  LOGLY && console.log("Nuevas leyendas:", newnodesLegends)

  LOGLY && console.log("Leyendas:", dictLeg)
  //nodosActuales
  drawLegends(newnodesLegends, colorMap)
}

function drawLegends(elements, option) {
  elements.forEach(function (element, i) {
    //let valueid = element;
    //console.log(element)
    var legendRow = legends.append("g").attr("transform", () => {
      if (option == "voto") return "translate(0, " + i * 35 + ")";
      else if (option == "provincia") return "translate(0, " + i * 25 + ")";
      else if (option == "region") return "translate(0, " + i * 35 + ")";
      else if (option == "partidos") return "translate(0, " + i * 45 + ")";
    });
    legendRow.attr("class", "l"+element.codpartido)
            .style("border", "2px solid white")

    legendRow.on("mouseover", () => mouseOverLeg(element))
              .on("mouseout", () => mouseOutLeg(element))
              .call(d3.drag()
                .on("start", () => dragstartedL(element))
                .on("drag", () => draggedL(element, i))
                .on("end", () => dragendedL(element, i)))

    legendRow.append("rect")
      .attr("x",0)
      .attr("y",-1)
      .attr("width", 70)
      .attr("height", 22)
      .attr("fill", "white")

    legendRow
      .append("circle")
      .attr("cx", 9)
      .attr("cy", 10)
      .attr("r", 8)
      .attr("fill", () => { return color(element, option)} )
      .attr("stroke", d3.rgb(color(element, option)).darker(1))
      .attr("stroke-width", 1)

    legendRow
      .append("text")
      .style("text-transform", "capitalize")
      .attr("x", 25)
      .attr("y", 14)
      .attr("class", "legendTag")
      .text(option == "voto" ? element.voto : partidosInfo[element.codpartido].name)//cods[element.codpartido
      .call(wrapLegend);

    
  });
}

function handleLegend(value) {
  LOGLY && console.log("HOLAAA");
  if(value == 2)
    legendTagSearch = true
  else 
    legendTagSearch = false
}

/**Ajustar texto */
function wrapLegend(text) {
  text.each(function () {
      let text = d3.select(this)
      let word = text.text()
      var index = word.indexOf(' ', word.indexOf(' ') + 1);
      var firstChunk = word.substr(0, index);
      var secondChunk = word.substr(index + 1);
      LOGLY && console.log('1: ', firstChunk)
      LOGLY && console.log('2: ', secondChunk)
      x = text.attr("x")
      y = text.attr("y") -4
      if (firstChunk) {
          text.text(null)
          var tspan = text.append("tspan").attr("x", x).attr("y", y).text(firstChunk);
          var tspan1 = text.append("tspan").attr("x", x).attr("y", y+15).text(secondChunk);
      }

  })
}

function mouseOverLeg(d){
  //console.log("Over legend:", d)
  if(currentOptChart == 4){
    d3.selectAll("path").attr("opacity", 0.3)
    d3.selectAll('.'+d.codpartido).attr("opacity", 1)
    d3.selectAll('.l'+d.codpartido).select('rect').style('stroke','orange')
  }
  else if (currentOptChart == 3){
    d3.selectAll(".nodeCircle").style("opacity", 0.3)
    d3.selectAll(".labeltext").style("opacity", 0.3)
    d3.select("#group").selectAll("." + d.voto ).style("opacity", 1)
  }
  else {

    d3.selectAll(".nodeCircle").style("opacity", 0.3)
    d3.selectAll(".labeltext").style("opacity", 0.3)
    d3.select("#group").selectAll("." + d.codpartido ).style("opacity", 1)

  }
}

function mouseOutLeg(d){
  //console.log("Out legend:", d)
  if(currentOptChart == 4){
    d3.selectAll("path").attr("opacity", 1)
    d3.selectAll('.l'+d.codpartido).select('rect').style('stroke','white')
  }
  else if (currentOptChart == 3){
    d3.selectAll(".nodeCircle").style("opacity", 1)
    d3.selectAll(".labeltext").style("opacity", 1)
    d3.selectAll(".sin labeltext").style("opacity", 0.3)
  }
  else {
    d3.selectAll(".nodeCircle").style("opacity", 1)
    d3.selectAll(".labeltext").style("opacity", 1)
  }
}

function dragstartedL (d) {
  //console.log("start:", d)

}

function draggedL (d, i ) {
  LOGLY && console.log("dragged:", d , i*45)
    d3.select(".l"+d.codpartido)
    .attr("transform", "translate(" + (d3.event.x) + "," + (d3.event.y) + ")");

}

function dragendedL (d) {

  //console.log("end:", d)
}

