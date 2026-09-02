export function readIdentityLifecycleTokenFragment(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const values = new URLSearchParams(window.location.hash.slice(1)).getAll('token');
  if (values.length !== 1) {
    return null;
  }

  const token = values[0]?.trim();
  return token ? token : null;
}

export function clearIdentityLifecycleTokenFragment(): void {
  if (typeof window === 'undefined' || window.location.hash.length === 0) {
    return;
  }

  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${window.location.search}`,
  );
}
