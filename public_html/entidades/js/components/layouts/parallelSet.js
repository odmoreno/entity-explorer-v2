/**
 * Parallel set demo https://observablehq.com/@d3/parallel-sets
 */

var LOGPS = true;
let sankey;

let gsets = d3
  .select("#svg1")
  .append("g")
  .attr("id", "sets")
  .attr(
    "transform",
    "translate(" + (-width / 2 + 50) + "," + (-height / 2 - 10) + ")"
  );

gsets.append("g").attr("id", "rectf");
gsets.append("g").attr("id", "linksf").attr("fill", "none");
gsets.append("g").attr("id", "namesf").style("font", "12px sans-serif");
gsets.append("g").attr("id", "votosf").style("font", "12px sans-serif");

let rectsF = d3.select("#rectf").selectAll("rect");
let linksf = d3.select("#linksf").selectAll("g"); //.selectAll("g")
let namesf = d3.select("#namesf").selectAll("text");
let votosf = d3.select("#votosf").selectAll("text");

//let leginline = d3.select("#inlineLeg");

let sesidsP = []; //keys de las sesiones
let entidadesKeys = [];
let firstid;
let lastid;

let dictTmp = {
  si: 1,
  abstencion: 2,
  blanco: 3,
  ausente: 4,
  no: 5,
};

let votosEnSesion = {
  si: 0,
  abstencion: 0,
  blanco: 0,
  ausente: 0,
  no: 0,
};

function resetVotos() {
  votosEnSesion = {
    si: 0,
    abstencion: 0,
    blanco: 0,
    ausente: 0,
    no: 0,
  };
}

function createSet() {
  console.log("sesiones:", idSesiones);
  sankey = d3
    .sankey()
    .nodeSort(null)
    .nodeId(idnode)
    .linkSort(null)
    .nodeWidth(10)
    //.nodePadding(20)
    .extent([
      [0, 5],
      [width, height - 5],
    ]);

  console.log("Sesion Actual:", currentSes);
  console.log("Entidades:", entidades);

  let newnodos = updateSesion(sesiones[currentSes]);
  let genlace = gEnlaces[currentSes];

  const nodosCvn = createNodesForCvn(newnodos, groups);

  //drawSet(nodosCvn, genlace)

  sesidsP = Object.keys(idSesiones);
  entidadesKeys = Object.keys(entidades);
  generateData()
}

function drawSet(data, grupoEnlaces) {
  let nodosSesion = data; // data.nodes pasa los nodos de las sesion y sus votos
  let linksSesion = grupoEnlaces.links; //data.links

  console.log("nodos:", nodosSesion);
  //console.log("linkscode:", linksSesion)

  let _codelinks = createLinksCodesSesions(nodosSesion, linksSesion);

  let dictTmpLinks = loopCodeLinks(_codelinks);

  let linkslist = Object.values(dictTmpLinks);

  console.log("links:", linkslist);

  var nodosSS = nodosSesion.map((d) => {
    d.id = d.idnombre;
    //d.index = d.idnombre

    let nodo = {
      id: d.idnombre,
    };
    return d;
  });

  console.log(nodosSS);

  var linkss = linkslist.map((d) => {
    d.names = [d.source, d.target];

    var link = {
      source: d.source,
      target: d.target,
      names: d.names,
      value: d.value,
    };
    return link;
  });

  console.log(linkss);

  let graph = {
    nodes: nodosSS,
    links: linkss,
  };

  const { nodes, links } = sankey({
    nodes: graph.nodes.map((d) => Object.assign({}, d)),
    links: graph.links.map((d) => Object.assign({}, d)),
  });
  console.log(nodes, links);

  gsets.selectAll("g").remove();

  gsets
    .append("g")
    .attr("id", "rectF")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("fill", (d) => {
      console.log("fill");
      if (d.codpartido) return color(d.codpartido, "partidos");
      else return "black";
      //d.codpartido ? color(d.codpartido, 'partidos') : "black"
    })
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .append("title")
    .text((d) => `${d.nombre}\n${d.value.toLocaleString()}`);

  gsets
    .append("g")
    .attr("id", "linksf")
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => {
      var _color = color(d.source, "voto");
      console.log(_color);
      return color(d.source, "voto");
    })
    .attr("stroke-width", (d) => d.width / 2)
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text((d) => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);

  gsets
    .append("g")
    .attr("id", "namesf")
    .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.nombre)
    .append("tspan")
    .attr("fill-opacity", 0.7)
    .text((d) => ` ${d.value.toLocaleString()}`);
}

