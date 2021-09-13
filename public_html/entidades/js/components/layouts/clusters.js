var LOGC = true

function updateSesion(sesion) {
  nodosActuales = {}
  let nodosSesion = sesion.nodes
  LOGC && console.log("votos en sesion:", nodosSesion)
  for (let i = 0; i < nodosSesion.length; i++) {
      let _asamb = nodosSesion[i]
      LOGC && console.log("entidad actual:", _asamb)
      nodosActuales[_asamb.id] = asambleistas[_asamb.id]
      LOGC && console.log(nodosActuales[_asamb.id])
      if(organismoOp == 1){      
        nodosActuales[_asamb.id].voto = codeVotes[_asamb.voto]
      }
      else if(organismoOp == 2){
        let atry = UNcodes[_asamb.voto]
        LOGC && console.log(atry)
        nodosActuales[_asamb.id].voto = UNcodes[_asamb.voto]
      }

      if (entidades[_asamb.id]) {
          entidades[_asamb.id].visitado = true
          entidades[_asamb.id].lastvote = entidades[_asamb.id].voto
          entidades[_asamb.id].voto = organismoOp == 1 ? codeVotes[_asamb.voto] : UNcodes[_asamb.voto]
          entidades[_asamb.id].curul = _asamb.curul
          entidades[_asamb.id].xOffset = width / 2
          entidades[_asamb.id].yOffset = 300
          //entidades[_asamb.id].labelFlag = false
          nodosActuales[_asamb.id].visitado = true
      }
      //else console.log('No existe', this.id)
  }

  let newnodes = []
  for (let key in entidades) {
      if (entidades[key].visitado == true)
          newnodes.push(entidades[key])
  }

  LOGC && console.log("nodos 137: ", nodosActuales)
  //console.log("total: ",  d3.values(nodosActuales).length)
  return newnodes
}

function updateSesionUN(sesion) {
  nodosActuales = {}
  let nodosSesion = sesion.nodes
  LOGC && console.log("votos en sesion:", nodosSesion)
  for (let i = 0; i < nodosSesion.length; i++) {
      let _asamb = nodosSesion[i]
      //console.log("entidad actual:", _asamb)
      nodosActuales[_asamb.ccode] = paisesUN[_asamb.ccode]
      //console.log(nodosActuales[_asamb.ccode])
      nodosActuales[_asamb.ccode].voto = UNcodes[_asamb.voto]
      if (entidades[_asamb.ccode]) {
          entidades[_asamb.ccode].visitado = true
          entidades[_asamb.ccode].lastvote = entidades[_asamb.ccode].voto
          entidades[_asamb.ccode].voto = organismoOp == 1 ? codeVotes[_asamb.voto] : UNcodes[_asamb.voto]
          entidades[_asamb.ccode].curul = _asamb.curul
          entidades[_asamb.ccode].xOffset = width / 2
          entidades[_asamb.ccode].yOffset = 300
          //entidades[_asamb.ccode].labelFlag = false
          nodosActuales[_asamb.ccode].visitado = true
      }
      //else console.log('No existe', this.id)
  }

  let newnodes = []
  for (let key in entidades) {
      if (entidades[key].visitado == true)
          newnodes.push(entidades[key])
  }

  LOGC && console.log(entidades)
  LOGC && console.log("nodos 137: ", nodosActuales)
  //console.log("total: ",  d3.values(nodosActuales).length)
  return newnodes
}


function updateCluster(id, flag) {
  LOGC && console.log("sesion id update:", id)
    removeAllLinks()
    resetFlags()
    let data;
    let newnodos;

    if(organismoOp == 1){      
      data = sesiones[id]
      newnodos = updateSesion(data)
    }
    else if(organismoOp == 2){
      data = unResolutions[id]
      newnodos = updateSesionUN(data)
    }
    LOGC && console.log("Current DATA:", data)

    currentSes = id
    groups = _groups()
    //console.log("sesion:", data)
    
    nodes = createNodes(newnodos, groups)

     LOGC && console.log("entidades:", entidades, Object.values(entidades).length)
     LOGC && console.log("nodes:", nodes)
    updateInfoChart(data)

    //initializeList(nodosActuales)
    doNotAnimate = flag
    //sortFunction(nodosActuales)
    d3.timeout(clusters, 500)
    //updateTable(nodes)
}

