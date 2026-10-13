import type { Browser } from '@e2e-dev/web';

type Seed = { title: string; completed?: boolean };

/** Seeds localStorage before the app loads; reloads keep what the app wrote. */
export async function seedTodos(browser: Browser, todos: Seed[]) {
  const json = JSON.stringify(
    todos.map((t, i) => ({ id: `seed-${i}`, description: '', completed: false, ...t })),
  );
  await browser.addInitScript((data: string) => {
    try {
      if (localStorage.getItem('todos') === null) localStorage.setItem('todos', data);
    } catch {} // about:blank and opaque frames have no storage
  }, json);
}
