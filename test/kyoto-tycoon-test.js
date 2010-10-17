var vows = require('vows')
var assert = require('assert')

var KyotoTycoon = require('../lib/kyoto-tycoon').KyotoTycoon
var kt = new KyotoTycoon()

vows.describe('KyotoTycoon').addBatch({
    'new KyotoTycoon': {
        topic: kt,
        'is set default options': function(topic) {
            assert.isNotNull(topic.tsvrpc)
            assert.equal(topic.tsvrpc.port, 1978)
            assert.equal(topic.tsvrpc.host, 'localhost')
        }
    },
    'echo': {
        topic: function() {
            kt.echo({ foo: 'bar' }, this.callback)
        },
        'return foo bar': function(err, data) {
            assert.isNull(err)
            assert.equal(data.foo, 'bar')
        }
    },
    'report': {
        topic: function() {
            kt.report(this.callback)
        },
        'return report': function(err, data) {
            assert.isNull(err)
            assert.isString(data.version)
            assert.isString(data.kc_version)
        }
    },
    'status': {
        topic: function() {
            kt.status(0, this.callback)
        },
        'should return status': function(err, data) {
            assert.isNull(err)
            assert.isString(data.count)
            assert.isString(data.size)
        }
    }
}).addBatch({
    'set and get': {
        topic: function() {
            kt.set('foo', 'bar', this.callback)
        },
        '': {
            topic: function(err, data) {
                kt.get('foo', this.callback)
            },
            'should return "bar"': function(err, data) {
                assert.equal(data, 'bar')
            }
        }
    }
}).addBatch({
    'add': {
        topic: function() {
            kt.set('add', 'add val', this.callback)
        },
        '': {
            topic: function() {
                kt.add('foo', 'add val 2', this.callback)
            },
            'should return Error object': function(err, data) {
                assert.isObject(err)
            }
        }
    }
}).addBatch({
    'replace': {
        topic: function() {
            kt.set('replace', 'val1', this.callback)
        },
        '': {
            topic: function() {
                kt.replace('replace', 'val2', this.callback)
            },
            '': {
                topic: function() {
                    kt.get('replace', this.callback)
                },
                'should replace value': function(err, data) {
                    assert.equal(data, 'val2')
                }
            }
        }
    },
    'replace err': {
        topic: function() {
            kt.replace('replace_err', 'val1', this.callback)
        },
        'should return err': function(err, data) {
            assert.isObject(err)
        }
    }
}).addBatch({
    'append': {
        topic: function() {
            kt.append('foo', 'bar', this.callback)
        },
        '': {
            topic: function() {
                kt.get('foo', this.callback)
            },
            'should return appended value': function(err, data) {
                assert.equal(data, 'barbar')
            }
        }
    }
}).addBatch({
    'increment': {
        topic: function () {
            kt.increment('inc', { num: 1 }, this.callback)
        },
        'should return num value': function(err, data) {
            assert.isNull(err)
            assert.isObject(data)
        }
    }
}).addBatch({
    'increment_double': {
        topic: function() {
            kt.increment_double('inc_d', { num: 1 }, this.callback)
        },
        'should return num value': function(err, data) {
            assert.isString(data.num)
        }
    }
}).addBatch({
    'cas': {
        topic: function() {
            kt.set('cas', 1, this.callback)
        },
        '': {
            topic: function() {
                kt.cas('cas', { oval: 1, nval: 2 }, this.callback)
            },
            '': {
                topic: function() {
                    kt.get('cas', this.callback)
                },
                'should set new value': function(err, data) {
                    assert.equal(data, '2')
                }
            }
        }
    },
    'cas err': {
        topic: function() {
            kt.set('cas2', 1, this.callback)
        },
        '': {
            topic: function() {
                kt.cas('cas2', { oval: 2, nval: 3 }, this.callback)
            },
            'should return err': function(err, data) {
                assert.isObject(err)
            }
        }
    }
}).addBatch({
    'remove': {
        topic: function() {
            kt.set('remove', 'remove', this.callback)
        },
        '': {
            topic: function() {
                kt.remove('remove', this.callback)
            },
            '': {
                topic: function() {
                    kt.get('remove', this.callback)
                },
                'should remove value': function(err, data) {
                    assert.isObject(err)
                }
            }
        }
    }
}).addBatch({
    'set_bulk': {
        topic: function() {
            kt.set_bulk({ bulk1: 1, bulk2: 2 }, this.callback)
        },
        'should set values': function(err, data) {
            assert.equal(data.num, '2')
        }
    },
    'set_bulk and get_bulk': {
        topic: function() {
            kt.set_bulk({ bulk3: 3, bulk4: 4 }, this.callback)
        },
        '': {
            topic: function() {
                kt.get_bulk(['bulk3', 'bulk4'], this.callback)
            },
            'should set values': function(err, data) {
                assert.equal(data.bulk3, '3')
                assert.equal(data.bulk4, '4')
            }
        }
    }
}).addBatch({
    'cur_jump': {
        topic: function() {
            kt.set('cur', 'cur', this.callback)
        },
        '': {
            topic: function() {
                kt.cur_jump({ CUR: 10, key: 'cur' }, this.callback)
            },
            ' ': {
                topic: function() {
                    kt.cur_get_key(10, this.callback)
                },
                '': function(err, data) {
                    assert.isNull(err)
                    assert.equal('cur', data)
                }
            }
        }
    }
}).addBatch({
    'clear': {
        topic: function() {
            kt.clear(0, this.callback)
        },
        '': {
            topic: function(err, data) {
                kt.status(0, this.callback)
            },
            'should be stat count 0': function(err, data) {
                assert.equal(data.count, '0')
                kt.end()
            }
        }
    }
}).export(module)
