const widthCard5 = document.getElementsByClassName('five')[0];

var marginx = { top: 200, right: 40, bottom: 200, left: 40 };
const width1 = parseInt(widthCard5.clientWidth);
const height2 = 52;

console.log(widthCard5);
console.log(widthCard5.clientWidth);

let svgTl = d3
  .select('#pointTimeline')
  .append('svg')
  .attr('width', width1)
  .attr('height', height2 + marginx.left +30)

let gmain = svgTl.append('g')
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

let xDom;
let xBand;
let dataTls;
let brushTl; //= d3.brushX(xDom).on("brush", brushed)
let xAxis2;
let hasSelectArea = false;
let xDom2;

function getDomTl() {
  dataTls = [];

  if (organismoOp == 1) {
    dataTls = Object.values(sesiones);
  } else if (organismoOp == 2) {
    dataTls = Object.values(unResolutions);
  }

  dataTls.map((item) => {
    let fecha = item.fecha.split('-');
    let hora = item.hora ? item.hora.split(':') : '';
    let dateTl = startDateSelec(fecha, hora);

    item.date = dateTl;
  });

  xDom = d3
    .scaleTime()
    .range([0, width1])
    .domain(d3.extent(dataTls.map((item) => item.date)));

  xBand = d3
    .scaleBand()
    .domain(
      dataTls.map((d) => {
        return d.date;
      })
    )
    .range([0, width1])
    .padding(0.3);
  console.log('XBAND', xBand.bandwidth());
}

function createBarsTl() {
  let subBars = gmain.selectAll('.subBar').data(dataTls);
  console.log('create subbars', dataTls);

  subBars
    .enter()
    .append('rect')
    .classed('subBar', true)
    .attr('height', height2 + marginx.left)
    .attr('width', (d) => xBand.bandwidth())
    .attr('x', (d) => {
      //console.log(d)
      return xDom(d.date);
    })
    .attr('y', (d) => 0);
}

function brushstart() {
  console.log('Brushed start');

  if(hasSelectArea){
    hasSelectArea = false;
    selectArea.detach();
  }

  selectArea.create(d3.event.sourceEvent)
  selectArea.attach(true);
  hasSelectArea = true
  //create
}

function brushed() {
  //console.log('Brushed');
  //console.log( d3.event)
  //console.log( d3.event.sourceEvent)
  //console.log( d3.mouse(this))
  
  //var bbox = document.getElementsByClassName('selection')[0];
  //console.log("BBOX", bbox, bbox.getBBox())
  //console.log(bbox.getBoundingClientRect())

  selectArea.update()

  let extent = d3.event.selection.map(xDom.invert, xDom);
  getSessionsInRange(extent)
}

function brushended() {
  console.log('Brushed END');
  //let extent = d3.event.selection.map(xDom.invert, xDom);
  //console.log('extent', extent)
  //getSessionsInRange(extent)
}

function startShortTl() {
  getDomTl();
  createBarsTl();

  xAxis2 = d3.axisBottom(xDom)
  //svgTl.call(xAxis2)

  svgTl.append("g")
  .attr("class", "x-axis")
  .attr("transform",  `translate(0,${height2 + marginx.left})`)
  .call(xAxis2);

  brushTl = d3
    .brushX(xDom)
    .on('start', brushstart)
    .on('brush', brushed)
    .on('end', brushended)
   

  svgTl.call(brushTl);

  //zoomTl()

}


function zoomTl() {
  //const extent = [xDom.invert, xDom]
  const extent = d3.extent(dataTls.map((item) => item.date));
  console.log(xDom.range())
  xDom2 = d3.scaleTime().range([0, width1]).domain(xDom.domain());

  xAxis2 = d3.axisBottom(xDom2);

  svgTl.call(
    d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', zoomed)
  );
}

function zoomed() {
  console.log('zoomed');
  console.log(d3.event);
  xDom.range(
    xDom.range().map((d) => {
      console.log(d);
      console.log(d3.event);
      //d3.event.transform.x = d3.event.sourceEvent.x;
      console.log(d3.event.transform);
      console.log(d3.event.transform.applyX(d3.event.sourceEvent.x));
      return d3.event.transform.applyX(d);
    })
  );
  xBand.range(
    xBand.range().map((d) => {
      //d3.event.transform.x = d3.event.sourceEvent.x;
      return d3.event.transform.applyX(d);
    })
  );

  gmain
    .selectAll('.subBar')
    .attr('x', (d) => {
      //console.log((d.date), xDom2(d.date))
      return xDom(d.date);
    })
    .attr('width', xBand.bandwidth());
  gmain.selectAll('.x-axis').call(xAxis2);
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