var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwtUtil = require('jwt-simple');
var request = require('request');
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  //serves up the index of the site w/ the bundle js
  res.render('index', { title: 'Express' });
});

//proxy routes, needs to decode the appropriate JWTs
router.post('/getObject', function(req, res, next) {
  var data = req;
  var options = { method: 'POST', uri: 'https://api.azuqua.com/flo/f2d7f93b10190ee1b3feb15f0f2ef975/invoke?clientToken=a3b9d7e09b44438e6c1b1c3b97efea75dacfd09e980d8f83d0a25518daab9b34', body: data, json: true};

  rp(options).then(function(body) {
    res.sendStatus(200);
  }).catch(function(e) {
    console.error(e);
  })
});

//proxies the flo for the sidebar request
router.get('/sidebar-query', function(req, res, next) {
  res.set({'Access-Control-Allow-Origin': '*'});
  request.get('https://api.azuqua.com/flo/ee72f49bd29e3886d0ab2a5a9e27e150/invoke?clientToken=6828a8a73c17638e2e8afaaa2545dcceb6d95e1966e924df46eeb360f9802551', function(err, response, body) {
    if (err) {
      console.error(err)
    } else {
      console.log('returning the body back to the FLO');
      res.json(body);
    }
  })
});

//passes the descriptor to the request
router.get('/descriptor', function(req, res, next) {
  fs.readFile('../descriptor.json', function(err, data) {
    console.log(data, typeof data);
    var parsedDescriptor = JSON.parse(data);
    res.json(parsedDescriptor);
  });

});

router.get('/config', function(req, res, next) {
  res.set({ 'Access-Control-Allow-Origin': '*' });
  res.render('config/index', { title: 'Express' });
});

router.get('/state', function(req, res, next) {
  res.set({ 'Access-Control-Allow-Origin': '*' });
  request.get('https://api.azuqua.com/flo/9582836be3b35624d142f0d61542cbab/invoke?clientToken=9b0c03eef871c95770fd55ffee382db239b69a1fd8ada0f45229c1a029487dc3', function(err, response, body) {
    if (err) {
      console.error(err)
    } else {
      console.log('returning configuration state');
      res.json(body);
    }
  });
});

router.get('/salesforce-config', function(req, res, next) {
  var date = Date.now();
  var configName = 'stridecon' + date;
  var authorizeLink = 'https://designer2.azuqua.com/app/oauth/salesforce2_29/authorize?app_token=azq_apps&orgId=6188&configName=' + configName + '&version=1.3.67&env=login';

  request.get(authorizeLink, function(error, response, body) {
    if (error) console.error(error);
    console.log(body);
    res.send(body);
  });
});

router.post('/getUser', validateJWT, function(req, res, next) {
   var options = { method: 'POST', uri: 'https://auth.atlassian.com/oauth/token', body: {
      grant_type: 'client_credentials',
      client_id: 'jpxosPzwQ63P1A2jdJ8YcNK2CpxGiklb',
      client_secret: 'faT7PWTGA_U5wwWQYHnJ2-eAggB2VbFwJMzA6FZSuPP4adW_WcGxDvbvlhCeZhyP',
      audience: 'api.atlassian.com'
    },
    json: true
  };

  console.log('getting the access token');
  rp(options).then(function(body) {
    console.log('got the access token');
    var token = body.access_token;
    var cloudId = res.locals.context.cloudId;
    var rosterNext = req.body.roster;
    var roster = req.body;
    var ownerEmail = req.body.email;


    rosterNext.forEach(function(object) {
        var userId = object.id;

        var moreOptions = {
          uri: 'https://api.atlassian.com' + '/scim/site/' + cloudId + '/Users/' + userId,
          method: 'GET',
          headers: {
            authorization: "Bearer " + token,
            "cache-control": "no-cache"
          }
        }
        console.log('getting the user')
        rp(moreOptions).then(function (user) {

          var parsedUser = JSON.parse(user);
          var strideEmail = parsedUser.userName;

          if (strideEmail === ownerEmail) {
            console.log(parsedUser.photos[0], typeof parsedUser.photos[0]);
            res.json(parsedUser.photos[0])
          }
        });
      });
  });
});

router.get('/updateState', validateJWT, function(req, res, next) {
  console.log('yah');

  // var options = { method: 'POST', uri: 'https://auth.atlassian.com/oauth/token', body:
  //   {
  //     grant_type: 'client_credentials',
  //     client_id: 'jpxosPzwQ63P1A2jdJ8YcNK2CpxGiklb',
  //     client_secret: 'faT7PWTGA_U5wwWQYHnJ2-eAggB2VbFwJMzA6FZSuPP4adW_WcGxDvbvlhCeZhyP',
  //     audience: 'api.atlassian.com'
  //   },
  //   json: true
  // };

  // rp(options).then(function(body) {
  //     var token = body.access_token;
  //     var data = {
  //       configured: true
  //     }
  //     var headers = {
  //       Authorization: 'Bearer ' + token
  //     }
  //     var stateConfigOptions = {
  //       method: 'POST',
  //       uri: 'https://api.atlassian.com/app/module/chat/conversation/chat:configuration/salesforce-config/state',
  //       body: data,
  //       headers: headers,
  //       json: true
  //     }
  //     console.log(stateConfigOptions)
  //     rp(stateConfigOptions).then(function(body) {
  //       console.log(body);
  //     })
  //   }).catch(function (e) {
  //     console.error(e);
  //   })

  res.sendStatus(200);



});

router.get('/send-salesforce', function(req, res, next) {
  res.render('send/index');
});

function getJWT(req) {
    // Extract the JWT token from the request
    // Either from the "jwt" request parameter
    // Or from the "authorization" header, as "Bearer xxx"
    const encodedJwt = req.query['jwt']
      || req.headers['authorization'].substring(7)
      || req.headers['Authorization'].substring(7)

    if  (!encodedJwt)
      throw new Error('Stride/getJWT: expected encoded JWT not found!')

    // Decode the base64-encoded token, which contains the context of the call
    const decodedJwt = jwtUtil.decode(encodedJwt, null, true)

    const jwt = {encoded: encodedJwt, decoded: decodedJwt}

    return jwt
  }

  function validateJWT(req, res, next) {

    try {
      const jwt = getJWT(req)

      // Validate the token signature using the app's OAuth secret (created in DAC App Management)
      // (to ensure the call comes from Stride)
      jwtUtil.decode(jwt.encoded, 'faT7PWTGA_U5wwWQYHnJ2-eAggB2VbFwJMzA6FZSuPP4adW_WcGxDvbvlhCeZhyP');

      // if any, add the context to a local variable
      const conversationId = jwt.decoded.context.resourceId
      const cloudId = jwt.decoded.context.cloudId
      const userId = jwt.decoded.sub

      res.locals.context = {cloudId, conversationId, userId};

      // Continue with the rest of the call chain
      next()
    } catch (err) {
      // a rogue call not frow a legitimate Stride client?
      res.sendStatus(403)
    }
  }

module.exports = router;
