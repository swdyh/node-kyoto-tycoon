var tsvrpc = require('./tsv-rpc')
var Deferred = require('./jsdeferred.js').Deferred

exports.KyotoTycoon = KyotoTycoon

function KyotoTycoon(opt) {
    var opt = opt || {}
    this.db = opt.db
    this.tsvrpc = new tsvrpc.TsvRpc(opt)
    if (opt.deferred) {
        this.useDeferred()
    }
    this.status(function(err, val) {
        if (err) {
            throw err
        }
    })
}

KyotoTycoon.prototype.useDeferred = function() {
    var targets = [
        'echo', 'report', 'status', 'clear',
        'set', 'add', 'replace', 'append', 'increment',
        'increment_double', 'cas', 'remove', 'get',
        'set_bulk', 'remove_bulk', 'get_bulk',
        'cur_jump', 'cur_jump_back', 'cur_step',
        'cur_step_back', 'cur_set_value', 'cur_get',
        'cur_get_key', 'cur_get_value', 'cur_remove',
        'cur_delete'
    ]
    targets.forEach(function(i) {
        this[i] = Deferred.connect(this, i)
    }, this)
}
KyotoTycoon.prototype.set_db = function(db, callback) {
    this.db = db
    if (callback) {
        this.status(callback)
    }
}
KyotoTycoon.prototype.end = function() {
    this.tsvrpc.end()
}

KyotoTycoon.prototype.echo = function(opt, callback) {
    this.tsvrpc.rpc('echo', opt, callback)
}

KyotoTycoon.prototype.report = function(callback) {
    this.tsvrpc.rpc('report', {}, callback)
}

KyotoTycoon.prototype.play_script = function(callback) {
    console.log('not implement')
}

KyotoTycoon.prototype.status = function() {
    var len = arguments.length
    var opt = (arguments[0] && typeof arguments[0] != 'function') ? { DB: arguments[0]} : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('status', opt, callback)
}

KyotoTycoon.prototype.clear = function() {
    var len = arguments.length
    var opt = (arguments[0] && typeof arguments[0] != 'function') ? { DB: arguments[0]} : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('clear', opt, callback)
}

KyotoTycoon.prototype.synchronize = function(opt, callback) {
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('synchronize', opt, callback)
}

KyotoTycoon.prototype.set = function(key, val) {
    var len = arguments.length
    var opt = (arguments[2] && typeof arguments[2] == 'object') ? arguments[2] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    opt.value = val
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('set', opt, callback)
}

KyotoTycoon.prototype.add = function(key, val) {
    var len = arguments.length
    var opt = (arguments[2] && typeof arguments[2] == 'object') ? arguments[2] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    opt.value = val
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('add', opt, callback)
}

KyotoTycoon.prototype.replace = function(key, val) {
    var len = arguments.length
    var opt = (arguments[2] && typeof arguments[2] == 'object') ? arguments[2] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    opt.value = val
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('replace', opt, callback)
}

KyotoTycoon.prototype.append = function(key, val) {
    var len = arguments.length
    var opt = (arguments[2] && typeof arguments[2] == 'object') ? arguments[2] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    opt.value = val
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('append', opt, callback)
}

KyotoTycoon.prototype.increment = function(key) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('increment', opt, callback)
}

KyotoTycoon.prototype.increment_double = function(key) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('increment_double', opt, callback)
}

KyotoTycoon.prototype.cas = function(key) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('cas', opt, callback)
}

KyotoTycoon.prototype.remove = function(key) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('remove', opt, callback)
}

KyotoTycoon.prototype.get = function(key) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.key = key
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('get', opt, function(err, data) {
        callback(err, data.value)
    })
}

KyotoTycoon.prototype.set_bulk = function(hash) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    for (var k in hash) {
        if (hash.hasOwnProperty(k)) {
            opt['_' + k] = hash[k]
        }
    }
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('set_bulk', opt, callback)
}

KyotoTycoon.prototype.remove_bulk = function(keys) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    keys.forEach(function(k) {
        opt['_' + k] = ''
    })
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('remove_bulk', opt, callback)
}

KyotoTycoon.prototype.get_bulk = function(keys) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    keys.forEach(function(k) {
        opt['_' + k] = ''
    })
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('get_bulk', opt, function(err, data) {
        var r = {}
        for (var k in data) {
            if (k.match(/^_/)) {
                r[k.replace(/^_/, '')] = data[k]
            }
        }
        callback(err, r)
    })
}

KyotoTycoon.prototype.matchPrefix = function(prefix) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.prefix = prefix
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('match_prefix', opt, function(err, data) {
        var r = []
        for (var k in data) {
            if (k.match(/^_/)) {
                r.push(k.replace(/^_/, ''))
            }
        }
        callback(err, r)
    })
}

KyotoTycoon.prototype.matchRegex = function(regex) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.regex = regex
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('match_regex', opt, function(err, data) {
        var r = []
        for (var k in data) {
            if (k.match(/^_/)) {
                r.push(k.replace(/^_/, ''))
            }
        }
        callback(err, r)
    })
}

KyotoTycoon.prototype.cur_jump = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('cur_jump', opt, callback)
}

KyotoTycoon.prototype.cur_jump_back = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    if (!opt.DB && this.db) {
        opt.DB = this.db
    }
    this.tsvrpc.rpc('cur_jump_back', opt, callback)
}

KyotoTycoon.prototype.cur_step = function(cur, callback) {
    this.tsvrpc.rpc('cur_step', { CUR: cur }, callback)
}

KyotoTycoon.prototype.cur_step_back = function(cur, callback) {
    this.tsvrpc.rpc('cur_step_back', { CUR: cur }, callback)
}

KyotoTycoon.prototype.cur_set_value = function(cur, val) {
    var len = arguments.length
    var opt = (arguments[2] && typeof arguments[2] == 'object') ? arguments[2] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    opt.val = val
    this.tsvrpc.rpc('cur_set_value', opt, callback)
}

KyotoTycoon.prototype.cur_remove = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    this.tsvrpc.rpc('cur_remove', opt, callback)
}

KyotoTycoon.prototype.cur_get = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    this.tsvrpc.rpc('cur_get', opt, function(err, data) {
        callback(err, data)
    })
}

KyotoTycoon.prototype.cur_get_key = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    this.tsvrpc.rpc('cur_get_key', opt, function(err, data) {
        callback(err, data.key)
    })
}

KyotoTycoon.prototype.cur_get_value = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    this.tsvrpc.rpc('cur_get_value', opt, function(err, data) {
        callback(err, data.value)
    })
}

KyotoTycoon.prototype.cur_remove =
KyotoTycoon.prototype.cur_delete = function(cur) {
    var len = arguments.length
    var opt = (arguments[1] && typeof arguments[1] == 'object') ? arguments[1] : {}
    var callback = (typeof arguments[len - 1] == 'function') ? arguments[len - 1] : null
    opt.CUR = cur
    this.tsvrpc.rpc('cur_delete', opt, function(err, data) {
        callback(err, data)
    })
}
