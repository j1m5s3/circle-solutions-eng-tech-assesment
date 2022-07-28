const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const sdk = require('api')('@circle-api/v1#v5b8ykl5x0w1dc')
const {v4: uuidv4} = require('uuid')

const schemaValidator = require('jsonschema').Validator;
const validator = new schemaValidator();

const failingJsonInput = require('./card-api-json-req/failing-json-req.json');
const successJsonInput = require('./card-api-json-req/201-json-req.json');
const apiJsonSchema = require('./card-api-json-req/api-schema.json');
var result = validator.validate(failingJsonInput, apiJsonSchema);
//failingJsonInput['metadata']['sessionId'] = '20202020202';
console.log(failingJsonInput);
console.log(result['errors']);

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

//function diffKeys
const app = express()
app.use(session({
    secret: 'id',
    cookie: {maxAge: 30000},
    saveUninitialized: false,
    resave: false,
}))


const port = 3000

app.get('/', (req, res) => {

    console.log('session_id: ', req.sessionID);
    let ipAddr = req.ipAddress;
    console.log(ipAddr);
    let session_id = req.sessionID;
    
    var editFailJsonInput = JSON.parse(JSON.stringify(failingJsonInput));
    var sessionHash = session_id.hashCode();
    
    editFailJsonInput['metadata']['sessionId'] = sessionHash;
    editFailJsonInput['metadata']['ipAddress'] = ipAddr;
    editFailJsonInput['idempotencyKey'] = uuidv4();

    console.log(editFailJsonInput);
    sdk.auth('QVBJX0tFWTo0ZjBlYWY5Yjk1OTAwNjljZjRhYmNiOGYyNjk1Y2M4ODoxNzIyNmMwMjVlYmVmYzVkZTlmOTJkMjU0ZjBhMDJiZg==');
    sdk.createCard(editFailJsonInput)
    .then(res => console.log(res))
    .catch(err => console.error(err));

    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/*
sdk.auth('QVBJX0tFWTo0ZjBlYWY5Yjk1OTAwNjljZjRhYmNiOGYyNjk1Y2M4ODoxNzIyNmMwMjVlYmVmYzVkZTlmOTJkMjU0ZjBhMDJiZg==');
sdk.createCard({
  billingDetails: {
    name: 'Satoshi',
    city: 'Boston',
    country: 'US',
    line1: 'TEST ST',
    postalCode: '02184'
  },
  metadata: {email: 'customer-0001@circle.com', sessionId: 'XXX', ipAddress: '172.33.22.1'},
  idempotencyKey: '12345',
  encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL1dBSzd4c0tMbVBJdE NZTUFlbmdOYTAwK1B0ZjRnZU5NNGhWYnBYQ2sKRkR3U0FQTndZL2tXR0F2ZXZnRXpCYmY5UTNZRXhtR0IwS HNObDJwUG9ha2hjNXp6MzhrRTc3azhkTHJrClVLYWpvb0xROHdmN0dnVTc5ZjFxUUVJVzlVNmppMzJtejFK MUZzM1hRcG5hbGZKamgvUis4cHdmbkVEbwp3Tm9ibkZnRFRNSFVaU0J6eWJUeVdRa1B1SXh2QmxoMmFpQnp JSTJJVHRIT1NGTzd4bzB1V3ErMzFZSHkKbmRLbkNwVXNicHQzSEtVVzZHam92dy91cTRSdUZ2clBtdVlyMk txcmZNL2JaSEJhMkxTeG1YZnpiOWJWCkh4dUl0RlUrY2FtWVZLU0h2UlBaWFhBckNzSVp1S3ZSVXJ4TjFKW WNqTjhST0Z3RU03cFh3T3NTQ1plMQppTkphQWJta2oyZ0VkelRVZjRMNXRGc0tUSkJXSzNVWHJhd1VpVG4x d09PdFpjOVY4VW1qNmlIUjNnOTQKWmVVTmE0UHNGbTFVM3d0Zll3OEl6eTlZcm1XdTljZGliMFZCaHVUU1h XZExXSlZTbUR3aUV1anB6UWtOCnVEMnUKPURTWlUKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo=',
  expMonth: 1,
  expYear: 2025,
  keyId: 'key1'
})
  .then(res => console.log(res))
  .catch(err => console.error(err));
*/