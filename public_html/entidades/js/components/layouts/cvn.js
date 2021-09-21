/**
 * cvn.js
 * Grafico para dibujar las cvns junto con sus funciones [Update]
 */

 var LOGCV = false

 LOGCV && console.log("Tam:", width)
 
 let nodosU = []
 let linksU = []
 
 //Storage para la data generada en los links cvns
 let dictLinks = {}
 
 let dictValues = {}
 
 let simulation =
         d3.forceSimulation()
         .alphaDecay(0.05)
         .force("center", d3.forceCenter(width / 2, height / 2).strength(0.001))
         .force("charge", d3.forceManyBody().strength(-850))
         .force("link", d3.forceLink().id(d => d.id).distance(100))
         .force("x", d3.forceX(width / 2).strength(0.75))
         .force("y", d3.forceY(height / 2).strength(0.75))


simulation.on("tick", () => {
  if (simulation.alpha() < 0.45) {
    circles
      //.attr("cx", d => d.x)
      //.attr("cy", d => d.y)
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

    texts
      //.attr('x', d => d.x)
      //.attr('y', d => d.y + 20)
      .attr("transform", (d) => "translate(" + d.x + "," + (d.y + 20) + ")");

    links
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }
});


let links = svg
  .append("g")
  .attr("id", "links")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.5)
  .attr("transform", "translate(0,0)")
  .selectAll("line");

let nodosCvn;
let tickDuration = 100;

let firstCodeLink = 0;
let nodosAcumuladosFlag = false;

let nodosTotal = [];

/**escalas */
let scaleOpacity;
let scaleWidth;

/**Guardar valores anteriores */
let valoresCvns = {};

function updateCvn() {
  LOGCV && console.log("Sesion Actual:", currentSes);
  LOGCV && console.log("Nodos actuales:", nodes);
  //var elements = svg.selectAll(".rect").data(nodes, function (d) {return d.id})
  //console.log("Elementos actuales en el canvas:", elements)
  let genlace = gEnlaces[currentSes];

  let newnodos = updateSesion(sesiones[currentSes]);
  //nodosCvn = createNodes(newnodos, groups)
  const nodosCvn = createNodesForCvn(newnodos, groups);

  nodosTotal = [];
  let total = Object.values(entidades);
  //nodosTotal = createNodes(total, groups)
  nodosTotal = createNodesForCvn(total, groups);

  links.style("opacity", "1");

  if (!flagEmptyChart) wrangleData(nodosTotal, genlace, currentSes);
}

function wrangleData(data, grupoEnlaces, sesId) {
  let nodosSesion = data; // data.nodes pasa los nodos de las sesion y sus votos
  let linksSesion = grupoEnlaces.links; //data.links

  LOGCV && console.log("Nodos sesion:", nodosSesion);
  LOGCV && console.log("Links sesion:", linksSesion);
  LOGCV && console.log("Entidades en el svg:", entidades);

  let newnodes = [];
  newnodes = [...nodosSesion];

  let newLinks = [];

  //if(!dictLinks[sesId]){
  let _codelinks = createLinksCodesSesions(nodosSesion, linksSesion);
  newLinks = getLinks(_codelinks);

  LOGCV && console.log("Diccionario de enlaces:", dictLinks);

  d3.select("#links").attr("transform", "translate(0,0) scale(1)");

  updateChartCvn(newnodes, newLinks);
  //console.log('links asam', newlinks2)
}

