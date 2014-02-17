gulp-frontend-workflow
======================

A frontend workflow for gulp. It should provide a base set of tools for your frontend development job.


It contains the following:
* [Twitter Bootstrap 3](http://getbootstrap.com/)
* [Less](http://lesscss.org/) to CSS compiler
* [jQuery](http://jquery.com/)
* Image optimization
* JS Hint
* JS uglifier
* [LiveReload](http://livereload.com/)
* CSS minification

##Setup
[install node.js](http://nodejs.org/)

Install gulp

	npm install -g gulp
	npm install -g --save-dev gulp gulp-util
	
Navigate into the cloned git directory and install the dependencies

	cd gulp-frontend-workflow
	npm install
	
You're done!

##Usage

The workflow automatically compiles your less files to css, optimizes your images and provides live reload. 

There are two folders you should be aware of:

###src
The _src_ folder is your working directory. The workflow watches this folder for changes and executes the workflow if needed and reloads your browser.

### build
This is the output of the workflow. Use this to preview your work.

## Gulp commands and tasks
To execute all tasks at once without watching the _src_ folder use the following command:

	gulp
	
To use live reloading use this:

	gulp dev
	
gulp now watches the _src_ folder for changes and executes the needed tasks automatically.

Start your local development server, navigate into the _build_ directory and open the index.html or index.php file. 

For further tasks take a look into the _gulpfile.js_.

Enjoy!

##Configuration
The following options can be set:

__dir__: The names of the source and destination directories.

__task__: Set options for your task. At the moment only the imagemin optimization level can be set.

__copy__: defines the file types of the root directory which should be copied to the destination.

__node_modules__: defines the node module files which should be copied into your project.

__header__: defines a header message for the css and js output files.

__uglify_css__: turns on minification of your css files.

__uglify_js__: turns on js uglification