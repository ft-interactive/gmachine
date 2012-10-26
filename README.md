gMachine
========

A node app to grab images from the internet and resize, crop and compress them. Uses GraphicsMagick (default) or Imagemagick.

__Install using GraphicsMagick__

    $ brew install graphicsmagick
    $ node app.js --p 8080

__Install using ImageMagick__

	$ brew install imagemagick
	$ node app.js --port 8080 --imagemagick
	

__Call the service like this__

	http://localhost:8080/{resizeWidth}/{resizeHeight}?crop={cropWidth},{cropHeight},{x},{y}&url={url}

__example__

The following URL will get the image at http://etc/etc/image.jpg

	http://localhost:8080/200/400?crop=100,100,250,150&url=htp://etc/etc/image.jpg
	
and will crop a 100px x 100px square at coordinates x=250px, y=150px. The cropped image will then be resized to 200px x 400px.

Crop is an optional param. To crop without resizing, set the the resize dimensions to 0.

__Options__

* `-p --port` Set the port number. Defaults to 3000. On Heroku the port will be entered via `process.env.PORT`
* `-i --imagemagick` Use ImageMagick instead GraphicsMagick

__TODO__

* JPEGs only - early days proof-of-concept at the moment.
* Image compression
* B&W, Sepia filters etc
* HDPI
* Sprites / stiching
* Output to base64/data uri. Batching many images into a single response.
* Handy UI for Resizing, Cropping etc. Hosted as part of the app.