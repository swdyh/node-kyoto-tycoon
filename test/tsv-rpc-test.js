var vows = require('vows')
var assert = require('assert')

var TsvRpc = require('../lib/tsv-rpc').TsvRpc
var tsvrpc = new TsvRpc

vows.describe('TSV-RPC').addBatch({
    'new TsvRpc': {
        topic: tsvrpc,
        'is set default options': function(topic) {
            assert.equal(topic.port, 1978)
            assert.equal(topic.host, 'localhost')
        }
    },
    'rpc set and get': {
        topic: function() {
            tsvrpc.rpc('set', { key: 'key', value: 'val' }, this.callback)
        },
        '': {
            topic: function() {
                tsvrpc.rpc('get', { key: 'key' }, this.callback)
            },
            'shuld set value': function(err, data) {
                assert.isNull(err)
                assert.equal(data.value, 'val')
                tsvrpc.end()
            }
        }
    }
}).addBatch({
    'TsvRpc.parse': {
        topic: function() {
            return TsvRpc.parse('foo\tbar\nbar\tbaz\n')
        },
        'parse tsv': function(topic) {
            assert.equal(topic.foo, 'bar')
            assert.equal(topic.bar, 'baz')
        },
    },
    'TsvRpc.serialize': {
        topic: function() {
            return TsvRpc.serialize({ foo: 'bar', bar: 'baz' })
        },
        'serialize tsv': function(topic) {
            assert.equal(topic, 'foo\tbar\nbar\tbaz\n')
        }
    }
}).addBatch({
    'TsvRpc parse base64 tsv': {
        topic: function() {
            var c = 'Content-Type: text/tab-separated-values; colenc=B'
            var body = 'dmFsdWU=\tAAAAAAAAAAE='
            return TsvRpc.parse(body, { 'content-type': c })
        },
        'parse tsv': function(topic) {
            assert.equal(topic.value, '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0001')
        }
    },
    'TsvRpc parse urlencode tsv': {
        topic: function() {
            var c = 'Content-Type: text/tab-separated-values; colenc=U'
            var body = 'value\t%09%25%20'
            return TsvRpc.parse(body, { 'content-type': c })
        },
        'parse tsv': function(topic) {
            assert.equal(topic.value, '\t% ')
        }
    }
}).export(module)
