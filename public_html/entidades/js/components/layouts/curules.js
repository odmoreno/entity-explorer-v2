/**
 * curules.js
 * Grafico para dibujar los curules
 */

 var LOGCU = true

 
var w2;
var h2;
var points;

function updateCurules(){

  LOGCU && console.log("Sesion Actual:", currentSes)
  LOGCU && console.log("Nodos actuales:", nodes)

  let data;

  if(organismoOp == 1){      
    data = sesiones[currentSes]
  }
  else if(organismoOp == 2){
    data = unResolutions[currentSes]
  }


  points = testp()
  const newnodes = updateNodesCurules(data)
  const validcurulnodes = createNodes(newnodes, groups)

  console.log("nodos curul:", validcurulnodes)
  
  optionColor2()
  LOGCU && console.log("colorMap:", colorMap, currentSes)
  //colorMap = 'voto'

  if(!flagEmptySes && !flagEmptyChart)
    calculateData(validcurulnodes)

}

function testp() {
  const unParliament = {
    1: {
      seats: 54,
      colour: '#0000FF'
    },
    2: {
      seats: 54,
      colour: '#339900'
    },
    3: {
      seats: 23,
      colour: '#CC0000'
    },
    4: {
      seats: 33,
      colour: '#CC3399'
    },
    5: {
      seats: 28,
      colour: '#CC9900'
    },
    7: {
      seats: 1,
      colour: '#c0c0c0'
    }
  }

  const radius = 500
	const points = generatePoints(unParliament, radius)
  let elements = points.map(pointToSVG2)
  elements = _.sortBy(elements, ['class']);
  console.log("points", points)
  console.log("elements", elements)
  
  return elements
}

function updateNodesCurules(sesion){

  let nodosActualesC = {}
  let nodosSesion = sesion.nodes  
  
  if(organismoOp == 1){
    for (let i=0; i<nodosSesion.length; i++){
      let _asamb = nodosSesion[i]
      nodosActualesC[_asamb.id] = asambleistas[_asamb.id]
      nodosActualesC[_asamb.id].voto = codeVotes[_asamb.voto]
      nodosActualesC[_asamb.id].curul = _asamb.curul
      if(entidades[_asamb.id]){
          nodosActualesC[_asamb.id].visitado = true
          nodosActualesC[_asamb.id].xOffset = width/2
          nodosActualesC[_asamb.id].yOffset = 300
      }
    }  
  }
  else if (organismoOp ==2){
    for (let i=0; i<nodosSesion.length; i++){
      let _asamb = nodosSesion[i]
      nodosActualesC[_asamb.ccode] = paisesUN[_asamb.ccode]
      nodosActualesC[_asamb.ccode].voto = UNcodes[_asamb.voto]
      nodosActualesC[_asamb.ccode].curul = _asamb.ccode
      if(entidades[_asamb.ccode]){
          nodosActualesC[_asamb.ccode].visitado = true
          nodosActualesC[_asamb.ccode].xOffset = width/2
          nodosActualesC[_asamb.ccode].yOffset = 300
      }
    }  
  }

  let newnodes = []
  for (let key in nodosActualesC) {
    newnodes.push(nodosActualesC[key])
  }
  
  LOGCU && console.log("nodos Curules 137: ", nodosActualesC)
  //console.log("total: ",  d3.values(nodosActuales).length)

  let elementNodes = []
  elementNodes = [... newnodes]

  return elementNodes

}

function calculateData(validNodesCurul){
  let curulesPorFila;

  w2 = 800 -100//width
  h2 = 700 -180//height
  var xyfactor = w2 / 45.0//40.0;
  //console.log('factor', xyfactor)
  var acx = (690-w2) / 6.4//8.4
  var cx = w2 / 2 + acx;// - 20;
  var cy = h2 / 4 - 20;
  var tcx = (800-w2)*0.28;
  var tcy = -(690-w2)/23.0;

  
  if(organismoOp == 1){      
    curulesPorFila = [[2, 4], [3, 5], [4, 6], [5, 7], [6, 9], [8, 10]];
  }
  else if(organismoOp == 2){
    //curulesPorFila = [[8, 8], [9, 9], [10, 10], [12, 12], [13, 13], [14, 14], [15, 15], [17, 17]];
    curulesPorFila = [[4, 4], [5, 5], [5, 5], [5, 7], [6, 7], [7, 7], [7, 8], [8, 10]];
  }
   
  let test  =  getNodosEdit(validNodesCurul, curulesPorFila, cx, cy, tcx, tcy, xyfactor)
  LOGCU && console.log('edit', test)

  if (organismoOp == 1) {
    drawCurules(test);
  } else {
    let test2 = test.map((n, i) => {
      //console.log(n,i)
      n.cx = points[i].cx;
      n.cy = points[i].cy;
      n.r = 10; //points[i].r
      return n;
    });
    drawCurules(test2);
  }


  //postCalculate(validNodesCurul, curulesPorFila)

}