function idnode(d) {
  //console.log("ID:", d)
  return d.id;
}

function sortNodesData(nodosInit) {
  //nodosInit = nodosInit.sort((a, b) => b.nombre > a.nombre ? -1 : 1)
  nodosInit = nodosInit.sort((a, b) => {
    // Sort by votes
    // If the first item has a higher number, move it down
    // If the first item has a lower number, move it up
    if (dictTmp[a.voto] > dictTmp[b.voto]) return 1;
    if (dictTmp[a.voto] < dictTmp[b.voto]) return -1;

    // If the votes number is the same between both items, sort alphabetically
    // If the first item comes first in the alphabet, move it up
    // Otherwise move it down
    if (a.codpartido > b.codpartido) return 1;
    if (a.codpartido < b.codpartido) return -1;
  });
  console.log("sorted nodes:", nodosInit);
}

function getFirstGroupNodes(keys) {
  let nodos = {};
  let firstSesion = sesiones[keys[0]];
  let nodosSesion = firstSesion.nodes;

  for (let i = 0; i < nodosSesion.length; i++) {
    let _asamb = nodosSesion[i];
    if (entidades[_asamb.id]) {
      nodos[_asamb.id] = asambleistas[_asamb.id];
      nodos[_asamb.id].voto = codeVotes[_asamb.voto];
      nodos[_asamb.id].curul = _asamb.curul;
      nodos[_asamb.id].visitado = true;
    }
  }

  let newnodes = Object.values(nodos);
  console.log("Nodos primera sesion: ", newnodes);
  return newnodes;
}

function generateData() {
  LOGPS && console.log("keys ids:", sesidsP);
  LOGPS && console.log("keys entidades:", entidadesKeys);

  let newkeys = sliceDictKeys(sesidsP);
  LOGPS && console.log("keys to loop:", newkeys);
  newkeys.push(currentSes.toString());
  LOGPS && console.log("Total:", newkeys);

  //let nodosInit = Object.values(entidades)
  let nodosInit = getFirstGroupNodes(newkeys);
  let linksU = [];

  nodosInit = nodosInit.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

  LOGPS && console.log("Nodos iniciales:", nodosInit);

  nodosInit = nodosInit.sort((a, b) => {
    if (a.codpartido && b.codpartido && a.voto && b.voto) {
      if (a.codpartido.localeCompare(b.codpartido) == 0) {
        return dictTmp[a.voto] - dictTmp[b.voto]; //a.voto.localeCompare(b.voto)
      } else {
        return a.codpartido.localeCompare(b.codpartido);
      }
    }
  });

  //sortNodesData(nodosInit)

  if (sesidsP.length == 1) {
    /**conseguir la info */
    LOGPS && console.log("Solo una sesion");
    let votesNodes = addVotesNodes(currentSes);
    nodosInit = [...nodosInit, ...votesNodes];
    console.log("merge:", nodosInit);
    linksU = loopSescode(sesiones[newkeys[0]]);

    /**mapeo */
    let graph = {
      nodes: nodosInit,
      links: linksU,
    };

    const { nodes, links } = sankey({
      nodes: graph.nodes.map((d) => Object.assign({}, d)),
      links: graph.links.map((d) => Object.assign({}, d)),
    });

    /**Dibujar */
    drawLayoutSet(nodes, links);
  } else if (sesidsP.length > 1) {
    LOGPS && console.log("Muchas sesion");
    firstid = newkeys[0];
    lastid = firstid;
    for (let k = 0; k < newkeys.length; k++) {
      resetVotos();
      let sesid = newkeys[k];

      let newLinks = loopSescode2(sesiones[sesid]);
      linksU = [...linksU, ...newLinks];
      console.log("merge Links:", linksU);
      lastid = sesid;
      console.log("votos usados:", votosEnSesion);

      let votesNodes = addVotesNodes(sesid);
      nodosInit = [...nodosInit, ...votesNodes];
      console.log("merge NODES:", nodosInit);
    }

    //sortNodesData(nodosInit)
    /**mapeo */
    let graph = {
      nodes: nodosInit,
      links: linksU,
    };

    let { nodes, links } = sankey({
      nodes: graph.nodes.map((d) => Object.assign({}, d)),
      links: graph.links.map((d) => Object.assign({}, d)),
    });

    //nodes = nodosInit.map(d => {
    //  console.log('SORT: ', d)
    //  if(d.targetLinks && d.sourceLinks)
    //    if (d.sourceLinks.length > 0 || d.targetLinks.length > 0)
    //    return d
    // })

    /**Dibujar */
    drawLayoutSet(nodes, links);
  }
}

