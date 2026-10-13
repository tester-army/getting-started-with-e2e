import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('create todo form', () => {
  beforeEach(async ({ app }) => {
    await app.open('/todos');
  });

  test('adds a todo', async ({ agent, screen }) => {
    await agent.act('add a new todo titled {title}', { params: { title: 'Buy milk' } });

    await expect(screen.getByRole('checkbox', 'Buy milk')).toBeVisible();
    await expect(screen.getByRole('status', 'Remaining')).toHaveText('1 remaining');

    await agent.assert('"Buy milk" is in the todo list');
  });

  test('rejects an empty todo', async ({ agent, screen }) => {
    await agent.act('click Add without typing anything');

    await expect(screen.getByText('Enter a todo first.')).toBeVisible();
    await expect(screen.getByRole('listitem')).toHaveCount(0);

    await agent.assert('an error message is shown');
  });
});
