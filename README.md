# The Noble Scaffold
### By ProjectAMPLE & Nobalai

Automate distribution of multiple production versions alongside a bleeding edge development version with optimized cache busting
while programmatically generating a versions manifest file.

### Features include:

* Versioning
	* development and automatic multiple frozen production versions
		* optimized client side caching since only newly modified modules are created in new version build directory
		* (See external repositories in django and JS for one implementation on how to use them)
	* random name generator for new versions
	* automatically increment version name based on patch/minor/major flags
	* pull branch name
	* compare file hashes to find newly modified modules/files
* Webpack
	* module bundling with optional split by name (webpack)
	* live reload with webpack-dev-server
	* 2 webpack config files with proper inheritance of arrays, loaders and plugins
* Transpilation
	* es6 with babel
	* scss
* Bundling
	* minification (js & css)

## Example

In the example version-manifest.json below, a minor update was released (<code>gulp release</code>)
 which only modified <code>example/src/moduleA.js</code>.

### Version manifest array: 
	[
      {
        "name": "vicarious-thrill",
        "id": "0.1.1",
        "type": "minor",
        "branch": "master",
        "production": true,
        "created": "3/2/2016, 10:42",
        "timestamp": "2016-03-02T15:42:52.287Z",
        "notes": "N/A",
        "schemaChange": false,
        "modules": {
          "js": {
            "app": "nondescript-nation",
            "lib": "nondescript-nation",
            "moduleA": "vicarious-thrill",
            "moduleB": "nondescript-nation",
            "moduleC": "nondescript-nation"
          },
          "css": {
            "app": "nondescript-nation"
          },
          "vendor": {}
        }
      },
      {
        "name": "nondescript-nation",
        "id": "0.0.1",
        "type": "patch",
        "branch": "master",
        "production": false,
        "created": "3/2/2016, 10:20",
        "timestamp": "2016-03-02T15:20:31.171Z",
        "notes": "N/A",
        "schemaChange": false,
        "modules": {
          "js": {
            "app": "nondescript-nation",
            "lib": "nondescript-nation",
            "moduleA": "nondescript-nation",
            "moduleB": "nondescript-nation",
            "moduleC": "nondescript-nation"
          },
          "css": {
            "app": "nondescript-nation"
            },
          "vendor": {}
        }
      }
    ]
    
The build directory will contain: 

	versions
	    ├── 0.0.1-nondescript-nation
	    │   ├── css
	    │   │   └── moduleA.css
	    │   ├── js
	    │   │   ├── app.js
	    │   │   ├── lib.js
	    │   │   ├── main.js
	    │   │   ├── moduleA.js
	    │   │   ├── moduleB.js
	    │   │   └── moduleC.js
	    │   └── vendor
	    └── 0.1.1-vicarious-thrill
	        ├── css
	        ├── js
	        │   └── moduleA.js
	        │   
	        └── vendor

On the client side production version, the developer will
need to either manually patch in the generated files into an HTML file or automate this process with a server side build script
(I'm currently working on releasing an open source version of my django/python solution soon)
  
### TODO 

* Add vendor module separation
* Clean up comments
