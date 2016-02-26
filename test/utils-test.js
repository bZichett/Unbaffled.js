var utils = require('../src/utils'),
    should = require('chai').should,
    getNextVersion = utils.getNextVersion;


describe('#getNextVersion', function() {
    var newVersion = getNextVersion('0.1.0', 'patch')
    newVersion.should.equal('0.1.1')
})