#!/usr/bin/env node

var express = require('express'),
	app = express(),
	fs = require('fs'),
	gm = require('gm'),
	request = require('request'),
	program = require('commander');

program
  .version('0.0.1')
  .option('-p, --port <n>', 'Set the port number', parseInt, process.env.PORT || 3000)
  .parse(process.argv);

var startTime = Date.now(),
	tmpDir = 'tmp/' + program.port + '-' + startTime;

try{
	fs.mkdirSync('tmp', 0755);
}catch(e){

}

try{
	fs.mkdirSync(tmpDir, 0755);
}catch(e){

}

app.get('/:width/:height', function(req, res){

	var params = req.params,
		query = req.query,
		tmpFileName = [tmpDir,'/', new Buffer(req.query.url).toString('base64'), '.jpg'].join( '' );

	request( req.query.url ).pipe(fs.createWriteStream(tmpFileName).on('close', function(){

		var img = gm(fs.createReadStream(tmpFileName));

		if ( query.crop ) {
			var cropVals = query.crop.split(',');
			img = img.crop(cropVals[0], cropVals[1], cropVals[2], cropVals[3]);
		}

		img.resize(params.height, params.height).stream(function(err, stdout, stderr){
			if (stdout) {
				res.type('jpeg');
				stdout.on('close', function(){
					setTimeout(function(){
						fs.unlink(tmpFileName, function (err) {
							if (!err) {
								console.log('successfully deleted ' + tmpFileName);
							} else {
								throw err;
							}
						});
					},10000);
				});

				stdout.pipe(res);
			}
		});
	}));

});

app.listen( program.port );
