export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export function fail(error: string): { ok: false; error: string } {
  return { ok: false, error }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong."
}

/** Reads a trimmed string field and enforces a max length. */
export function readText(
  formData: FormData,
  name: string,
  { label, max, required }: { label: string; max: number; required?: boolean }
): { ok: true; value: string } | { ok: false; error: string } {
  const value = String(formData.get(name) ?? "").trim()
  if (required && !value) return fail(`${label} is required.`)
  if (value.length > max)
    return fail(`${label} must be at most ${max} characters.`)
  return { ok: true, value }
}
