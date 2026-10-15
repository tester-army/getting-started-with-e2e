# Getting Started with Agentic e2e

The example project for the **"Getting Started with Agentic e2e"** video on the
TesterArmy YouTube channel.

It's a small Next.js todo app with an end-to-end test suite written with
[e2e](https://github.com/tester-army/e2e). An AI agent drives the browser from
plain-English goals (`agent.act`) and checks results (`agent.assert`).
Playwright-style `expect` assertions pin down the exact values.

```ts
test('deletes a todo', async ({ app, agent, screen }) => {
  await app.open('/todos');

  await agent.act('add todos titled "Water plants" and "Pay rent"');
  await expect(screen.getByRole('listitem')).toHaveCount(2);
  await agent.assert('the list shows "Water plants" and "Pay rent"');

  await agent.act('delete "Water plants"');
  await expect(screen.getByRole('listitem')).toHaveText(['Pay rent']);
});
```

## What's inside

| Path | What it is |
| --- | --- |
| `app/todos/page.tsx`, `components/todos/todo-app.tsx` | The app under test: add, complete, and delete todos. State lives in memory, so every page load starts empty. |
| `e2e.config.ts` | e2e config: the browser engine, the app URL, and the model behind the agent |
| `tests/example.e2e.ts` | A smoke test with no AI, plus a commented-out agent template |
| `tests/create-todo.e2e.ts` | The agent adds several todos, then judges the page visually |
| `tests/delete-todo.e2e.ts` | Agent steps combined with exact `expect` assertions |
| `.agents/skills/e2e` | The e2e skill, so coding agents (Claude Code, Cursor, OpenCode, ...) know how to write and fix these tests |

## Prerequisites

- Node.js 20 or newer
- A [Vercel AI Gateway](https://vercel.com/ai-gateway) API key. Only the tests
  that use `agent.*` steps need it.

## Quick start

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/kacperkapusciak/getting-started-with-e2e.git
   cd getting-started-with-e2e
   npm install
   ```

   Chromium downloads automatically the first time you run the tests. In CI,
   install it ahead of time with
   `npx @e2e-dev/web install chromium --with-deps`.

2. Give the agent access to a model. Add your key to `.env.local` or export it
   in your shell:

   ```bash
   export AI_GATEWAY_API_KEY=your-key
   ```

   Alternatively, sign in to the Vercel CLI and run `npx vercel link`. Without a
   key, `gateway()` uses the project's Vercel OIDC token.

3. Start the app in one terminal:

   ```bash
   npm run dev
   ```

   It runs at [http://localhost:3000](http://localhost:3000). To test a
   different URL, set `APP_URL`.

4. Run the tests in a second terminal:

   ```bash
   npm run test:e2e
   ```

## Useful commands

```bash
npx e2e run tests/delete-todo.e2e.ts   # run one file
npx e2e run --headed                   # watch the browser while the agent works
npx e2e run --last-failed              # rerun only what failed last time
npx e2e run --no-cache                 # skip the replay cache and call the model for every step
npx e2e guide                          # built-in docs (try: npx e2e guide writing-tests)
```

> With npm scripts, use `npm exec -- e2e run --headed` to pass flags through.
> `npm run test:e2e --headed` doesn't forward them.

## Things to know

- **Replay cache:** after an `agent.act` step passes and its outcome is
  checked, e2e records the actions in `.e2e/cache/`. Later runs replay them
  without calling the model, so they're faster and cheaper. `agent.assert`,
  `agent.waitFor`, and `agent.extract` always run live. Delete `.e2e/cache/`
  or pass `--no-cache` to start fresh.
- **Results:** each failed test gets a trace page at
  `.e2e/results/<test>/trace.md`. It lists every step, what the agent did, and
  the screen at the moment of failure. The full run summary is in
  `.e2e/report.json`.
- **Starting the app automatically:** uncomment the `command` line in
  `e2e.config.ts` and the runner starts `npm run dev` for you.

## Add e2e to your own project

```bash
npx e2e init
```

The wizard picks the browser engine and model provider. It writes
`e2e.config.ts` and an example test, and can install the agent skill and MCP
server for your coding agent.

## Learn more

- [e2e on GitHub](https://github.com/tester-army/e2e), with example projects
  for Vite, Next.js, Astro, Expo, SwiftUI, Flutter, and more
- `node_modules/e2e/docs` has the full documentation for the installed version