function clusters() {
  // rects for each node.
  if (doNotAnimate)  durationRect = 1;

  circles = circles
    .data(nodes, (d) => {
      //console.log("D:", d)
      
      if(d.data){
        return d.data.id
      }
      else  
        return d.id

    })
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", (d) => selectClass(d))
          //.attr("cx", (d) => d.xOffset)
          //.attr("cy", (d) => d.yOffset)
          .attr("r", 0)
          .attr("transform", (d) => "translate(" + d.xOffset + "," + d.yOffset + ")")
          .attr("opacity", 0)
          .attr("stroke-width", (d) => (d.labelFlag ? 3.0 : 1))
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .attr("id", (d) => {
                LOGC && console.log("Enter circle")
                return d.id;
              })
              .attr("stroke", (d) => {
                var _color = color(d, colorMap);
                return d3.rgb(_color).darker(1);
              })
              //.attr("cx", (d) => d.x) //Offset)
              //.attr("cy", (d) => d.y) //Offset)
              .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
              .attr("r", circleRadius)
              .attr("fill", (d) => color(d, colorMap))
              .attr("opacity", 1)
          )
          .call((enter) =>
            enter
              .select("rect")
              .transition()
              .duration(durationRect)
              .attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y)
          ),

      (update) =>
        update
          .attr("id", (d) => {
            LOGC && console.log("update cluster:")
            return d.id
          })
          .attr("class", (d) => selectClass(d))
          .transition()
          .duration(durationRect)
          .attr("stroke", (d) => {
            var _color = color(d, colorMap);
            return d3.rgb(_color).darker(1);
          })
          .attr("stroke-width", (d) => (d.labelFlag ? 3.0 : 1))
          //.attr("cx", (d) => d.x)
          //.attr("cy", (d) => d.y)
          .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
          .attr("r", circleRadius)
          .attr("fill", (d) => {

            var _color = color(d, colorMap)
            LOGC && console.log("COLOR UPDATE:", _color)
            return _color
          }),
      (exit) =>
        exit
          .transition()
          .duration(durationRect)
          .style("opacity", () => {
            LOGC && console.log("eliminar");
            return 0;
          })
          .remove()
    );

  circles
    .on("mouseover", (d) => mouseOverRect(d))
    .on("mouseout", (d) => mouseOutRect(d));

  //rect.on('contextmenu', d3.contextMenu(menu));
  //rect.on('contextmenu', d3.contextMenu(menu, {
  //	onOpen: function() {
  //		console.log('Quick! Before the menu appears!');
  //	},
  //	onClose: function() {
  //		console.log('Menu has been closed.');
  //	}
  //})); // attach menu to element

  //Labels para cada asambleistas
  createLabels();
  if (currentOptChart == 1) {
    // Group name labels, labels para los nombres de los grupos
    if (!flagEmptyChart) {
      grptexts
        .selectAll(".grp")
        .data(d3.keys(groups))
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("opacity", "0")
              .attr("class", "grp")
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "middle")
              //.attr("x", (d) => groups[d].x)
              //.attr("y", (d) => groups[d].y - 50)
              .text((d) => {
                //console.log("enter grp", flagEmptySes)
                var text = flagEmptySes
                  ? groups[d].fullname
                  : groups[d].fullname + " (" + groups[d].cnt + ")";
                //console.log(text)
                return text;
              })
              .call((enter) =>
                enter
                  .transition()
                  .duration(durationRect)
                  .attr("opacity", "1")
                  .attr("transform", (d) => "translate(" + groups[d].x + "," + (groups[d].y - 50) + ")")
                  //.attr("transform", "scale(1,1)")
              ),
          (update) =>
            update
              .text((d) => {
                var text = flagEmptySes
                  ? groups[d].fullname
                  : groups[d].fullname + " (" + groups[d].cnt + ")";
                //console.log(text)
                return text;
              })
              .transition()
              .duration(durationRect)
              .attr("opacity", "1")
              .attr("transform", (d) => "translate(" + groups[d].x + "," + (groups[d].y - 50) + ")"),
              //.attr("transform", "scale(1,1)"),

          (exit) => exit.remove()
        );
    }
  }
}

