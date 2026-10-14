import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('deletes a todo', async ({ app, agent, screen }) => {
  await app.open('/todos');

  await agent.act('add todos titled "Water plants" and "Pay rent"');
  await expect(screen.getByRole('listitem')).toHaveCount(2);
  await agent.assert('the list shows "Water plants" and "Pay rent"');

  await agent.act('delete "Water plants"');
  await expect(screen.getByRole('listitem')).toHaveText(['Pay rent']);
});
