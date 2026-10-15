import { Suspense } from 'react'
import { hasWebGL } from '../../hooks/useWebGL'
import ErrorBoundary from './ErrorBoundary'
// Wraps any Canvas: WebGL check, error boundary, loading fallback.
export default function SceneFrame({ children, fallback }) {
  const nofx = <div className="absolute inset-0 grid place-items-center text-center p-6 text-slate-300 bg-midnight">{fallback || "Bu qurilmada 3D ko'rinish mavjud emas. Ma'lumotlar to'liq mavjud."}</div>
  if (!hasWebGL()) return nofx
  return <ErrorBoundary label="3D sahna yuklanmadi."><Suspense fallback={<div className="absolute inset-0 grid place-items-center text-slate-400">Sahna yuklanmoqda…</div>}>{children}</Suspense></ErrorBoundary>
}