function updateChartCvn(newnodes, newlinks) {
  LOGCV && console.log("nodos en ses:", newnodes);
  LOGCV && console.log("enlaces en ses:", newlinks);
  const validLinks = newlinks.map((d) => Object.create(d));


  const validNodes = newnodes;

  console.log(validNodes);
  console.log(validLinks);



  circles = circles
    .data(validNodes, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "nodeCircle")
          .attr("r", circleRadius)
          .call((enter) =>
            enter
              .transition()
              .duration(durationRect)
              .attr("fill", (d) => {
                if (d.suplente) {
                  return "#fff";
                } else {
                  LOGCV && console.log("color:", color(d, colorMap));
                  return color(d, colorMap);
                }
              })
              .attr("class", (d) => {
                if (d.suplente) {
                  return "sup";
                } else return "normal";
              })
              .attr("stroke-width", (d) => (d.labelFlag ? 3.0 : 1))
          ),
      (update) =>
        update
          .transition()
          .duration(durationRect)
          .attr("r", circleRadius)
          .attr("stroke-width", (d) => (d.labelFlag ? 3.0 : 1))
          .attr("stroke", (d) => {
            var _color = color(d, colorMap);
            return d3.rgb(_color).darker(1);
          })
          .attr("fill", (d) => {
            LOGCV && console.log("update");
            console.log("UPDATE:");
            return color(d, colorMap);
          }),
      (exit) =>
        exit
          .transition()
          .duration(durationRect)
          .style("opacity", () => {
            LOGCV && console.log("eliminar cvn");
            return 0;
          })
          .remove()
    );

  //console.log("Ele LINKS:", links)

  texts = texts
    .data(validNodes, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("visibility", "visible")
          .attr("class", "labeltext")
          //                        .attr('id', d => 'text' + d.numeroid)
          .text((d) => getNameAsamb(d))
          //.attr('x', d=> getposX(d))
          //.attr('y', d => d.y +20)
          .attr("text-anchor", "middle")
          .attr("opacity", 1),
      (update) =>
        update
          //                        .attr('id', d => 'text' + d.numeroid)
          .text((d) => getNameAsamb(d))

          .attr("text-anchor", "middle")
          //.attr('x', d=> getposX(d))
          //.attr('y', d => d.y +20)
          .attr("opacity", 1),
      (exit) => exit.remove()
    );

  links = links.data(validLinks).join(
    (enter) =>
      enter
        .append("line")
        .attr("class", "links")
        //.style("opacity", 0.6)
        .attr("stroke-width", (d) => {
          let value = scaleWidth(d.value);
          return value;
        })
        .attr("opacity", (d) => {
          //Math.sqrt(d.value)
          let value = scaleOpacity(d.value);
          //console.log(d.value, value)
          return value;
        }),
    (update) =>
      update //.transition().delay(100).duration(50)
        .attr("stroke-width", (d) => {
          let value = scaleWidth(d.value);
          return value;
        })
        .attr("opacity", (d) => {
          //Math.sqrt(d.value)
          let value = scaleOpacity(d.value);
          //console.log(d.value, value)
          return value;
        }),
    (exit) => exit.remove()
  );



  simulation.nodes(validNodes, (d) => d.id);
  simulation.force(
    "link",
    d3.forceLink(validLinks).id((d) => d.idnombre)
  );
  simulation.alpha(1).restart();

  var bbox = links.node().getBBox(),
    middleX = bbox.x + bbox.width / 2,
    middleY = bbox.y + bbox.height / 2;

  console.log("BBOX:", bbox, middleX, middleY);


  var group = document.getElementById("group");
  group.parentNode.appendChild(group);


  LOGCV && console.log("Ele LINKS:", links);
}

//Crear links de acuerdo a la sesion,
function createLinksCodesSesions(nodosSesion, linksSesion) {
  let filtroLinks1 = [];
  let filtroLinks2 = [];

  //verificacion de nodos para los links
  for (let i = 0; i < nodosSesion.length; i++) {
    let _asamb = nodosSesion[i];

    let linksofAsamb = linksSesion[_asamb.numeroid];
    if (linksofAsamb != null) {
      //console.log("Info links", linksofAsamb)
      filtroLinks1.push(linksofAsamb);
      for (var key in linksofAsamb) {
        //console.log(key, dictionary[key])
        let valueLink = linksofAsamb[key];
        //LOGCV && console.log("key:", key)
        if (entidades[key]) {
          //LOGCV && console.log("pertenece: ", key, "Value:", valueLink, "Asamb:", entidades[key])
          filtroLinks2.push(valueLink);
        }
      }
    }
  }



  return filtroLinks2;
}

