/**Opciones del zoom general */


function zoomed() {

  var t = d3.zoomTransform(this);
  //console.log("Zoom",t)
  if(flagEmptyChart){
    circles.attr("transform", transformInit(t))
    texts.attr("transform", transformText(t))
  }
  else{
    if(currentOptChart=="3"){
      let offsetY = -120
      d3.select("#group").attr("transform", "translate(" + t.x + "," + (t.y + offsetY) + ") scale(" + t.k + ")" )
      //circles.attr("transform", transformCurules(t))
      //texts.attr("transform", transformTextCurules(t))
    }
    else if(currentOptChart=="1"){
      //d3.select("#g1").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#group").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#grpTexts").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      //d3.selectAll(".grp").attr("transform", transformGroups(t))
      
    }
    else if(currentOptChart=="2"){
      console.log("CVN")
      circles.attr("transform", transform(t))
      texts.attr("transform", transformText(t))
      d3.select("#links").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")")
    }
    else if(currentOptChart=="4"){
      //d3.select("#sets").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#rectf").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#linksf").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#namesf").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
      d3.select("#votosf").attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")" )
    }
  }
  //gsets.attr("transform", transformSets(t))
  //gsets.attr("transform",  "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")")
  //circles.attr("cx", (d) => d.x)
  //circles.attr("cy", (d) => d.y)
  //circles.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
  //rect.attr("transform", transform(d3.event.transform));
}


function transformSets(t){
  //console.log(t)
    return function(d) {
      var values = [(-width / 2 + 50) , (-height / 2 - 50)]
      //console.log(t.apply(values))
      //let string = gsets.attr("transform");
      //let translate = string.substring(string.indexOf("(")+1, string.indexOf(")")).split(",");
      //console.log("set:", translate)
      //var values = [parseInt(translate[0]) , parseInt(translate[1])]
      return "translate(" + t.apply(values) + ")";
    };
}

function transformInit(t){
  //console.log(t)
    return function(d) {
      //console.log('values Normal:', d)
      var values = [d.x +width/3, d.y + height/3]
      //console.log(t.apply(values))
      return "translate(" + t.apply(values) + ")";
    };
}

function transform(t){
  //console.log(t)
    return function(d) {
      //console.log('values Normal:', d)
      var values = [d.x, d.y]
      //console.log(t.apply(values))
      return "translate(" + t.apply(values) + ")";
    };
}

function transformCurules(t){
  return function(d) {
    //console.log('values curules:', d)
    let offsetY = -120
    var values = [d.cx, d.cy + offsetY]
    //console.log(t.apply(values))
    return "translate(" + t.apply(values) + ")";
  };
}

function transformText(t){
  //console.log(t)
    return function(d) {
      //console.log('values:', d)
      var values = [d.x, d.y+20]
      //console.log(t.apply(values))
      return "translate(" + t.apply(values) + ")";
    };
}

function transformTextCurules(t){
  //console.log(t)
    return function(d) {
      //console.log('values:', d)
      let offsetY = -120
      var values = [d.cx, d.cy+20+offsetY]
      //console.log(t.apply(values))
      return "translate(" + t.apply(values) + ")";
    };
}

function transformGroups(t){
  //console.log(t)
    return function(d) {
      //console.log('values:', d)
      var values = [groups[d].x, groups[d].y-50]
      //console.log(t.apply(values))
      return "translate(" + t.apply(values) + ")";
    };
}
