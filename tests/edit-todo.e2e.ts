import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { seedTodos } from './support/seed';

describe('edit todo', () => {
  beforeEach(async ({ app, agent, browser, screen }) => {
    await seedTodos(browser, [{ title: 'Water plants' }]);
    await app.open('/todos');
    await agent.act('open the edit dialog for "Water plants"');
    await expect(screen.getByRole('dialog')).toBeVisible();
  });

  test('renames a todo', async ({ agent, screen }) => {
    await agent.act('type "Water cacti" into the Title field, replacing its text');
    await expect(screen.getByLabel('Title')).toHaveValue('Water cacti');
    await agent.act('save changes');
    await expect(screen.getByRole('checkbox', 'Water cacti')).toBeVisible();
  });

  test('adds a description', async ({ agent, screen }) => {
    await agent.act('type "Balcony" into the Description field');
    await expect(screen.getByLabel('Description')).toHaveValue('Balcony');
    await agent.act('save changes');
    await expect(screen.getByText('Balcony')).toBeVisible();
  });

  test('cancel discards changes', async ({ agent, screen }) => {
    await agent.act('type "Nope" into the Title field, replacing its text');
    await expect(screen.getByLabel('Title')).toHaveValue('Nope');
    await agent.act('cancel the edit');
    await expect(screen.getByRole('checkbox', 'Water plants')).toBeVisible();
  });

  test('blank title shows an error', async ({ agent, screen }) => {
    await agent.act('replace the Title field text with a single space');
    await expect(screen.getByLabel('Title')).toHaveValue(' ');
    await agent.act('click Save changes; an error is expected');
    await expect(screen.getByRole('alert')).toHaveText('Title is required.');
  });
});
