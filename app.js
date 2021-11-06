// Packages
const express = require('express');
const cors = require('cors');
const app = express();

// IBM Packages
const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// DOTENV configuration
// If no .env file exists, you will need to create one and add the API_KEY
require('dotenv').config();

// EXPRESS setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// IBM DISCOVERY setup
const discovery = new DiscoveryV2({
	version: '2020-08-30',
	authenticator: new IamAuthenticator({
		apikey: process.env.API_KEY,
	}),
	serviceUrl: 'https://api.us-south.discovery.watson.cloud.ibm.com',
});

const collections = {
	turnerFaq: ["b1360f4e-b705-1c1c-0000-017ce8968141"]
}


// ENDPOINTS
app.get('/collections', (req, res) => {
	const params = {
		projectId: process.env.PROJECT_ID
	}

	discovery.listCollections(params)
	.then(response => {
		res.send(response.result.collections)
		console.log(response)
	})
	.catch(err => {
		console.log('error:', err);
		res.status(400).send(err)
	})


})

app.get('/autocomplete', (req, res) => {
	console.log("Autocomplete prefix: " + req.query.prefix)
	
	const params = {
		projectId: process.env.PROJECT_ID,
		collectionIds: [req.query.collection],
		prefix: req.query.prefix,
		count: 3
	}
	
	discovery.getAutocompletion(params)
		.then(response => res.send(response.result))
		.catch(err => console.log('error:', err));
})

app.get('/search', (req, res) => {
	console.log(req.query.search)
	const params = {
		projectId: process.env.PROJECT_ID,
		collectionIds: [req.query.collection],
		query: req.query.search,
		count: 6
	}

	discovery.query(params)
	.then(response => res.send(response.result))
	.catch(err => console.log('error:', err));
})

app.listen(4000, () => console.log("server running on port: 4000"))