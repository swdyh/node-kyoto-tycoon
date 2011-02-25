#!/usr/bin/env node

var rl = require('readline')
var KyotoTycoon = require('kyoto-tycoon').KyotoTycoon

var commands = [
    'report', 'status', 'clear', 'set', 'add', 'replace', 'append',
    'remove', 'get', 'matchPrefix', 'matchRegex',
    'cur_jump', 'cur_jump_back', 'cur_step',
    'cur_step_back', 'cur_set_value', 'cur_get',
    'cur_get_key', 'cur_get_value', 'cur_remove', 'cur_delete',
    'set_db'
]
var cli_commands = ['help', 'keys', 'all']
var kt_opt = {}
if (process.argv.length > 2) {
    [process.argv[2], process.argv[3]].forEach(function(i) {
        if (i) {
            if (i.match(/^-?-h(elp)?/)) {
                console.log('kt-cli [host] [port]')
                process.exit()
            }
            if (i.match(/^\d+$/)) {
                kt_opt.port = parseInt(i, 10)
            }
            else {
                kt_opt.host = i
            }
        }
    })
}
var kt = new KyotoTycoon(kt_opt)
var rli = rl.createInterface(process.stdin, process.stdout)
rli.setPrompt('kt> ')
rli.prompt()
rli.on('SIGINT', function() {
    rli.close()
    process.exit()
})
var cb = function(err, data) {
    if (err) {
        console.log('error: ' + err.message.replace(/\n$/, ''))
    }
    else if (JSON.stringify(data) != '{}') {
        console.log(data)
    }
    rli.prompt()
}
rli.addListener('line', function(cmd) {
    var tmp = cmd.replace(/^[ ]+|[ ]+$/g, '').split(/\s+/)
    var cmd = tmp.shift()
    if (commands.indexOf(cmd) >= 0) {
        tmp.push(cb)
        try {
            kt[cmd].apply(kt, tmp)
        }
        catch(e) {
            console.log(e)
            rli.prompt()
        }
    }
    else if (cmd == 'keys') {
        kt.matchPrefix('', cb)
    }
    else if (cmd == 'all') {
        kt.matchPrefix('', function(err, val) {
            kt.get_bulk(val, cb)
        })
    }
    else if (cmd == 'help') {
        console.log('commands:')
        console.log(JSON.stringify(commands.concat(cli_commands)))
        console.log('example:')
        console.log(' kt> set foo 100')
        console.log(' kt> get foo')
        console.log(' kt> cur_jump 1 foo')
        console.log(' kt> cur_get 1 ')
        rli.prompt()
    }
    else if (cmd != '') {
        console.log('error')
        rli.prompt()
    }
    else {
        rli.prompt()
    }
})
