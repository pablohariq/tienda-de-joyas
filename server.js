const express = require('express')
const {results: joyas} = require('./data/joyas.js')
const {HATEOAS, HATEOASv2, seleccionarCampos, ordenarElementos} = require('./funciones')

const app = express()
app.listen(3000, () => console.log('Your app listening on port 3000'))


app.get('/', (req, res) => {
	res.send('💎Tienda de joyas API💎')
})

//localhost:3000/api/joyas
app.get('/api/v1/joyas', (req, res) => {
	res.send(HATEOAS())
})

//localhost:3000/api/v1/joyas/(id)
app.get('/api/v1/joyas/:id', (req, res) => {
	const {id} = req.params
	const respuestaJoya = joyas.find(j => j.id == id) || {error: "No se ha encontrado el ID de la joya especificada"}
	if (respuestaJoya.error) res.status(404)
	else res.status(200)
	res.send(respuestaJoya);
})

// /api/v2/joyas
// /api/v2/joyas?order=<asc, desc>
// /api/v2/joyas?page=<n>
app.get('/api/v2/joyas', (req, res) => {
	const {order} = req.query
	if (order){
		const joyasOrdenadas = ordenarElementos(order)
		return res.send(joyasOrdenadas)
	}
	if (req.query.page){
		const {page} = req.query
		const paginaJoyas = HATEOASv2().slice(page*2 - 2, page*2)
		if (paginaJoyas.length == 0) return res.send({error: "No hay joyas que mostrar en esta página"})
		return res.send({joyas: paginaJoyas})
	}
	res.send({joyas: HATEOASv2()})
})

// /api/v2/joyas/(id)<?campos=campo1,campo2...>
//ej /api/v2/joyas/5?campos=name,category
app.get('/api/v2/joyas/:id', (req, res) => {
	const {id} = req.params
	const {campos} = req.query
	let joya = joyas.find(j => j.id == id) || {error: "No se ha encontrado el ID de la joya especificada"}
	if (joya.error){
		res.status(404).send(joya)
	} 

	if (campos) {
		console.log(campos.split(","))
		joya = seleccionarCampos(joya, campos.split(","))
		console.log(joya)
	}
	res.status(200).send(joya)
})

app.get('/api/v2/joyas/categoria/:categoria', (req, res) => {
	const {categoria} = req.params
	const respuestaJoya = joyas.filter(j => j.category == categoria)
	console.log(respuestaJoya)
	res.send(respuestaJoya)
})

