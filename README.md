gMachine
========

A node app to grab images of the internet and resize, crop and compress them. Uses GraphicsMagick.

__Install GraphicsMagick__

    brew install graphicsmagick
    
__Then start the app__
	
	node app.js

__Call the service like this__

	http://localhost:3000/{resizeWidth}/{resizeHeight}?crop={cropWidth},{cropHeight},{x},{y}&url={url}

__example__

The following URL will get the image at http://etc/etc

	http://localhost:3000/200/400?crop=100,100,250,150&url=htp://etc/etc
	
and will crop a 100px x 100px square at x=250px and y 150px. The cropped image will then be resized to 200px x 400px.

Crop is an optional param. To crop without resizing by setting the the resize dimensions to 0.

__TODO__

* JPEGs only - early days proof-of-concept at the moment.
* Image compression
* B&W, Sepia filters etc
* HDPI
* Sprites / stiching
* Handy UI for Resizing, Cropping etc. Hosted as part of the app.