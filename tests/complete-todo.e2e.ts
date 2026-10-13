import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { seedTodos } from './support/seed';

test('completes a todo', async ({ app, agent, screen, browser }) => {
  await seedTodos(browser, [{ title: 'Water plants' }]);
  await app.open('/todos');
  await agent.act('mark "Water plants" as done');
  await expect(screen.getByRole('status', 'Remaining')).toHaveText('0 remaining');
});

test('reopens a todo', async ({ app, agent, screen, browser }) => {
  await seedTodos(browser, [{ title: 'Water plants', completed: true }]);
  await app.open('/todos');
  await agent.act('mark "Water plants" as not done');
  await expect(screen.getByRole('status', 'Remaining')).toHaveText('1 remaining');
});
