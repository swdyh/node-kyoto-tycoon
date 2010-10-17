var http = require('http')
var querystring = require('querystring')
try {
    var base64 = require('base64')
}
catch(e) {
    var base64 = require('./base64')
}

exports.TsvRpc = TsvRpc

function TsvRpc(opt) {
    var opt = opt || {}
    this.host = opt.host || 'localhost'
    this.port = opt.port || 1978
    this.client = http.createClient(this.port, this.host)
    this.keepalive = typeof opt.keepalive == 'undefined' ? true : false
}
TsvRpc.serialize = function(obj) {
    var r = ''
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            r += [k, obj[k]].map(querystring.escape).join('\t') + '\n'
        }
    }
    return r
}
TsvRpc.parse = function(tsv, opt) {
    var opt = opt || {}
    var r = {}
    var lines = tsv.split(/\n/)
    lines.forEach(function(i) {
        var tmp = i.split('\t')
        if (tmp.length == 2) {
            if (opt['content-type']) {
                if (opt['content-type'].indexOf('colenc=U') >= 0) {
                    tmp = tmp.map(querystring.unescape)
                }
                if (opt['content-type'].indexOf('colenc=B') >= 0) {
                    tmp = tmp.map(function(i) {
                        return i ? base64.decode(i) : null
                    })
                }
            }
            r[tmp[0]] = tmp[1]
        }
    })
    return r
}

TsvRpc.prototype.rpc = function(method, opt, callback) {
    var header = {
        host: this.host,
        'Content-Type': 'text/tab-separated-values; colenc=U'
    }
    if (this.keepalive) {
        header['Connection'] = 'Keep-Alive'
    }
    var req = this.client.request('POST', '/rpc/' + method, header)
    var body = TsvRpc.serialize(opt)
    req.write(body)
    // TODO use Buffer
    var buf = ''
    req.on('response', function (response) {
        var ct = response.headers['content-type']
        response.on('data', function (chunk) {
            buf += chunk
        })
        response.on('end', function (chunk) {
            var err = response.statusCode != 200 ?
                new Error(response.statusCode + ' ' + body) : null
            // console.log(response.statusCode, body)
            if (callback) {
                callback(err, TsvRpc.parse(buf, { 'content-type': ct  }))
            }
        })
    })
    req.end()
}
TsvRpc.prototype.end = function() {
    this.client.end()
}