/**Obtenemos los enlaces respectivos a traves de sus codigos y lo agregamos al dictionario general */
function getLinks(codelinks) {
  let newlinks = [];
  let dictTmpLinks = {};

  if (!dictLinks[currentSes]) dictLinks[currentSes] = {};

  LOGCV && console.log(dictLinks);
  let dictKeys = Object.keys(dictLinks);
  LOGCV && console.log("Current Keys:", dictKeys);
  LOGCV && console.log("CurrentSes:", currentSes);

  LOGCV && console.log(codelinks);

  let sliceKeys = sliceDictKeys(dictKeys);

  if (dictKeys.length == 1) {
    LOGCV &&
      console.log("solo hay una sesion por ahora, es la primera entonces");
    dictTmpLinks = loopCodeLinks(codelinks);
    LOGCV && console.log("current dict:", dictTmpLinks);
    let list = Object.values(dictTmpLinks);
    LOGCV && console.log(list.length, list);
  } else if (dictKeys.length > 1) {
    console.log("hay mas");
    firstCodeLink = Object.keys(dictLinks)[0];

    if (firstCodeLink == currentSes) {
      nodosAcumuladosFlag = false;
      LOGCV &&
        console.log("La id de votacion actual es la primera, no acumular");
      dictTmpLinks = loopCodeLinks(codelinks);
    } else {
      LOGCV &&
        console.log("no es la primera sesion, reverse loop en el dictionario");
      dictTmpLinks = loopCodeLinks(codelinks);
      LOGCV && console.log("Sesion link actual:", currentSes, dictTmpLinks);

      nodosAcumuladosFlag = true;

      for (let k = sliceKeys.length - 1; k >= 0; k--) {
        let sesLinkId = sliceKeys[k];
        LOGCV && console.log("current key link sesion:", sesLinkId);
        let dictLinkSes = dictLinks[sesLinkId];

        let list = Object.values(dictLinkSes);
        LOGCV &&
          console.log(
            "Sesion Anterior:",
            sesLinkId,
            "Links:",
            list.length,
            list
          );
        //console.log("merge before:", dictTmpLinks)
        //dictTmpLinks = Object.assign({}, dictTmpLinks, dictLinkSes)
        dictTmpLinks = { ...dictLinkSes, ...dictTmpLinks };
        //console.log("merge after:", dictTmpLinks)

        /**Verificamos enlaces */
        for (let key in dictTmpLinks) {
          let link = dictTmpLinks[key];
          let id = link.id;
          let newid = sesLinkId + "s" + id;
          if (dictValues[newid] && !link.flag) {
            //console.log("id:", newid)
            //console.log("existe", dictValues[newid])
            link.value = dictValues[newid];
            link.flag = true;
          }
        }
      }
      //console.log("Links acumulados:", dictTmpLinks)
    }
  }

  //console.log("diccionario para la sesion :", currentSes, dictTmpLinks)
  dictLinks[currentSes] = dictTmpLinks;

  let listoflinks = [];
  listoflinks = Object.values(dictLinks[currentSes]);

  newlinks = [...listoflinks];

  //console.log("map Links:", newlinks)

  return newlinks;
}

function loopCodeLinks(codelinks, idses) {
  /**Iteramos los codigos de enlaces para obtener sus respectivos enlaces "fisicos" en formato adecuado*/
  let dictTmpLinks = {};
  for (let l = 0; l < codelinks.length; l++) {
    let id = codelinks[l];
    //console.log("ID", id)
    //console.log(enlaces[id])
    if (enlaces[id]) {
      enlaces[id].visitado = 1;
      enlaces[id].value = 1;
      let source = enlaces[id].source;
      let target = enlaces[id].target;

      let link = {
        source: source,
        target: target,
        value: enlaces[id].value,
        visitado: enlaces[id].visitado,
        id: enlaces[id].id,
        flag: false,
      };
      //let newId = idses + '' + id
      dictTmpLinks[id] = link;
    }
  }

  return dictTmpLinks;
}

function sliceDictKeys(keys) {
  let newkeys = [];
  let sesId = currentSes.toString();
  let index = keys.indexOf(sesId);
  LOGCV && console.log("slice test:", keys.slice(0, 1), keys.slice(0, index));
  LOGCV && console.log("index:", index);
  if (index !== -1) {
    LOGCV && console.log("slice");
    newkeys = keys.slice(0, index);
  }

  //newkeys = [... keys]
  LOGCV && console.log("nuevas keys cortadas:", newkeys);
  return newkeys;
}

