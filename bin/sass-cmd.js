#!/usr/bin/env node
/**
 * list project sass entries {file,script} based on ./sass.json
 * @module @ctx-core/sass/sass-cmd
 * @example
 * #!/bin/sh
 * sass-cmd.js -t build-1
 * # build-1 build file list
 * sass-cmd.js -t browser
 * # browser build file list
 */
const fs = require('fs')
const minimist = require('minimist')
const { promisify } = require('util')
const resolve = promisify(require('resolve'))
main()
module.exports = _sass_cmd
async function main() {
	const sass_cmd = await _sass_cmd()
	console.info(sass_cmd)
}
async function _sass_cmd() {
	const argv =
		minimist(process.argv.slice(2), {
			'--': true,
			alias: { c: 'config', t: 'target', w: 'watch' }
		})
	const config_file =
		argv.config
		|| process.env.SASS_JSON
		|| './sass.json'
	const target =
		argv.target
		|| 'browser'
	const watch = argv.watch
	const suffix = (argv['--'] || []).join(' ')
	const config_json = fs.readFileSync(config_file, 'utf8')
	const config = JSON.parse(config_json)
	const cmd_config_a1 = config[target] || []
	const cmd_sass_promise_a1 = []
	for (let i = 0; i < cmd_config_a1.length; i++) {
		const config__cmd = cmd_config_a1[i]
		const params = config__cmd.params || ''
		const { input, output } = config__cmd
		if (!input) throw `input required:\n${JSON.stringify(config__cmd)}`
		cmd_sass_promise_a1.push(_cmd(params, input, output, suffix))
	}
	const cmd_sass_a1 = await Promise.all(cmd_sass_promise_a1)
	return cmd_sass_a1.join('\n')
	async function _cmd(params, input, output, suffix) {
		params = `${params} --importer ${await resolve('node-sass-package-importer/dist/cli.js')}`
		params =
			watch
			? `${params} --watch`
			: params
		let cmd = `node-sass ${params} ${input}`
		if (output) cmd = `${cmd} ${output}`
		if (suffix) {
			cmd = `${cmd} ${suffix}`
		}
		return cmd
	}
}
