const widthCard5 = document.getElementsByClassName("five")[0];

var marginTl = { top: 20, right: 0, bottom: 30, left: 20 };
const widthTl = parseInt(widthCard5.clientWidth);
const heightTl = 22;

console.log(widthCard5);
console.log(widthCard5.clientWidth);

let svgTl = d3
  .select("#pointTimeline")
  .append("svg")
  .attr("width", widthTl)
  //.attr("height", heightTl);
  .attr("height", heightTl + marginTl.left +20);

let gmain = svgTl
  .append("g")
  .attr("transform", "translate(" + 0 + "," + 0 + ")");

let xDom; //Dominio con escala en el tiempo
let xDomTmp; 
let xBand; 
let dataTls; //datos segun dataset
let brushTl; // objeto brush
let xAxis;
let gx; //contenedor de los x-axis
let zoomTl2; // objeto zoom
let hasSelectArea = false; // hay un brush creado
let hasZoomed = false; // has hecho zoom
let selection; //Brush selection
let hasbrush = false;

function startShortTl() {
  getDomTl();
  createBarsTl();
  createZoom();
  //createBrush();
  updateDatesR(xDom.domain())
}

function getDomTl() {
  dataTls = [];
  if (organismoOp == 1) {
    dataTls = Object.values(sesiones);
  } else if (organismoOp == 2) {
    dataTls = Object.values(unResolutions);
  }

  dataTls.map((item) => {
    let fecha = item.fecha.split("-");
    let hora = item.hora ? item.hora.split(":") : "";
    let dateTl = startDateSelec(fecha, hora);
    item.date = dateTl;
  });

  xDom = d3
    .scaleTime()
    .domain(d3.extent(dataTls.map((item) => item.date)))
    .range([0, widthTl]);

  //console.log(xDom.domain())
  
  xBand = d3
    .scaleBand()
    .domain(
      dataTls.map((d) => {
        return d.date;
      })
    )
    .range([0, widthTl])
    .padding(0.3);
  //console.log("XBAND", xBand.bandwidth());
}

function createBarsTl() {
  let subBars = gmain.selectAll(".subBar").data(dataTls);
  //console.log("create subbars", dataTls);

  subBars
    .enter()
    .append("rect")
    .classed("subBar", true)
    .attr("height", heightTl + marginTl.top)
    .attr("width", xBand.bandwidth())
    .attr("x", (d) => {
      //console.log(d)
      return xDom(d.date);
    })
    //.attr("opacity", 0.3)
    .attr("y", (d) => 0);
}

function createBrush() {
  //console.log("CREATE BRUSH");
  brushTl = d3
    .brushX(xDom)
    .on("start", brushstart)
    .on("brush", brushed)
    .on("end", brushended);

  svgTl.append("g").attr("class", "brush").call(brushTl);
}

function brushstart() {
  console.log("Brushed start");
  if (hasSelectArea) {
    hasSelectArea = false;
    selectArea.detach();
  }
  selectArea.create(d3.event.sourceEvent);
  selectArea.attach(true);
  hasSelectArea = true;
}

function brushed() {
 // console.log(d3.event.selection)
  selectArea.update();
  let extent;

  if (hasZoomed) {
     // console.log("Zoomed flag")
    extent = d3.event.selection.map(xDomTmp.invert, xDomTmp);
  } else {
    extent = d3.event.selection.map(xDom.invert, xDom);
  }
  selection = d3.event.selection
  //let extent = d3.event.selection.map(xDom.invert, xDom);
  //console.log("Brush", extent);
  getSessionsInRange(extent);
}

function brushended() {
  //console.log("Brushed END");
}

