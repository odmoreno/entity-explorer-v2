  //text = texts
  //  .data(nodes, d=> d.id)
  //  .join(
  //    enter => enter.append('text')
  //            .attr("class", "labeltext")
  //            .attr('id', d=> 'text'+d.numeroid)
  //            .call(enter => enter.transition().delay(300).duration(durationRect+200)
  //                .attr('visibility', d=> d.labelFlag ? 'visible' : 'hidden' )
  //                .text(d=> getNameAsamb(d))
  //                .attr('x', d=> d.x)//+20//+ d.vx * .0135)
  //                .attr('y', d => d.y + 45)),//-20 // + d.vy * .0135)),
  //    update => update.transition().delay(300).duration(durationRect+200)
  //                    .attr('id', d=> 'text'+d.numeroid)
  //                    .attr('visibility', d=> d.labelFlag ? 'visible' : 'hidden' )
  //                    .text(d=> getNameAsamb(d)
  //                                .attr('x', d=> d.x)//+20//+ d.vx * .0135)
  //                                .attr('y', d => d.y + 45)),
  //    exit => exit.remove()
  //    
  //  )