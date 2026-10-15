import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { isMobile } from '../../hooks/useWebGL'
export default function Starfield({ count }) {
  const n = count ?? (isMobile() ? 1500 : 5000)
  const ref = useRef()
  const pos = useMemo(() => {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 300 + Math.random() * 500, t = Math.random() * 6.283, p = Math.acos(2 * Math.random() - 1)
      a.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)], i * 3)
    }
    return a
  }, [n])
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.004 })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={n} itemSize={3}/></bufferGeometry>
    <pointsMaterial size={1.6} sizeAttenuation={false} color="#cfe0ff" transparent opacity={.85} depthWrite={false}/></points>
}
