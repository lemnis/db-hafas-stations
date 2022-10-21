'use strict'

const {pipeline: pump} = require('stream')
const ndjson = require('ndjson')
const fs = require('fs')
const path = require('path')

const simplify = require('./simplify')

const showError = (err) => {
	if (!err) return
	console.error(err)
	process.exitCode = 1;
}

const stations = ndjson.parse()
process.stdin.pipe(stations);


if (!fs.existsSync('./output')){
    fs.mkdirSync('./output');
}

pump(
	stations,
	simplify(),
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname, process.env.name ? `../output/data-${process.env.name}.ndjson` :  '../data.ndjson')),
	showError
)

pump(
	stations,
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname,  process.env.name ? `../output/full-${process.env.name}.ndjson` :  '../full.ndjson')),
	showError
)
