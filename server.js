var path = require('path');

var index = require(__dirname + '/server/routes/index');
index.start(path.normalize(__dirname + '/client/www/'));
