const STORAGE_KEY = 'workflow-builder:v1';

export async function saveWorkflow(nodes, edges) {
  await new Promise((r) => setTimeout(r, 200)); 
  const payload = { nodes, edges, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export async function loadWorkflow() {
  await new Promise((r) => setTimeout(r, 200));
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.nodes && parsed?.edges) return parsed;
  } catch (e) {
    console.warn('Failed to parse saved workflow', e);
  }
  return null;
}
