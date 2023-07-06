# Contributing to Hashdocs

_Based on the calcom contribution guide_

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

- Before jumping into a PR be sure to search existing PRs or issues for an open or closed item that relates to your submission.

## Developing

The development branch is `main`. This is the branch that all pull requests should be made against. 

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch:

   ```sh
   git checkout -b MY_BRANCH_NAME
   ```

3. Install yarn:

   ```sh
   npm install -g yarn
   ```

4. Install the dependencies with:

   ```sh
   yarn
   ```

5. Setup a local development environment for supabase

    - Follow the steps [here](https://supabase.com/docs/guides/getting-started/local-development) to set up a local supabase instance

    Preqrequisites:
    - Docker Desktop
    - Supabase CLI

5. Set up your `.env` file:

   - Duplicate `.env.example` to `.env`.
   - Enter your supabase credentials in the `.env` file.

6. Start developing and watch for code changes:

   ```sh
   yarn dev
   ```

   This will start a local server at `http://localhost:3000` and watch for changes in the code. The server will automatically reload when changes are made.

## Building

You can build the project with:

```bash
yarn build
```

Please be sure that you can make a full production build before pushing code.

## Testing

More info on how to add new tests coming soon.

## Making a Pull Request

- Be sure to [check the "Allow edits from maintainers" option](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) while creating you PR.
- If your PR refers to or fixes an issue, be sure to add `refs #XXX` or `fixes #XXX` to the PR description. Replacing `XXX` with the respective issue number. See more about [Linking a pull request to an issue
  ](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
- Be sure to fill the PR Template accordingly.