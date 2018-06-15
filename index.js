var express = require('express')
  , request = require('request')
  , multer  = require('multer');

var app = express();
var upload = multer({ dest: '/tmp/' });

app.post('/', upload.single('thumb'), function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload.event);

  // Identify Player
  if (payload.Player.uuid == process.env.PLAYER && payload.Metadata.type != 'track') {

  var action = '';

    if (payload.event == 'media.play' || payload.event == 'media.resume') {
      // Turn light off.
      action = 'lounge_lights_low';
      console.log('Action: ' + action);
    } else if (payload.event == 'media.pause' || payload.event == 'media.stop') {
      // Turn light on.
      action = 'lounge_lights_high';
      console.log('Action: ' + action);
    }

    var options = {
    method: 'GET',
    url: 'https://maker.ifttt.com/trigger/' + action + '/with/key/' + process.env.IFTTT_MAKER_KEY,
    };

    request(options);

  }

  res.sendStatus(200);
});

app.listen(17605);
