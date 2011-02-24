#!/usr/bin/env node

var rl = require('readline')
var KyotoTycoon = require('kyoto-tycoon').KyotoTycoon

var commands = [
    'report', 'status', 'clear', 'set', 'add', 'replace', 'append',
    'remove', 'get', 'matchPrefix', 'matchRegex'
]
var cli_commands = ['help', 'keys', 'all']
var kt = new KyotoTycoon()
var rli = rl.createInterface(process.stdin, process.stdout)
rli.setPrompt('kt> ')
rli.prompt()
rli.on('SIGINT', function() {
    rli.close()
    process.exit()
})
rli.addListener('line', function(cmd) {
    var tmp = cmd.replace(/^[ ]+|[ ]+$/g, '').split(/\s+/)
    var cmd = tmp.shift()
    if (cmd == 'keys') {
        cmd = 'matchPrefix'
        tmp = ['']
    }

    if (commands.indexOf(cmd) >= 0) {
        tmp.push(function(err, data) {
            if (err) {
                console.log('error: ' + err.message.replace(/\n$/, ''))
            }
            else if (JSON.stringify(data) != '{}') {
                console.log(data)
            }
            rli.prompt()
        })
        kt[cmd].apply(kt, tmp)
    }
    else {
        if (cmd == 'help') {
            console.log('commands:')
            console.log(JSON.stringify(commands.concat(cli_commands)))
            console.log('example:')
            console.log(' kt> set foo 100')
            console.log(' kt> get foo')
        }
        else if (cmd == 'all') {
            kt.matchPrefix('', function(err, val) {
                kt.get_bulk(val, function(err, val) {
                    console.log(val)
                })
            })
        }
        else if (cmd != '') {
            console.log('error')
        }
        rli.prompt()
    }
})
