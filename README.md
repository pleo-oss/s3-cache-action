<h1 align="center">
  🪣 ♻️ S3 Cache Action
</h1>

| First Run, Cold Cache                                                                                                                                                                                       | Next Run, Cache Hit                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img width="500" alt="On the first run, the action reports no cache and the long task is done." src="https://user-images.githubusercontent.com/4643658/180269038-9f896490-619f-4fd8-b801-af01b62b1981.png"> | <img width="500" alt="On the next run, the action reports cache hit, and the long task is skipped" src="https://user-images.githubusercontent.com/4643658/180269047-417226dd-ce8f-41a6-92ee-e6ed7d279cb6.png"> |

<!-- action-docs-description -->

## Description

Allows to skip a job if it already succeeded for the same repo state. Uses S3 for caching. It works
workflow runs on different branches, which is not currently possible using
[`actions/cache`](https://github.com/actions/cache).

<!-- action-docs-description -->

It will save a `cache/${repoOwner}/${repoName}/${keyPrefix}/${treeHash}` file in S3 where `treeHash`
is the current root git repo tree SHA-1 hash (i.e. the output of `git rev-parse HEAD:`). If the job
is ran with the same state of the repository after succeeding once, you can avoid any work by
checking the `processed` output of this action which will be set to `true`. This allows to e.g.
safely skip work after merging to the main branch, if the code was tested/linted/built on a feature
branch already.

Since GitHub Actions do not yet support early exits from jobs, you'll need to check the value of the
`processed` output of this action for every step in the job that you want to avoid.

Note that the action assumes that the AWS credentials have already been configured for the job, and
allow to read and write to the S3 bucket provided as input. Use the
`aws-actions/configure-aws-credentials` action in a step prior to running this action to ensure
that's the case.

<!-- action-docs-inputs -->

## Inputs

| parameter   | description                                                                                                                                                                 | required | default           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| bucket_name | Name of the S3 bucket to use for storing cache files. The job needs to have AWS credentials configured to allow read/write from this bucket.                                | `true`   |                   |
| key_prefix  | Key prefix to add to the cache files key. By default the job ID is used. The full key used for the cache files is "cache/${repoOwner}/${repoName}/${keyPrefix}/${treeHash}" | `false`  | ${{ github.job }} |

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

## Outputs

| parameter | description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| processed | Indicates if the job has already been performed for the current repo tree hash |
| hash      | The repo tree hash which was used for caching                                  |

<!-- action-docs-outputs -->

## Example Use

```yaml
- uses: aws-actions/configure-aws-credentials@v1
  with:
      # See aws-actions/configure-aws-credentials docs
- uses: pleo-oss/s3-cache-action@v1
  id: s3-cache
  with:
      bucket_name: my-s3-bucket
- run: make very-long-lint
  if: steps.s3-cache.outputs.processed == 'false'
- run: make very-long-test
  if: steps.s3-cache.outputs.processed == 'false'
```

<!-- action-docs-runs -->

## Runs

This action is a `node16` action.

<!-- action-docs-runs -->
