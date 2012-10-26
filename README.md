gMachine
========

A node app to grab images from the internet and resize, crop and compress them. Uses GraphicsMagick.

__Install GraphicsMagick__

    brew install graphicsmagick
    
__Then start the app__
	
	node app.js

__Call the service like this__

	http://localhost:3000/{resizeWidth}/{resizeHeight}?crop={cropWidth},{cropHeight},{x},{y}&url={url}

__example__

The following URL will get the image at http://etc/etc/image.jpg

	http://localhost:3000/200/400?crop=100,100,250,150&url=htp://etc/etc/image.jpg
	
and will crop a 100px x 100px square at coordinates x=250px, y=150px. The cropped image will then be resized to 200px x 400px.

Crop is an optional param. To crop without resizing, set the the resize dimensions to 0.

__TODO__

* JPEGs only - early days proof-of-concept at the moment.
* Pass port as command line option
* Image compression
* B&W, Sepia filters etc
* HDPI
* Sprites / stiching
* Output to base64/data uri. Batching many images into a single response.
* Handy UI for Resizing, Cropping etc. Hosted as part of the app.