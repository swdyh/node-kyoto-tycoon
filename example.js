var KyotoTycoon = require('kyoto-tycoon').KyotoTycoon

var kt = new KyotoTycoon()
kt.set('key1', 'val1', function() {
    kt.get('key1', function(err ,data) {
        console.log(data)
        kt.end()
    })
})

// Do not use Keep-Alive connection
var kt2 = new KyotoTycoon({ keepalive : false })
kt2.set('key2', 'val2', function(err, data) {
    kt2.get('key2', function(err, data) {
        console.log(data)
        // unnecessary
        // kt2.end()
    })
})

// use JSDeferred
var kt3 = new KyotoTycoon({ deferred : true })
kt3.set('key3', 'val3').next(function() {
    return kt3.get('key3')
}).next(function(err, data) {
    console.log(data)
    return kt3.remove('key3')
}).next(function(err, data) {
    return kt3.get('key3')
}).next(function(err, data) {
    console.log(err)
    kt3.end()
})
