import {stripIndents as strip} from 'common-tags'
import {saveS3Cache} from './save'
import * as utils from './utils'

jest.mock('./utils')
const mockedUtils = jest.mocked(utils, true)

beforeEach(() => jest.clearAllMocks())

describe(`S3 Cache Action - Save cache`, () => {
    test(
        strip`
        When no cache file in S3 exists
        Then it should write the cache file to S3
        `,
        async () => {
            const treeHash = '5948809b966891c558d7c79c0c5c401502f1a466'

            await saveS3Cache({
                bucket: 'my-bucket',
                hash: treeHash,
                key: 'my-org/my-repo/cache/horse'
            })

            expect(mockedUtils.writeLineToFile).toHaveBeenCalledTimes(1)
            expect(mockedUtils.writeLineToFile).toHaveBeenCalledWith({
                text: treeHash,
                path: treeHash
            })

            expect(mockedUtils.copyFileToS3).toHaveBeenCalledTimes(1)
            expect(mockedUtils.copyFileToS3).toHaveBeenCalledWith({
                path: treeHash,
                bucket: 'my-bucket',
                key: 'my-org/my-repo/cache/horse'
            })
        }
    )

    test(
        strip`
        When a cache file in S3 already exists
        Then it should no create any new files
        `,
        async () => {
            await saveS3Cache({
                bucket: 'my-bucket',
                hash: '',
                key: ''
            })

            expect(mockedUtils.writeLineToFile).not.toHaveBeenCalled()
            expect(mockedUtils.copyFileToS3).not.toHaveBeenCalled()
        }
    )
})
