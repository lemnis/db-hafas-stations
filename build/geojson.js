const fs = require("fs");
const ndjson = require("ndjson");
const path = require("path");

const filePath = process.argv[process.argv.length - 1];
const output = path.join(
	path.dirname(filePath),
	path.parse(filePath).name + ".geojson"
);

console.log('Input:', filePath);
console.log('Output:', output);

const features = [];

fs.createReadStream(filePath)
	.pipe(ndjson.parse())
	.on("data", (properties) =>
		features.push({
			type: "Feature",
			geometry: {
				coordinates: [properties.location.longitude, properties.location.latitude],
				type: "Point",
			},
			properties,
		})
	)
	.on("end", (e) =>
		fs.writeFileSync(
			output,
			JSON.stringify(
				{
					type: "FeatureCollection",
					features,
				},
				null,
				2
			)
		)
	);
