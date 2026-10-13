import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { seedTodos } from './support/seed';

test('clears done todos', async ({ app, agent, screen, browser }) => {
  await seedTodos(browser, [{ title: 'Water plants' }, { title: 'Pay rent', completed: true }]);
  await app.open('/todos');
  await agent.act('clear done todos');
  await expect(screen.getByRole('listitem')).toHaveText(['Water plants']);
});