function createZoom() {
  xAxis = d3
    .axisBottom(xDom)
    .ticks(widthTl / 80)
    .tickSizeOuter(0);

  gx = svgTl
    .append("g")
    .attr("class", "x-axis")
    //.attr("transform", `translate(0,${heightTl + marginTl.left})`)
    .attr("transform", `translate(0,${heightTl + marginTl.left})`)
    .call(xAxis);

  const extent = d3.extent(dataTls.map((item) => item.date));
  //console.log(xDom.range());
  //console.log(extent);

  let z = [
    [marginTl.left, marginTl.top],
    [widthTl - marginTl.right, heightTl - marginTl.top],
  ];
  //console.log(z);

  zoomTl2 = d3
    .zoom()
    .scaleExtent([1, 60])
    .translateExtent(z)
    .extent(z)
    .on("zoom", zoomed);

  svgTl
    .call(zoomTl2)
    //.on("mousedown.zoom", null)
    //.on("touchstart.zoom", null)
    //.on("touchmove.zoom", null)
    //.on("touchend.zoom", null);
}

function zoomed() {
  //console.log("zoomed", d3.event.transform);
  const xz = d3.event.transform.rescaleX(xDom);
  gmain
    .selectAll(".subBar")
    .attr("x", (d) => {
      return xz(d.date);
    })
    .attr("width", xBand.bandwidth());

  //console.log(gx);
  gx.call(
    d3
      .axisBottom(xz)
      .ticks(widthTl / 80)
      .tickSizeOuter(0)
  );

  //console.log("xz", xz.domain());
  //console.log("xz", xz.range());

  var range = xDom.range().map(d3.event.transform.invertX, d3.event.transform);
  //console.log(range);
  let extent = range.map(xDom.invert, xDom);
  //console.log(extent);
  //xDom.range(range)
  //xDom.domain(extent)
  xDomTmp = xz;
  //console.log(xDomTmp.domain());
  updateDatesR(extent);
  hasZoomed = true
  
  validateBrush()
}

function getSessionsInRange(dates) {
  let filterDates = dataTls.filter(
    (sess) => sess.date >= dates[0] && sess.date <= dates[1]
  );
  //console.log(filterDates);
  listaResultados.innerHTML = "";
  outputVotes(filterDates);
  dictIds["yVotos"] = filterDates;
}

function updateDatesR(dates) {
  startDate.update(dates[0]);
  endDate.update(dates[1]);
  //$(".input-daterange").datepicker("update", dates);
}

function validateBrush() {
  if (hasSelectArea) {
    d3.select(".brush").remove();
    selectArea.detach();
    //svgTl.call(brushTl.move, [0,0]);
    //svgTl.call(brushTl.move, selection);
  }
}

//cuando seleccione los inputs de las fechas
function oninputDates(values) {
  if (values.length == 2) {
    console.log(values);
    //svgTl.call(zoomTl2.scaleBy, 1.3)

    var range = [xDom(values[0]), xDom(values[1])];
    let domain = range.map(xDom.invert, xDom);
    const xz = xDom.copy().domain(domain);

    svgTl.call(zoomTl2.scaleBy, widthTl / (range[1] - range[0]));
    updateDatesR(values)

    //datesRange = {};
    //console.log(datesRange);

    //gmain
    //  .selectAll(".subBar").transition().duration(200)
    //  .attr("x", (d) => {
    //    //console.log(d)
    //    return xz(d.date);
    //  })
    //  .attr("width", xBand.bandwidth());
    //
    //gx.call(
    //    d3
    //      .axisBottom(xz)
    //      .ticks(widthTl / 80)
    //      .tickSizeOuter(0)
    //  );
    //
    //
    ////svgTl.call(zoomTl2)
    //svgTl.call(zoomTl2.scaleBy, 1.3)
    ////.call(zoom.scaleBy, zoomLevel);
  }
}


/**
 * const canvas = document.getElementById('canvas')

canvas.addEventListener('keydown', function(e){
    console.log(e)
})

canvas.addEventListener('keyup', function(e){
    console.log(e)
})

$(canvas).keydown(function(e) {
    if(e.key == "Shift"){
       console.log("canvas SHIFT press")
       //shiftPressed = true
     }
  }).keyup(function(e) {
    if (e.key == "Shift") { 
      console.log(" canvas SHIFT up")
     // shiftPressed = false;
    }
  });
 */