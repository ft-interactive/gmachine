var express = require('express'),
	app = express(),
	fs = require('fs'),
	gm = require('gm'),
	request = require('request');

var startTime = Date.now(),
	tmpDir = 'tmp/' + startTime;

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
		tmpFileName = [tmpDir,'/', new Buffer(req.query.url).toString('base64'), '.jpg'].join('');

	request( req.query.url ).pipe(fs.createWriteStream(tmpFileName).on('close', function(){

		var img = gm(fs.createReadStream(tmpFileName));

		if (req.query.crop) {
			var cropVals = req.query.crop.split(',');
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

app.listen(3000);
