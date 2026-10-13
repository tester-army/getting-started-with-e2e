import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('root redirects to /todos', async ({ app, browser }) => {
  await app.open('/');
  await expect(browser).toHaveURL('/todos');
});

test('shows the empty state', async ({ app, screen }) => {
  await app.open('/todos');
  await expect(screen.getByText('No todos yet. Add one above to get started.')).toBeVisible();
});
