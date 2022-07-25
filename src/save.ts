/**
 * Runs after the end of the job (using runs.post option in action.yml).
 * Only runs on successful completion of the job which it's used for.
 * @see {@link https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#post}
 *
 * Uploads a cache file to the S3 bucket, if the file was not uploaded before.
 */

import {getInput, getState, info} from '@actions/core'
import {writeLineToFile, copyFileToS3, runAction, AWSOptions} from './utils'

runAction(() => {
    const bucket = getInput('bucket_name', {required: true})
    const hash = getState('hash')
    const key = getState('key')
    const awsOptions = {
        region: getInput('aws-region'),
        accessKeyId: getInput('aws-access-key-id'),
        secretAccessKey: getInput('aws-secret-access-key')
    }

    return saveS3Cache({bucket, hash, key, awsOptions})
})

type SaveS3CacheActionArgs = {
    bucket: string
    hash?: string
    key?: string
    awsOptions: AWSOptions
}

export async function saveS3Cache({bucket, hash, key, awsOptions}: SaveS3CacheActionArgs) {
    if (!hash || !key) {
        info(`Tree hash already processed, skipping saving the cache file.`)
        return
    }

    // The content of the file doesn't really matter,
    // since we're only checking if the file exists
    await writeLineToFile({text: hash, path: hash})
    await copyFileToS3({path: hash, bucket, key, awsOptions})

    info(`Tree hash ${hash} was processed, saved the ${key} cache file.`)
}