function postCalculate(validNodesCurul, curulesPorFila){
  
}

function drawCurules(test){
  
  LOGCU && console.log("test", test)
  let offsetY = -120

  circles = circles
    .data(test, (d) => {
      if(d.data){
        return d.data.id
      }
      else  
        return d.id
    }) //, d=> d.curul)
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", (d) => selectClass(d))
          .attr("id", (d) => d.id)
          .attr("r", circleRadius)
          .style("opacity", 0)
          .attr("fill", (d) => {
            //console.log("enter curul:", d);
            if (d.visitado) {
              var _color = color(d, colorMap)
              LOGCU && console.log(_color)
              return _color
            } else {
              return "#fff";
            }
          })
          //.attr("cx", (d) => {
          //  //console.log("cx")
          //  return d.cx;// + 400;
          //})
          //.attr("cy", (d) => d.cy + offsetY)// + 100)
          .attr("transform", (d) => "translate(" + d.cx + "," + (d.cy + offsetY) + ")")
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .style("opacity", (d) => {
                if (d.visitado) {
                  return d.opacidad;
                } else {
                  return 0.3;
                }
              })
              .attr("stroke", (d) => {
                var _color = color(d, colorMap);
                return d3.rgb(_color).darker(1);
              })
              .attr("stroke-width", 1)
          ),
      (update) =>
        update
          .attr("class", (d) => selectClass(d))
          .attr("id", (d) => d.id)
          .attr("r", circleRadius)
          .transition()
          .duration(durationRect)
          .attr("stroke", (d) => {
            var _color = color(d, colorMap);
            return d3.rgb(_color).darker(1);
          })
          .attr("stroke-width", 1)
          .attr("fill", (d) => {
            if (d.visitado) {
              LOGCU && console.log("update curul");
              return color(d, colorMap);
            } else {
              return "#fff";
            }
            //if(d.suplente){
            //    return color(d, colorMap)//"#fff"
            //}else return  color(d, colorMap)
          })
          //.attr("cx", (d) => {
          //  //console.log("cx")
          //  return d.cx;// + 400;
          //})
          //.attr("cy", (d) => d.cy + offsetY )// + 100)
          .attr("transform", (d) => "translate(" + d.cx + "," + (d.cy + offsetY) + ")")
          .style("opacity", (d) => {
            if (d.visitado) {
              return d.opacidad;
            } else {
              return 0.3;
            }
          }),
      (exit) =>
        exit
          .transition()
          .duration(durationRect)
          .style("opacity", () => {
            LOGCU && console.log("eliminar");
            return 0;
          })
          .remove()
    );

  
  //circles.on("mouseover", tip.show).on("mouseout", tip.hide)
  circles
    .on("mouseover", (d) => mouseOverRect(d))
    .on("mouseout", (d) => mouseOutRect(d));
  
  circles.on("click", function(e){
  
    validateKeypress(e)
    
  })


  texts = texts
    .data(test, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("visibility", "visible")
          .attr("class", (d) => selectClassTextLabels(d))
          .attr("text-anchor", "middle")
          .attr("id", (d) => "text" + d.numeroid)
          .style("font-size", organismoOp == 1 ? "10px" : "14px")
          .text((d) => getNameAsamb(d))
          .call((enter) =>
            enter
              .attr("transform", (d) => "translate(" + d.cx + "," + (d.cy+25+offsetY) + ")")
              .transition()
              .duration(durationRect)
              .style("opacity", (d) => {
                if (d.visitado) {
                  return d.opacidad;
                } else {
                  return 0.3;
                }
              })
              //.attr("opacity", 1)
          ),
      (update) =>
        update
          .attr("id", (d) => "text" + d.numeroid)
          .attr("text-anchor", "middle")
          .attr("class", (d) => selectClassTextLabels(d))
          .style("font-size", organismoOp == 1 ? "10px" : "14px")
          //.attr('opacity', 1)
          .transition()
          .duration(durationRect)
            .text((d) => getNameAsamb(d))
            .attr("transform", (d) => "translate(" + d.cx + "," + (d.cy+25+offsetY) + ")")
          .style("opacity", (d) => {
            LOGCU && console.log("Opacidad:", d)
            if (d.visitado) {
              LOGCU && console.log("Opacidad:", d)
              return d.opacidad;
            } else {
              return 0.3;
            }
          }),
          //.attr("opacity", ()=> 1)
      (exit) => exit.remove()
    );
        

}

