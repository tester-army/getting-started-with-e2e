import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { seedTodos } from './support/seed';

test('deletes a todo', async ({ app, agent, screen, browser }) => {
  await seedTodos(browser, [{ title: 'Water plants' }, { title: 'Pay rent' }]);
  await app.open('/todos');
  await agent.act('delete "Water plants"');
  await expect(screen.getByRole('listitem')).toHaveText(['Pay rent']);
});