selectClass = (d) => {
  //console.log("colormap:", colorMap)
  
  if(organismoOp == 1){      
    if(colorMap == "partidos"){
      return d.codpartido + " nodeCircle"
    }
    else if(colorMap == "voto"){
      if (d.visitado) 
        return d.voto + " nodeCircle"
    }
  }
  else if(organismoOp == 2){
    if(colorMap == "partidos"){
      return "nodeCircle"
    }
    else if(colorMap == "voto"){
      if (d.visitado) 
        return d.voto + " nodeCircle"
    }
  }

}

selectClassTextLabels = (d) => {
  if(colorMap == "partidos"){
    return d.codpartido + " labeltext"
  }
  else if(colorMap == "voto"){
    if (d.visitado) 
      return d.voto + " labeltext"
    else
      return "sin labeltext"
  }
}

createLabels = () => {

  texts = texts
    .data(nodes, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("opacity", 0)
          .attr("class", (d) => selectClassTextLabels(d))
          .attr("text-anchor", "middle")
          .attr("id", (d) => "text" + d.numeroid)
          .text((d) => getNameAsamb(d))
          .attr("transform", (d) => "translate(" + d.xOffset + "," + d.yOffset + ")")
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .attr("transform", (d) => "translate(" + d.x + "," + (d.y+30) + ")")
              .style("opacity", 1)
          ),
      (update) =>
        update
          .attr("class", (d) => selectClassTextLabels(d))
          .transition()
          .duration(durationRect)
          .attr("text-anchor", "middle")
          .attr("id", (d) => "text" + d.numeroid)
          //.attr('opacity', 1)
          .text((d) => getNameAsamb(d))
          .attr("transform", (d) => "translate(" + d.x + "," + (d.y+30) + ")")
          .style("opacity", 1),
      (exit) => exit.remove()
    );
};

getNameAsamb = (d) => {
  
  //console.log('NAME:',d)
  if (organismoOp == 1) {
    var name = d.idnombre.split(" ");
    var initials = "";
    initials = name[0].charAt(0).toUpperCase() + name[0].slice(1);

    if (initials.length > 6) initials = initials.substring(0, 6);

    return initials;
  } else if (organismoOp == 2) {
    return d.idnombre
  }

};

updateInfoChart = (sesion) => {
  d3.select("#timecount .Scnt").text(sesion.sesion);
  d3.select("#timecount2 .Vcnt").text(sesion.votacion);

  $("#asunto")[0].innerHTML = sesion.asunto;

  if(organismoOp == 1){
    $("#fecha")[0].innerHTML = sesion.fecha;
    $("#hora")[0].innerHTML = sesion.hora;
  }
  else if(organismoOp == 2){
    $("#fecha")[0].innerHTML = sesion.date;
  }

  
};

updateInfoChart2 = (id) => {
  let data;
  if(organismoOp == 1){
    data = sesiones[id]
  }
  else if(organismoOp == 2){
    data = unResolutions[id]
  }

  updateInfoChart(data)
}

updateEmptyInfo = () => {
  d3.select("#timecount .Scnt").text('');
  d3.select("#timecount2 .Vcnt").text('');

  $("#asunto")[0].innerHTML = '';
  $("#fecha")[0].innerHTML = '';
  $("#hora")[0].innerHTML = '';
}

mouseOverRect = (d) => {
  tip.attr("class", "d3-tip animate").show(d);
  //tip.show(d)
  let id = "#e" + d.numeroid;
  d3.select(id).style("border", "2px solid orange");
  //console.log(d3.select(id))
};

mouseOutRect = (d) => {
  tip.attr("class", "d3-tip").show(d);
  tip.hide();

  if (!d.labelFlag) {
    let id = d.numeroid;
    d3.select("#e" + id).style("border", "2px solid white");
  }
};


