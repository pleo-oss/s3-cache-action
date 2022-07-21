import {stripIndents as strip} from 'common-tags'
import {restoreS3Cache} from './restore'
import * as utils from './utils'

jest.mock('./utils')
const mockedUtils = jest.mocked(utils, true)

beforeEach(() => jest.clearAllMocks())

describe(`S3 Cache Action - Restore cache`, () => {
    test(
        strip`
        When a cache file in S3 doesn't exists
        Then it should return a "false" processed flag
        And it should return the S3 key and tree hash used 
        `,
        async () => {
            const treeHash = 'b017ebdf289ba78787da4e9c3291f0b7959e7059'
            mockedUtils.getCurrentRepoTreeHash.mockResolvedValue(treeHash)
            mockedUtils.fileExistsInS3.mockResolvedValue(false)

            const output = await restoreS3Cache({
                bucket: 'my-bucket',
                keyPrefix: 'horse',
                repo: {owner: 'my-org', repo: 'my-repo'}
            })

            expect(output.key).toBe(`cache/my-org/my-repo/horse/${treeHash}`)
            expect(output.processed).toBe(false)
            expect(output.treeHash).toBe(treeHash)

            expect(mockedUtils.fileExistsInS3).toHaveBeenCalledTimes(1)
            expect(mockedUtils.fileExistsInS3).toHaveBeenCalledWith({
                bucket: 'my-bucket',
                key: `cache/my-org/my-repo/horse/${treeHash}`
            })
        }
    )

    test(
        strip`
        When a cache file in S3 already exists
        Then it should return a "true" processed flag
        And it should return the S3 key and tree hash used
        `,
        async () => {
            const treeHash = 'cba2d570993b9c21e3de282e5ba56d1638fb32de'
            mockedUtils.getCurrentRepoTreeHash.mockResolvedValue(treeHash)
            mockedUtils.fileExistsInS3.mockResolvedValue(true)

            const output = await restoreS3Cache({
                bucket: 'my-other-bucket',
                keyPrefix: 'horse',
                repo: {owner: 'my-org', repo: 'my-repo'}
            })

            expect(output.key).toBe(`cache/my-org/my-repo/horse/${treeHash}`)
            expect(output.processed).toBe(true)
            expect(output.treeHash).toBe(treeHash)

            expect(mockedUtils.fileExistsInS3).toHaveBeenCalledTimes(1)
            expect(mockedUtils.fileExistsInS3).toHaveBeenCalledWith({
                bucket: 'my-other-bucket',
                key: `cache/my-org/my-repo/horse/${treeHash}`
            })
        }
    )
})
