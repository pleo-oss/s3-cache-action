/**
 * The main action script for the S3 Cache action
 * @see {@link https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action}
 *
 * Checks the existence of the cache file in the S3 bucket and returns
 * the result as the `process` output variable, which can be used by the following steps of the job.
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import {getCurrentRepoTreeHash, fileExistsInS3, runAction} from './utils'

runAction(async () => {
    const bucket = core.getInput('bucket_name', {required: true})
    const keyPrefix = core.getInput('key_prefix')
    const repo = github.context.repo

    const {processed, treeHash, key} = await restoreS3Cache({bucket, keyPrefix, repo})

    // Saving key and hash in "state" which can be retrieved by the "post" run of the action (save.ts)
    // https://github.com/actions/toolkit/tree/daf8bb00606d37ee2431d9b1596b88513dcf9c59/packages/core#action-state
    core.saveState('key', key)
    core.debug(`Saved state: ${key}`)
    core.saveState('hash', treeHash)
    core.debug(`Saved state: ${treeHash}`)

    core.setOutput('processed', processed)
    core.debug(`Set output: 'processed' - ${processed}`)
    core.setOutput('hash', treeHash)
    core.debug(`Set output: 'hash' - ${treeHash}`)
})

type RestoreS3CacheActionArgs = {
    bucket: string
    keyPrefix: string
    repo: {owner: string; repo: string}
}

export async function restoreS3Cache({bucket, keyPrefix, repo}: RestoreS3CacheActionArgs) {
    const treeHash = await getCurrentRepoTreeHash()

    const key = `cache/${repo.owner}/${repo.repo}/${keyPrefix}/${treeHash}`
    const fileExists = await fileExistsInS3({key, bucket})

    if (fileExists) {
        core.info(`Tree hash ${treeHash} already processed.`)
        return {processed: true, treeHash, key}
    }

    core.info(`Tree hash ${treeHash} has not been processed yet.`)
    return {processed: false, treeHash, key}
}
