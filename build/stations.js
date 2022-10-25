'use strict'

const {PassThrough, pipeline} = require('stream')
const findStations = require('hafas-find-stations')
const {stringify} = require('ndjson')
const hafas = require('./hafas')

const bbox = process.env.bbox ? JSON.parse(process.env.bbox) : {
	north: 54.888,
	west: 5.889,
	south: 47.188,
	east: 15.106,
}

const abortWithError = (err) => {
	console.error(err)
	// process.exit(1)
}

// Create unique list of all stops
const seenStopIds = new Set()
// The dataset
const data = new PassThrough({ objectMode: true })

console.error('searching stations using hafas-find-stations')
// Find stations with endpoint inside bounding box
findStations(hafas, bbox, { concurrency: 10, maxTileSize: 10 }, (err, stop) => {
	if (err) console.error(err)
	if (stop) {
		seenStopIds.add(stop.id)
		data.write(stop)
	}
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})

return pipeline(
	data,
	stringify(),
	process.stdout,
	abortWithError
)
