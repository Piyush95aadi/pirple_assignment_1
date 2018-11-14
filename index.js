/*
 * Entry file for the API
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// Create a http server to handle all request
const httpServer = http.createServer((req, res) => {
	initiateServer(req, res);
});

// Start http server
httpServer.listen(config.port, () => {
	console.log(`The server is listening on port ${ config.port }`);
});

// Server block
let initiateServer = (req, res) => {
	// Get the url and parse the it
	let parsedUrl = url.parse(req.url, true);

	let decoder = new StringDecoder('utf-8');
	let buffer = '';

	// Get the payload
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});

	req.on('end', () => {
		buffer += decoder.end();
		// Create data object from request object
		let data = {
			'trimmedPath': parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
			'queryStringObject': parsedUrl.query,
			'method': req.method.toLowerCase(),
			'headers': req.headers,
			'payload': buffer
		};

		// Choose a handler for this request
		let chosenHandler = typeof(router[data.method]) !== 'undefined' && typeof(router[data.method][data.trimmedPath]) !== 'undefined' ? router[data.method][data.trimmedPath] : handlers.notFound;

		// Route the request to the handler
		chosenHandler(data, (statusCode, payload) => {
			// Use the staus code called by the handler or to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			// Use the payload called back by the handler, or default to an empty object
			payload = typeof(payload) == 'object' ? payload: {};

			// Convert the payload to a string
			let payloadString = JSON.stringify(payload);

			// Send the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			//Log the request path
			console.log(`Returning this response: ${statusCode} , ${payloadString}`);
		});

	});
}

// Define the handlers
let handlers = {};

// Hello handler
handlers.hello = (data, callback) => {
	callback(200, {message: 'Hello world'});
}

// Not found handlers
handlers.notFound = (data, callback) => {
	callback(404);
}

// Define a request router
let router = {
	'post': {
		'hello': handlers.hello
	},
	'get': {}
}