//Calculamos todos los links
function getAllLinks() {
  console.log("calculo de cvns");
  let dictKeys = Object.keys(dictLinks);
  let firstID = dictKeys[0];
  LOGCV && console.log("Keys links id:", dictKeys);
  LOGCV && console.log("First ID:", firstID, dictLinks[firstID]);
  //nodosAcumuladosFlag = true
  let dictTmpLinks = {};
  let _total = Object.values(entidades);
  LOGCV && console.log("Entidades", entidades, "total:", _total);

  groups = _groups();
  let _genlace = gEnlaces[firstID];
  let _linksSesion = _genlace.links;
  let _nodosCvn = createNodes(_total, groups);

  let _codelinks = createLinksCodesSesions(_nodosCvn, _linksSesion);
  dictTmpLinks = loopCodeLinks(_codelinks, firstID);

  dictLinks[firstID] = dictTmpLinks;
  LOGCV && console.log("Primer conjunto de enlaces:", dictTmpLinks);

  let count = 1;

  for (let k = 1; k < dictKeys.length; k++) {
    let sesLinkId = dictKeys[k];
    LOGCV && console.log("current ses:", sesLinkId);
    //let dictLinkSes = dictLinks[sesLinkId]
    let _genlace = gEnlaces[sesLinkId];
    //let _nodosCvn = createNodes(_total, groups)
    let _linksSesion = _genlace.links; //data.links

    let _codelinks = createLinksCodesSesions(_nodosCvn, _linksSesion);
    let dictLinkSes = loopCodeLinks(_codelinks);

    let list = Object.values(dictLinkSes);
    LOGCV &&
      console.log("Sesion Anterior:", sesLinkId, "Links:", list.length, list);

    let actualDict = {};
    //dictTmpLinks = Object.assign({}, dictLinkSes, dictTmpLinks)
    actualDict = { ...dictLinkSes, ...dictTmpLinks };

    LOGCV && console.log("ID:", sesLinkId);
    count += 1;

    dictLinks[sesLinkId] = actualDict;
    calculateValues(actualDict, dictLinkSes, sesLinkId, count);

    dictTmpLinks = { ...actualDict };
    LOGCV && console.log("Conjunto agrupado de enlaces:", dictTmpLinks);
  }

  LOGCV && console.log("Nuevo dict:", dictLinks);
  LOGCV && console.log("Valuesdict:", dictValues);

  scaleOpacity = d3
    .scaleLinear()
    .domain([1, count]) // unit
    .range([0.1, 0.5]); // unit: value

  scaleWidth = d3
    .scaleLinear()
    .domain([1, count]) // unit
    .range([0.1, 2]); // unit: value
}

function calculateValues(dictTmpLinks, dictLinkSes, sesLinkId, count) {
  //let dictAcum = Object.assign({}, dictTmpLinks)
  //let dictAcum = { }
  LOGCV &&
    console.log("Acumulado:", Object.values(dictTmpLinks).length, dictTmpLinks);
  LOGCV &&
    console.log("Actual:", Object.values(dictLinkSes).length, dictLinkSes);
  for (let key in dictLinkSes) {
    let link = dictLinkSes[key];
    if (dictTmpLinks[link.id]) {
      LOGCV && console.log("existe");
      let newid = sesLinkId + "s" + key;
      dictValues[newid] = count;
    }
    //console.log("link:", link)
  }
  //console.log("VAlues:", Object.values(dictAcum).length ,dictAcum)
  //return dictAcum
}


function createNodesForCvn(nodos, groups) {
  let nodes = [];

  nodos.map(function (d, i) {
    groups[d.voto].cnt += 1;

    let nodeu = {
      id: "node" + d.numeroId,
      numeroid: d.numeroId,
      //x: (tmp + dictM[i].x),//Math.random() * (-10 - 60) + (-10),
      //y: groups[d.voto].y + dictM[i].y,
      //oldx: (tmp + dictM[i].x),//Math.random() * (-10 - 60) + (-10),
      //oldy: groups[d.voto].y + dictM[i].y,

      xOffset: d.xOffset,
      yOffset: d.yOffset,
      voto: d.voto,
      lastvoto: d.lastvote,
      group: d.voto,
      partido: d.partido,
      codpartido: d.codpartido,
      nombre: d.nombre,
      idnombre: d.id,
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

  return nodes;
}