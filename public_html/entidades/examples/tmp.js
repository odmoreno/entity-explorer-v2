

    //for(let key in actualDict){  
    //  console.log(key)
    //  actualDict[key].count +=1 
    //  let newid = sesLinkId + 's' +key
    //  
    //  dictValues[newid] = count 
    //  //link.value +=1
    //  //if(dictLinkSes[]){
    //  //}
    //  //console.log(link)
    //}

function checkLinks2(links){
  let newlinks = []
  let dictTmpLinks = {}

  if(!dictLinks[currentSes])
    dictLinks[currentSes] = {}

  let dictKeys = Object.keys(dictLinks)
  console.log(dictLinks)
  console.log('Current Keys:', dictKeys)
  console.log("CurrentSes:", currentSes)

  let sliceKeys = sliceDictKeys(dictKeys)


  for (let l=0; l<links.length; l++){
    let id = links[l]
    
    if(enlaces[id]){

      if(dictKeys.length > 1 ){
        enlaces[id].visitado = 1
        enlaces[id].value = 1
        let link = {
          'source' : enlaces[id].source,
          'target' : enlaces[id].target,
          'value' : enlaces[id].value,
          'visitado' : enlaces[id].visitado,
        }
        //dictTmpLinks[id] = {} 
        dictTmpLinks[id] = link

        for(let k=sliceKeys.length -1; k>=0; k--){
          let sesLinkId = sliceKeys[k]
          console.log("current key links reverse:", sesLinkId)
          let dictLinkSes = dictLinks[sesLinkId]
          console.log(dictLinkSes)
        }
      }
      else{
        enlaces[id].visitado = 1
        enlaces[id].value = 1
        source = enlaces[id].source
        target = enlaces[id].target
        let link = {
          'source' : source,
          'target' : target,
          'value' : enlaces[id].value,
          'visitado' : enlaces[id].visitado,
        }
        //console.log("link", link)
        //console.log("source2", Object.create(enlaces[id].source))
        //console.log("source", enlaces[id].source)
        //dictTmpLinks[id] = {} 
        dictTmpLinks[id] = link
        //dictTmpLinks[id]  = Object.create(enlaces[id])
      }
    }
  }


  console.log("diccionario para la sesion :", currentSes, dictTmpLinks)

  dictLinks[currentSes] = dictTmpLinks

}

function checkLinks(links){

  let newlinks = []
  let dictTmpLinks = {}

  if(!dictLinks[currentSes])
    dictLinks[currentSes] = {}

  let dictKeys = Object.keys(dictLinks)
  console.log(dictLinks)
  console.log('Current Keys:', dictKeys)
  console.log("CurrentSes:", currentSes)

  let sliceKeys = sliceDictKeys(dictKeys)

  for (let l=0; l<links.length; l++){
    let id = links[l]
    //console.log("ID", id)
    //console.log(enlaces[id])
    if(enlaces[id]){
        if(dictKeys.length > 1 ){
          //dictLinks[currentSes] = {}
          enlaces[id].visitado = 1
          enlaces[id].value = 1
          let link = {
            'source' : enlaces[id].source,
            'target' : enlaces[id].target,
            'value' : enlaces[id].value,
            'visitado' : enlaces[id].visitado,
          }
          //dictTmpLinks[id] = {} 
          dictTmpLinks[id] = link
          //dictTmpLinks[id]  = Object.create(enlaces[id])
          //console.log("Link inicial:", dictTmpLinks[id] )

          for(let k=sliceKeys.length -1; k>=0; k--){
            let sesLinkId = sliceKeys[k]
            console.log("current key links reverse:", sesLinkId)
            let dictLinkSes = dictLinks[sesLinkId]
            if(dictLinkSes[id]){
              console.log("existe el enlace en esta sesion:", dictTmpLinks[id])
              dictTmpLinks[id].value += 1
            }
            else{
              console.log("No existe pero hay que agregarlo")
              //dictTmpLinks[id]
            }
          }

        }
        else{
          enlaces[id].visitado = 1
          enlaces[id].value = 1
          source = enlaces[id].source
          target = enlaces[id].target
          let link = {
            'source' : source,
            'target' : target,
            'value' : enlaces[id].value,
            'visitado' : enlaces[id].visitado,
          }
          //console.log("link", link)
          //console.log("source2", Object.create(enlaces[id].source))
          //console.log("source", enlaces[id].source)
          //dictTmpLinks[id] = {} 
          dictTmpLinks[id] = link
          //dictTmpLinks[id]  = Object.create(enlaces[id])
        }
    }
    else LOGCV && console.log('No existe enlace id: ', id)
  }

  console.log("diccionario para la sesion :", currentSes, dictTmpLinks)

  dictLinks[currentSes] = dictTmpLinks

  let listoflinks = Object.values(dictLinks[currentSes])

  newlinks = listoflinks
  //newlinks = [... listoflinks]
  //for (let key in enlaces) {
  //    if(enlaces[key].visitado == 1) {
  //      let link = {
  //        'source' : enlaces[key].source,
  //        'target' : enlaces[key].target,
  //        'value' : enlaces[key].value,
  //        'visitado' : enlaces[key].visitado,
  //      }
  //      newlinks.push(link)
  //      //newlinks.push(Object.create(enlaces[key]))
  //    }
  //}

  console.log("Prelinks:", newlinks)

  //let newnodes2 = []
  //let newlinks2 = []
    
  //newnodes2 = newnodes.map(d => Object.create(d));
  //newlinks2 = newlinks.map(d =>  Object.create(d) );

  //console.log(newlinks)
  //console.log('links asam', newlinks2)

  return newlinks

}



function hideOptCurules(){

  d3.select("#plenosuperior")//.transition().duration(durationRect/2)
    .style('opacity', '0')
}

function showOptCurules(){

  d3.select("#plenosuperior")//.transition().duration(durationRect)
    .style('opacity', '1')
}

function showVotesGrp(){
  d3.selectAll('.grp').transition().duration(durationRect)
  .style('opacity', '1')
  d3.selectAll('.labeltext').transition().duration(durationRect)
    .style('opacity', '1')
  //d3.select('#g1').transition().delay(500).duration(durationRect+200)
  //  .attr("transform", "translate(" + (-width/2 -50) + "," + (-height / 2  -50 ) + ")");

  //var gTransform = d3.select('#g1')
  //gTransform.transition().delay(600).duration(durationRect+200)
  //.attr("transform", "translate(" + (-width/2 -50) + "," + (-height / 2  -50 ) + ")");


}

function hideVotesGrp(){
    
    alert("ddd")

  d3.selectAll('.grp').transition().duration(durationRect)
    .style('opacity', '0')
  d3.selectAll('.labeltext').transition().duration(durationRect)
    .style('opacity', '0')

//var gTransform = d3.select('#g1')
//
//gTransform.transition().delay(400).duration(durationRect+200)
//  .attr("transform", "translate(" + (-50) + "," + ( -height / 5) + ")");

//d3.select('#g1').attr("transform", "translate(" + (-50) + "," + ( -height / 5) + ")");


}