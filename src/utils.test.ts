import * as utils from './utils'
import {exec} from '@actions/exec'

jest.mock('@actions/core')
jest.mock('@actions/exec')

// just making sure the mock methods are correctly typed
const mockedExec = exec as jest.MockedFunction<typeof exec>

const awsOptions = {
    region: 'eu-west-1',
    accessKeyId: 'verycoolkey',
    secretAccessKey: 'verycoolsecretkey'
}

// reset the counter on mock fn calls after every test
beforeEach(() => jest.clearAllMocks())

describe(`Actions Utils`, () => {
    test(`getTreeHashForCommitHash uses git CLI to check if the commit is part of the current branch, returns false when it is not`, async () => {
        mockedExec.mockResolvedValue(0)
        const hash = '5265ef99f1c8e18bcd282a11a4b752731cad5665'
        const output = await utils.getTreeHashForCommitHash(hash)
        expect(mockedExec).toHaveBeenCalledWith(
            'git rev-parse',
            ['5265ef99f1c8e18bcd282a11a4b752731cad5665:'],
            {
                listeners: {stdout: expect.any(Function)}
            }
        )
        expect(output).toBe('')
    })

    test(`getCurrentRepoTreeHash uses git CLI to return the latest tree hash of the root of the repo`, async () => {
        mockedExec.mockResolvedValue(0)
        const output = await utils.getCurrentRepoTreeHash()
        expect(mockedExec).toHaveBeenCalledWith('git rev-parse', ['HEAD:'], {
            listeners: {stdout: expect.any(Function)}
        })
        expect(output).toBe('')
    })

    test(`writeLineToFile creates a file using a shell script`, async () => {
        mockedExec.mockResolvedValue(0)
        await utils.writeLineToFile({path: '/some/file', text: 'hello world'})
        expect(mockedExec).toHaveBeenCalledWith(`/bin/bash -c "echo hello world > /some/file"`)
    })

    describe('S3 Utils', () => {
        test(`fileExistsInS3 uses AWS CLI to check for of an object in S3 bucket, returns true if it exists`, async () => {
            mockedExec.mockResolvedValue(0)
            const output = await utils.fileExistsInS3({
                key: 'my/key',
                bucket: 'my-bucket',
                awsOptions
            })
            expect(mockedExec).toHaveBeenCalledWith(
                'aws s3api head-object',
                ['--bucket=my-bucket', '--key=my/key'],
                {env: utils.toAWSEnvironmentVariables(awsOptions)}
            )
            expect(output).toBe(true)
        })

        test(`fileExistsInS3 uses AWS CLI to check for of an object in S3 bucket, returns true if it exists`, async () => {
            mockedExec.mockRejectedValue(255)
            const output = await utils.fileExistsInS3({
                key: 'my/key',
                bucket: 'my-bucket',
                awsOptions
            })
            expect(mockedExec).toHaveBeenCalledWith(
                'aws s3api head-object',
                ['--bucket=my-bucket', '--key=my/key'],
                {env: utils.toAWSEnvironmentVariables(awsOptions)}
            )
            expect(output).toBe(false)
        })

        test(`copyFileToS3 uses AWS CLI to copy a local file to S3 bucket`, async () => {
            mockedExec.mockResolvedValue(0)
            await utils.copyFileToS3({
                path: '/some/file',
                key: 'my/key',
                bucket: 'my-bucket',
                awsOptions
            })
            expect(mockedExec).toHaveBeenCalledWith(
                'aws s3 cp',
                ['/some/file', 's3://my-bucket/my/key'],
                {env: utils.toAWSEnvironmentVariables(awsOptions)}
            )
        })
    })
})