function addVotesNodes(sesId) {
  let votesN = ["si", "abstencion", "blanco", "ausente", "no"];
  //let votesN = ["si", "no", "blanco", "ausente","abstencion"]
  let newnodes = votesN.filter((d) => votosEnSesion[d] == 1);

  let newNodes = newnodes.map((d) => {
    let nodo = {
      id: d + sesId,
      nombre: d, // + "(v" + sesId +")",
      voto: d,
      sesId: sesId,
    };
    return nodo;
  });

  console.log("new nodes for ses: ", sesId, newNodes);
  return newNodes;
}

function loopSescode2(sesion) {
  console.log(sesion);
  let links = [];
  let nodosSesion = sesion.nodes;

  for (let i = 0; i < nodosSesion.length; i++) {
    let _asamb = nodosSesion[i];
    if (entidades[_asamb.id]) {
      let source;

      votosEnSesion[codeVotes[_asamb.voto]] = 1;

      if (firstid == sesion.sesId) {
        entidades[_asamb.id].lastvote = codeVotes[_asamb.voto];
        entidades[_asamb.id].voto = codeVotes[_asamb.voto];
        source = entidades[_asamb.id].id;
      } else {
        entidades[_asamb.id].lastvote = entidades[_asamb.id].voto;
        entidades[_asamb.id].voto = codeVotes[_asamb.voto];
        source = entidades[_asamb.id].lastvote + lastid;
      }
      entidades[_asamb.id].curul = _asamb.curul;

      let target = entidades[_asamb.id].voto + sesion.sesId;
      let link = {
        source: source,
        target: target,
        names: [source, target],
        value: 1,
        codpartido: entidades[_asamb.id].codpartido,
        voto: entidades[_asamb.id].voto,
        id: "l" + entidades[_asamb.id].numeroId + sesion.sesId,
        asambid: "l" + entidades[_asamb.id].numeroId,
        nombreA1: entidades[_asamb.id].nombre,
        codeid:
          "link" +
          entidades[_asamb.id].numeroId +
          entidades[_asamb.id].voto +
          sesion.sesId,
      };
      links.push(link);
    }
  }

  console.log("links Generados:", links);

  links = links.sort((a, b) =>
    a.codpartido > b.codpartido
      ? 1
      : b.codpartido > a.codpartido
      ? -1
      : a.nombreA1.localeCompare(b.nombreA1)
  );

  return links;
}

function loopSescode(sesion) {
  console.log(sesion);
  let links = [];
  let nodosSesion = sesion.nodes;
  for (let i = 0; i < nodosSesion.length; i++) {
    let _asamb = nodosSesion[i];
    if (entidades[_asamb.id]) {
      entidades[_asamb.id].voto = codeVotes[_asamb.voto];
      entidades[_asamb.id].curul = _asamb.curul;

      let source = entidades[_asamb.id].id;
      let target = entidades[_asamb.id].voto + sesion.sesId;
      let link = {
        source: source,
        target: target,
        names: [source, target],
        value: 1,
      };
      links.push(link);
    }
  }

  console.log("links Generados:", links);
  return links;
}

