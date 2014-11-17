gulp-frontend-workflow
======================

A frontend workflow for gulp. It should provide a base set of tools for your frontend development job.

It contains the following:

* Less compiler
* CSS minification
* JS Hint
* JS uglifier
* Webserver with Livereload
* HTML templates
* Plumber to handle gulp exceptions

##Setup
Install [npm](http://node.org)
	
Navigate into the cloned git directory and install the dependencies:

	cd gulp-frontend-workflow
	npm install
	

##Usage
Run gulp to start a webserver which watches file changes and triggers a browser reload.

	gulp
	
For further tasks and seetings take a look at gulpfile.js.