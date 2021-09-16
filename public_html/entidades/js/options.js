/**Opciones generales para el proyecto */


//opciones de mapeo
let colorMap= $('#colores-select').val()

let shiftPressed = false;
/**
 * Tipo de organismo
 * 1 = Asamblea Nacional
 * 2 = Naciones Unidas 
 */
let organismoOp = 2

/** Data Asamblea */
// Informacion de la asamblea nacional
let asambleistas = []
let sesiones = []
let partidos = []
let regiones = []
let provincias = []
let comisiones = []

//Mapeo (Ids de cada partido, region, provincia)
let partidosId = []
let regionesId = []
let provId = []
let comisionesId = []

//grupos de asambleistas para los buscadores
let partidosG = []
let regionesG = []
let provG = []
let comG = [] //comisiones  

//Entidades seleccionados por el usuario 
let entidades = {}

//counters
var currentSes = 1 //sesion actual
var interval;
var currentId = 1 //indice de sesion actual

// Info ensencial del grafico
var groups;

//OPciones del chart de rectangulos
let rectSize = 35
let rectSpaceSize = 40

//OPciones del chart de Circulos
let circleRadius = 10


//dict de sesiones seleccionadas para la graficas
let idSesiones = {}
let lastIdS; 
let firstIds;

/**Data UN */
// Informacion de las naciones unidas
let unResolutions = []
let paisesUN = []

let groupCodes = {
  "1" : "África",
  "2" : "Asia-Pacífico",
  "3" : "Europa Oriental",
  "4" : "América Latina y el Caribe",
  "5" : "Europa Occidental y Otros",
  "6" : "Sin Grupo",
  "7" : "Observadores"
}



function color (d, option){
  
  var _color;
  //console.log("D:", d)
  if(organismoOp == 1){
    _color = colorOp1(d, option)
  }
  else if (organismoOp == 2){
    //console.log("UN :", d)
    _color = colorOp2(d, option)
  }
  return _color;
}

colorOp1 = (d, option) => {
  if(option == "partidos"){
    //console.log("COLOR:", d)
    //console.log(partidos)
    //console.log("Color selc:", partidos[d.partido])
      //let valueId = partidos[d.codpartido]
      //console.log("asamb", d)
      return colorPartidos2(d.codpartido)
  }
  else if (option == "region") {
      let valueId = regiones[d.region]
      return colorRegions(valueId)
  }
  else if ( option == "provincia") {
      //let valueId = provincias[d.provincia.trim()]
      let valueId = provincias[d.provincia]
      return colorProvincias(valueId)
  }
  else if (option == "voto") {
      let valueId = d.voto
      //console.log("D:", d)
      //console.log("value:", valueId)
      //console.log("code:", voteCodes[valueId])
      return colorVotos(voteCodes[valueId])
  }
  else if(option == "comisiones") {
    let valueId;
    if(d.comisiones.length > 0) {
      valueId = d.comisiones[0].comision
      //console.log("Comision:", valueId)
    }
    return colorComisiones(comisiones[valueId])
  }
}

colorOp2 = (d, option) => {
  //console.log("Option", option)
  if(option == "partidos"){
    //console.log("#d3d92b")
    return "#d3d92b"
  }
  else if (option == "region") {
    let _color = colorGruposUN(d.region)
    return _color
  }
  else if ( option == "provincia") {
    return "#d3d92b"
  }
  else if (option == "voto") {
      let valueId = d.voto
      //console.log("D:", d)
      //console.log("value:", valueId)
      //console.log("code:", voteCodes[valueId])
      //console.log(colorVotos(voteCodes[valueId]))
      return colorVotos(voteCodes[valueId])

  }
  else return "#d3d92b"

}



colorPartidos2 = (d) => {
  //console.log("color2", d)
  let scale = d3
    .scaleOrdinal()
    .domain([
      "ap",
      "creo",
      "psc",
      "nan",
      "bla",
      "a65",
      "fe",
      "idp",
      "psa",
      "aus",
      "pac",
      "id",
      "suma",
      "om",
      "mscc",
      "mpup",
      "mpcg",
      "jp",
      "mat",
      "midc",
    ])
    .range([
      "#d3d92b", //Alianza pais
      "#005b9c", //Creo
      "#ecd63e", //Psc partido social cristiano
      "#999999", // Nulos, asamb sin partidos
      "#efefef", // Blanco 
      "#f79517", // a65 (ahora 65)
      "#da121c", // fe (fuerza ecuador)
      "#6e4691", // idp (independiente)
      "#255734", // psa (partido sociedad patriótica)
      "#5e6f75", // aus (ausente
      "#f986db", // pac (pachakutik)
      "#db693b", // id (izquierda demo)
      "#f59b42", // suma 
      "#999999", // om (otro movimiento)
      "#59adba", // mscc (movimiento social conservador del carchi)
      "#68aeb7", // mpup (movimiento político unidos por pastaza)
      "#77f7e7", // mpcg (movimiento peninsular creyendo en nuestra gente)
      "#90f703", // jp (juntos podemos)
      "#f3f703", // mat (movimiento alianza tsáchila)
      "#59adba", // midc (movimiento integración democrática del carchi)
    ]);
  //console.log("Color:", scale(d))
  return scale(d) 
}

colorRegions = (d) => {
  let regionesD = [...new Set(regionesId)]
  let scale = d3.scaleOrdinal().domain(regionesD).range(d3.schemeCategory10);
  return scale(d)
}

colorProvincias = (d) => {
  let prov = [...new Set(provId)]
  let scale = d3.scaleSequential().domain([0, prov.length-1]).interpolator(d3.interpolateRainbow);
  return scale(d)
}

// "abstencion": 0,
//  "ausente": 1,
//  "si": 2,
//  "no": 3,
//  "blanco": 4
colorVotos = (d) => {
  let scale = d3.scaleOrdinal().domain(votesSet).range(["#626b78", "#b2c0d6", "#13b028", "#c41414", "#ffffff"]);
  return scale(d)
}

colorComisiones = (d) => {
  let com = [...new Set(comisionesId)]
  let scale = d3.scaleSequential().domain([0, com.length-1]).interpolator(d3.interpolateRainbow);
  return scale(d)
}

colorGruposUN = (d) => {
  let scale = d3
    .scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7])
    .range(["#0000FF", "#339900", "#CC0000", "#CC3399", "#CC9900", "#131313", "#c0c0c0"]);
  return scale(d);
};