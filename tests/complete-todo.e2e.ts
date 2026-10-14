import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('completes and reopens a todo', async ({ app, agent, screen }) => {
  await app.open('/todos');
  await agent.act('add a todo titled "Water plants"');
  await expect(screen.getByRole('status', 'Remaining')).toHaveText('1 remaining');
  await agent.assert('"Water plants" is listed with an unchecked checkbox');

  await agent.act('mark "Water plants" as done');
  await expect(screen.getByRole('status', 'Remaining')).toHaveText('0 remaining');
  await agent.assert('"Water plants" is checked and its title is struck through and dimmed', {
    vision: true,
  });

  await agent.act('mark "Water plants" as not done');
  await expect(screen.getByRole('status', 'Remaining')).toHaveText('1 remaining');
  await agent.assert('"Water plants" is unchecked and its title is no longer struck through', {
    vision: true,
  });
});
