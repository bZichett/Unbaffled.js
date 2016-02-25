
function printDate(){

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var h = date.getHours();
    var m = date.getMinutes();

    return monthIndex + 1 + "/" + day + "/" + year + ", " + h + ":" + m

}
function getNextVersion(id, upgradeType){
    var v = id.split('.')
    switch (upgradeType) {
        case 'patch':
            v[2] = parseInt(v[2]) + 1
            break
        case 'minor':
            v[1] = parseInt(v[1]) + 1
            v[2] = 0
            break
        case 'major':
            v[0] = parseInt(v[0]) + 1
            v[1] = 0
            v[2] = 0
            break
    }

    return v.join('.')
}


function findByMatchingProperties(array, properties) {
    return array.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}
