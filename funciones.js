const {results: joyas} = require('./data/joyas.js')

const HATEOAS = () => 
    joyas.map((j) => {
        return {
            name: j.name,
            url: "http://localhost:3000/api/v1/joyas/" + j.id
        }
    })

const HATEOASv2 = () => 
    joyas.map((j) => {
        return{
            nombre: j.name,
            src: "http://localhost:3000/api/v2/joyas/" + j.id
        }
    })

const seleccionarCampos = (joya, campos) => {
    for (propiedad in joya) {
        if (!campos.includes(propiedad) && propiedad != 'id') delete joya[propiedad]; //borra campo propiedad
    }
    return joya
}

const ordenarElementos = (modo) => {
    return  modo == "asc"
    ? joyas.sort((a,b) => (a.value > b.value ? 1 : -1))
    : modo == "desc" 
    ? joyas.sort((a,b) => (a.value < b.value ? 1 : -1))
    : false
}

module.exports = {HATEOAS, HATEOASv2, seleccionarCampos, ordenarElementos}