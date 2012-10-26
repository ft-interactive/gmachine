#!/usr/bin/env node

var express = require('express'),
	app = express(),
	fs = require('fs'),
	gm = require('gm'),
	request = require('request'),
	program = require('commander');

program
  .version('0.0.1')
  .option('-p, --port <n>', 'Set the port number', parseInt, process.env.PORT || 3000 )
  .option('-i --imagemagick', 'Use Imagemagick instead of Graphicsmagick', process.env.IMAGEMAGICK || false )
  .parse(process.argv);

var engine = program.imagemagick ? gm.subClass({ imageMagick: true }) : gm,
	startTime = Date.now(),
	tmpDir = 'tmp/' + program.port + '-' + startTime,
	imagesToDelete = [],
	expires,
	lastModified = new Date('Jan 01, 2012');

try{
	fs.mkdirSync( 'tmp', 0755 );
}catch(e){
	process.stderr.write( 'Error creating top-level tmp directory\n' );
}

try{
	fs.mkdirSync( tmpDir, 0755 );
	process.on('exit', cleanUpOnShutDown);
	process.on('SIGTERM', cleanUpOnShutDown);
}catch(e){
	process.stderr.write( 'Error creating app instance tmp directory\n' );
}

app.get('/:width/:height', function(req, res){

	var params = req.params,
		query = req.query,
		tmpFileName = [tmpDir,'/', getRandomFileName(), '.jpg'].join( '' );

	request( req.query.url ).pipe(fs.createWriteStream(tmpFileName).on('close', function(){

		var img = engine(fs.createReadStream(tmpFileName));

		if ( query.crop ) {
			var cropVals = query.crop.split(',');
			img = img.crop(cropVals[0], cropVals[1], cropVals[2], cropVals[3]);
		}

		img.resize(params.height, params.height).stream(function(err, stdout, stderr){
			res.type('jpeg');
			res.set({
					'Expires': expires.toUTCString(),
					'Cache-Control': 'public, max-age=31536000',
					'Last-Modified': lastModified.toUTCString()
				});
			stdout.on( 'close', function(){
				imagesToDelete.push( tmpFileName );
			});
			stdout.pipe(res);
		});
	}));
});

function getRandomFileName() {
	return Math.floor(Math.random(100) * 10000).toString() + Date.now().toString();
}

function updateExpires() {
	// 1 year. More than that much in the future and it violates the RFC guidelines
	expires = new Date(Date.now() + 31536000000 );
}

updateExpires();

setInterval(updateExpires(), 3600000 /* every hour */);

function deleteFile( filename ) {
	fs.unlink( filename, function ( err ) {
		if ( err ) {
			process.stderr.write( 'Error deleting temporary image ' + filename + '\n' );
			console.log(err);
			return;
		}
		
		process.stdout.write('Deleted temporary image ' + filename + '\n');
	});
}

function cleanUpOnShutDown(){
	fs.rmdirSync( tmpDir );
}

setInterval(function(){

	var queue = imagesToDelete;

	imagesToDelete = [];

	queue.forEach( deleteFile );

}, 30000);

app.enable('trust proxy');
app.listen( program.port );

/* 

Related Links:

https://developers.google.com/speed/docs/best-practices/caching
*/