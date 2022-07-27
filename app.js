const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use(express.static(__dirname + "/component/"));

const port = 3000
var buttonClick = false;

app.get('/', (req, res) => {
  console.log('GET');
  // Cookies that have not been signed
  var cookieValue = req.cookies.redVelvet;

  console.log('cookieValue: ', cookieValue);
  console.log('Cookies: ', req.cookies);

  var cookieName = 'redVelvet';
  let options = {maxAge: 1000 * 60 * 5};

  if (cookieValue == undefined){
    res.cookie(cookieName, 0, options);
    console.log('cookie-set 0');
  } else {
    cookieValue = Number(cookieValue) + 1;
    console.log('new cookieValue: ', cookieValue);

    let responseStr = 'cookie-set ' + cookieValue;
    res.cookie(cookieName, cookieValue, options);
    console.log(responseStr);
  }
  res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {

  console.log('POST');

  let cookies = req.cookies;
  var cookieValue = req.cookies.redVelvet;
  console.log('cookieValue: ', cookieValue);
  console.log('Cookies: ', req.cookies);

  let options = {maxAge: 1000 * 60 * 5};

  if (cookieValue >= 0 || cookieValue == undefined){
    cookieValue = 0;
    res.cookie('redVelvet', cookieValue, options);
    console.log('new cookieValue: ', cookieValue);
  }

  res.send('cookie-set 0');
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})