function drawLayoutSet(nodes, links) {
  console.log("inside layout");
  console.log("Nodos:", nodes);
  console.log("Links:", links);
  //links.map(d => {
  //  console.log("sort:", d.codpartido, d.voto)
  //})

  //gsets.selectAll('g').remove()

  rectsF = rectsF.data(nodes).join(
    (enter) =>
      enter
        .append("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => {
          //return d.y0
          if (d.codpartido) {
            return d.y0 + (d.y1 - d.y0) / 4;
          } else {
            return d.y0;
          }
        })
        .attr("height", (d) => {
          var _value = d.y1 - d.y0;
          if (d.codpartido) {
            //console.log("Es legislador", d, _value);
            _value = (d.y1 - d.y0) / 2;
          }
          return _value;
        })
        .attr("width", (d) => {
          if (d.codpartido) return 0;
          else return d.x1 - d.x0;
        })
        .attr("opacity", 0)
        .call((enter) =>
          enter
            .transition()
            .duration(durationRect)
            .delay(durationRect)
            .attr("opacity", 1)
            .attr("fill", (d) => {
              console.log("enter rects", d.voto);
              if (d.codpartido) return color(d, "partidos");
              else {
                var _color = color(d, "voto");
                if (d.voto == "blanco") _color = "#c8c8c8";
                return _color;
              }
            })
        )
        .call((enter) =>
          enter
            .append("title")
            .text((d) => `${d.nombre}\n${d.value.toLocaleString()}`)
        ),
    (update) =>
      update
        .transition()
        .duration(durationRect)
        .attr("x", (d) => d.x0)
        .attr("y", (d) => {
          {
            if (d.codpartido) {
              return d.y0 + (d.y1 - d.y0) / 4;
            } else {
              return d.y0;
            }
          }
        })
        .attr("fill", (d) => {
          console.log("udpate rects");
          if (d.codpartido) return color(d, "partidos");
          else {
            var _color = color(d, "voto");
            if (_color == "#ffffff") _color = "#c8c8c8";
            return _color;
          }
          //d.codpartido ? color(d.codpartido, 'partidos') : "black"
        })
        .attr("height", (d) => {
          var _value = d.y1 - d.y0;
          if (d.codpartido) {
            //console.log("Es legislador", d, _value)
            _value = (d.y1 - d.y0) / 2;
          }
          return _value;
        })
        .attr("width", (d) => d.x1 - d.x0)
        .call((update) =>
          update
            .select("title")
            .text((d) => `${d.nombre}\n${d.value.toLocaleString()}`)
        ),
    (exit) => exit.remove()
  );

  //d3.select("#linksf").selectAll("path").remove()

  //gsets.append("g")
  //    .attr("id", "linksf")
  //    .attr("fill", "none")
  //  .selectAll("g")
  //linksf
  //  .data(links)
  //  .join("path")
  //    .attr("d", d3.sankeyLinkHorizontal())
  //    .attr("stroke", d => {
  //      console.log("enter path", d);
  //      var _color = color(d, "partidos");
  //      console.log(_color);
  //      //if (_color == "#ffffff") _color = "#c8c8c8";
  //      return _color;
  //    })
  //    .attr("stroke-width", d => d.width)
  //    .style("mix-blend-mode", "multiply")
  //  .append("title")
  //    .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);

  console.log("PATHS:", linksf);

  //var cell = d3.select("linksf").selectAll("path").data(links, function (d) {
  //  return d.codeid;
  //})
  //console.log("CELL:", cell)

  linksf = linksf
    .data(links, (d) => {
      //console.log("d", d);
      return d.id;
    })
    //cell = cell
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("id", (d) => d.codeid)
          .attr("class", (d) => d.asambid)
          .attr("stroke", (d) => {
            console.log("enter path", d.id);
            var _color = color(d, "partidos");
            //console.log(_color);
            return _color;
          })
          .attr("stroke-width", (d) => d.width / 3)
          .attr("opacity", 0)
          .style("mix-blend-mode", "multiply")
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .delay(durationRect)
              .attr("opacity", 1)
              .attr("d", d3.sankeyLinkHorizontal())
          )
          .call((enter) =>
            enter
              .append("title")
              .text(
                (d) => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`
              )
          ),
      (update) =>
        update
          //.attr("id", (d) => d.codeid)
          .attr("class", (d) => d.asambid)
          .attr("stroke", (d) => {
            console.log("udpate path", d.id);
            var _color = color(d, "partidos");
            //console.log(_color);
            return _color;
          })
          .attr("stroke-width", (d) => d.width / 3)
          .style("mix-blend-mode", "multiply")
          .transition()
          .duration(durationRect)
          .attr("d", d3.sankeyLinkHorizontal())
          .call((update) =>
            update
              .select("title")
              .text(
                (d) => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`
              )
          ),
      (exit) =>
        exit
          .transition()
          .duration(durationRect)
          .style("opacity", (d) => {
            console.log("eliminar", d.id);
            return 0;
          })
          .remove()
    );

  namesf = namesf.data(nodes).join(
    (enter) =>
      enter
        .append("text")
        .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) =>
          d.codpartido ? "end" : d.x0 < width / 2 ? "start" : "end"
        )
        .text((d) => {
          console.log("enter text");
          if (d.sourceLinks.length > 0 || d.targetLinks.length > 0)
            return d.nombre;
        })
        .call(wrap),
    //.call((enter) =>
    //  enter.append("tspan").text((d) => {
    //    if (d.sourceLinks.length > 0 || d.targetLinks.length > 0)
    //      return ` (${d.value.toLocaleString()})`;
    //  })
    //),
    (update) =>
      update
        .transition()
        .duration(durationRect)
        .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) =>
          d.codpartido ? "end" : d.x0 < width / 2 ? "start" : "end"
        )
        .text((d) => {
          console.log("update text");
          if (d.sourceLinks.length > 0 || d.targetLinks.length > 0)
            return d.nombre;
        })
        .call(wrap),
    //.call((update) =>
    //  update.select("tspan").text((d) => {
    //    //console.log("update Tspan:", d.value, update.select("tspan"));
    //    if (d.sourceLinks.length > 0 || d.targetLinks.length > 0)
    //      return ` (${d.value.toLocaleString()})`;
    //  })
    //),
    (exit) => exit.remove()
  );

  let nodosVotes = nodes.filter((d) => d.sesId && d.y0 >= 5 && d.y0 <= 38);
  console.log("filtrados:", nodosVotes);

  votosf = votosf.data(nodosVotes).join(
    (enter) =>
      enter
        .append("text")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => -5)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) => "start")
        .text((d) => "v" + d.sesId),
    (update) =>
      update
        .transition()
        .duration(durationRect)
        .attr("x", (d) => d.x0)
        .attr("y", (d) => -5)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) => "start")
        .text((d) => "v" + d.sesId),
    (exit) => exit.remove()
  );
}

function wrap(text) {
  text.each(function () {
    let text = d3.select(this);
    let word = text.text();
    var index = word.indexOf(" ", word.indexOf(" ") + 1);
    var firstChunk = word.substr(0, index);
    var secondChunk = " " + word.substr(index + 1);
    //console.log(text)
    //console.log(text._groups[0], text._groups[0][0].textContent)
    //console.log(word)
    //console.log('1: ', firstChunk)
    //console.log('2: ', secondChunk)
    x = text.attr("x");
    y = text.attr("y") - 20;
    if (firstChunk) {
      text.text(null);
      var tspan = text
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .text(firstChunk);
      var tspan1 = text
        .append("tspan")
        .attr("x", x)
        .attr("y", y + 15)
        .text(secondChunk);
    }
  });
}
  