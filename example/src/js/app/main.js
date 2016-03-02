//import A1 from 'A1'
//import A2 from 'A2'
//import B1 from 'B1'
//import B2 from 'B2'
//import C1 from 'C1'
//import lib1 from 'lib1'

//import A1 from 'moduleA/A1'
//import A2 from 'example/A2'
//import B1 from 'example/B1'
//import B2 from 'example/B2'
//import C1 from 'example/C1'
//import lib1 from 'example/lib1'

import A1 from 'moduleA/A1'
import A2 from 'moduleA/A2'
import B1 from 'moduleB/B1'
import B2 from 'moduleB/B2'
import C1 from 'moduleC/C1'
import Lib1 from 'lib/lib1'

import frameworkX from 'vendor/frameworkX'
import pluginY from 'vendor/pluginY'

window.A1 = A1
window.B1 = B1
window.C1 = C1

// ES6 test
var array = [1]
for(var item of array){
	console.log(item + "1")
}

(() => {
	console.log("fx")
})()

window.frameworkX = frameworkX

var lib = new Lib1()
window.lib = lib.value


