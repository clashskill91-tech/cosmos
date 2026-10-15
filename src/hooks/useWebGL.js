export function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}
export const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768
