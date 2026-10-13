import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { seedTodos } from './support/seed';

describe('filter todos', () => {
  beforeEach(async ({ app, browser }) => {
    await seedTodos(browser, [{ title: 'Water plants' }, { title: 'Pay rent', completed: true }]);
    await app.open('/todos');
  });

  test('Open tab', async ({ agent, screen }) => {
    await agent.act('show only open todos');
    await expect(screen.getByRole('listitem')).toHaveText(['Water plants']);
  });

  test('Done tab', async ({ agent, screen }) => {
    await agent.act('show only done todos');
    await expect(screen.getByRole('listitem')).toHaveText(['Pay rent']);
  });
});
