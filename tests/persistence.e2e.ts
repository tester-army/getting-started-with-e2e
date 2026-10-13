import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('todos survive a reload', async ({ app, agent, screen, browser }) => {
  await app.open('/todos');
  await agent.act('add a todo titled "Water plants"');
  await expect(screen.getByRole('checkbox', 'Water plants')).toBeVisible();
  await browser.reload();
  await expect(screen.getByRole('checkbox', 'Water plants')).toBeVisible();
});