function getNodosEdit (newnodes, curulesPorFila, cx, cy, tcx, tcy, xyfactor){
    
  var contadorGeneral = 0;
  let test = [...newnodes]

  //console.log(curulesPorFila)
  //console.log(curulesPorFila.length)
  if(organismoOp == 1){      
    test.sort((a,b) => (a.curul > b.curul) ? 1 : ((b.curul > a.curul) ? -1 : 0))
  }
  else if(organismoOp == 2){
    test.sort((a,b) => (a.region > b.region) ? 1 : ((b.region > a.region) ? -1 : 0))
  }

  // Primer bloque de asambleistas
  //console.log('Primer bloque de asambleistas ')
  for (var i = 0; i < curulesPorFila.length; i++) {
    //console.log("contador1 : ", contadorGeneral)
      var radio = 150 + (27*xyfactor/20) * i;
      var bloques = curulesPorFila[i];
      var deltaAngulo = (25*xyfactor/20) / radio;
      var angulo = Math.PI / 4 - ((10*xyfactor/20) * Math.PI / 180) - bloques[0] * deltaAngulo;
      //console.log('B1 1 ->')
      for (var k = 0; k < bloques[0] && contadorGeneral < test.length; k++) {
          var px = cx + radio * -1 * Math.cos(angulo);
          var py = cy + radio * Math.sin(angulo);
          //console.log('counter:', contadorGeneral)
          
          test[contadorGeneral].cx = px * 2
          test[contadorGeneral].cy = py * 2
          test[contadorGeneral].r = xyfactor -9
          angulo += deltaAngulo;
          contadorGeneral++;
      }

      //console.log('B1 2 ->')
      angulo += deltaAngulo;
      for (k = 0; k < bloques[1] && contadorGeneral < test.length; k++) {
          px = cx + radio * -1 * Math.cos(angulo);
          py = cy + radio * Math.sin(angulo);
          
          test[contadorGeneral].cx = px * 2
          test[contadorGeneral].cy = py * 2
          test[contadorGeneral].r = xyfactor -9
          //console.log('counter 2 :', contadorGeneral)
          angulo += deltaAngulo;
          contadorGeneral++;
      }
  }

  
  // Segundo grupo de dos bloques.
  var deltaMax3 = 25 / (150 + (27*xyfactor/20) * (curulesPorFila.length - 1));
  var anguloMax = angulo + deltaMax3 * (curulesPorFila[curulesPorFila.length - 1][1] + 1);

  for (i = 0; i < curulesPorFila.length; i++) {
    //console.log("contador2: ", contadorGeneral)
      var radio = 150 + (27*xyfactor/20) * i;
      var bloques = curulesPorFila[i];
      var deltaAngulo = (25*xyfactor/20) / radio;
      var angulo = anguloMax - deltaAngulo * bloques[1];

      for (k = 0; k < bloques[1] && contadorGeneral < test.length; k++) {
          var px = cx - tcx + radio * -1 * Math.cos(angulo);
          var py = cy - tcy + radio * Math.sin(angulo);
          
          test[contadorGeneral].cx = px * 2
          test[contadorGeneral].cy = py * 2
          test[contadorGeneral].r = xyfactor -9
          
          angulo += deltaAngulo;
          contadorGeneral++;
      }

      angulo += deltaAngulo;
      for (k = 0; k < bloques[0] && contadorGeneral < test.length; k++) {
          var px = cx - tcx + radio * -1 * Math.cos(angulo);
          var py = cy - tcy + radio * Math.sin(angulo);

          test[contadorGeneral].cx = px * 2
          test[contadorGeneral].cy = py * 2
          test[contadorGeneral].r = xyfactor -9
          //console.log("contador2: ", contadorGeneral)
          angulo += deltaAngulo;
          contadorGeneral++;
      }
  }
  return test
}
