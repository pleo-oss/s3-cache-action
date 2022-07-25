/**
 * The main action script for the S3 Cache action
 * @see {@link https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action}
 *
 * Checks the existence of the cache file in the S3 bucket and returns
 * the result as the `process` output variable, which can be used by the following steps of the job.
 */

import {getInput, saveState, setOutput, info} from '@actions/core'
import * as github from '@actions/github'
import {getCurrentRepoTreeHash, fileExistsInS3, runAction, AWSOptions} from './utils'

runAction(async () => {
    const bucket = getInput('bucket-name', {required: true})
    const keyPrefix = getInput('key-prefix')
    const repo = github.context.repo
    const awsOptions = {
        region: getInput('aws-region'),
        accessKeyId: getInput('aws-access-key-id'),
        secretAccessKey: getInput('aws-secret-access-key')
    }

    const output = await restoreS3Cache({bucket, keyPrefix, repo, awsOptions})

    // Saving key and hash in "state" which can be retrieved by the
    // "post" run of the action (save.ts)
    // https://github.com/actions/toolkit/tree/daf8bb00606d37ee2431d9b1596b88513dcf9c59/packages/core#action-state
    saveState('key', output.key)
    saveState('hash', output.treeHash)

    setOutput('processed', output.processed)
    setOutput('hash', output.treeHash)
})

type RestoreS3CacheActionArgs = {
    bucket: string
    keyPrefix: string
    repo: {owner: string; repo: string}
    awsOptions: AWSOptions
}

export async function restoreS3Cache({
    bucket,
    keyPrefix,
    repo,
    awsOptions
}: RestoreS3CacheActionArgs) {
    const treeHash = await getCurrentRepoTreeHash()

    const key = `cache/${repo.owner}/${repo.repo}/${keyPrefix}/${treeHash}`
    const fileExists = await fileExistsInS3({key, bucket, awsOptions})

    if (fileExists) {
        info(`Tree hash ${treeHash} already processed.`)
        return {processed: true, treeHash, key}
    }

    info(`Tree hash ${treeHash} has not been processed yet.`)
    return {processed: false, treeHash, key}
}
