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
import { param_r_ } from '@ctx-core/cli-args'
import { import_meta_env_ } from '@ctx-core/env'
import { readFile } from 'fs/promises'
import { resolve } from 'import-meta-resolve'
await main()
module.exports = sass_cmd_
async function main() {
	const sass_cmd = await sass_cmd_()
	console.info(sass_cmd)
}
async function sass_cmd_() {
	const param_r = param_r_(process.argv.slice(2), {
		config: '-c, --config',
		target: '-t, --target',
		watch: '-w, --watch',
	})
	const config_file =
		param_r.config?.[0]
		|| import_meta_env_().SASS_JSON
		|| './sass.json'
	const target =
		param_r.target?.[0]
		|| 'browser'
	const watch = !!param_r.watch
	const suffix = (param_r['--'] || []).join(' ')
	const config_json = await readFile(config_file, 'utf8')
	const config = JSON.parse(config_json)
	const cmd_config_a = config[target] || []
	const cmd_sass_promise_a = []
	for (let i = 0; i < cmd_config_a.length; i++) {
		const config__cmd = cmd_config_a[i]
		const params = config__cmd.params || ''
		const { input, output } = config__cmd
		if (!input) throw `input required:\n${JSON.stringify(config__cmd)}`
		cmd_sass_promise_a.push(cmd_(params, input, output, suffix))
	}
	const cmd_sass_a = await Promise.all(cmd_sass_promise_a)
	return cmd_sass_a.join('\n')
	async function cmd_(params, input, output, suffix) {
		params = `${params} --importer ${
			await resolve('node-sass-package-importer/lib/cli.js', import.meta.url)
		}`
		params = watch ? `${params} --watch` : params
		let cmd = `sass ${params} ${input}`
		if (output) cmd = `${cmd} ${output}`
		if (suffix) {
			cmd = `${cmd} ${suffix}`
		}
		return cmd
	}
}
