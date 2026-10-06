import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type OrbitItem = { id: string; title: string };

const cs = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
const LIME = (cs?.getPropertyValue('--lime').trim()) || '#ff4fd8';
const ACC = (cs?.getPropertyValue('--acc-rgb').trim()) || '255,79,216';
const VIO = (cs?.getPropertyValue('--violet').trim()) || '#5b6cff';
const BONE = (cs?.getPropertyValue('--bone').trim()) || '#f4f1fa';
const INK = (cs?.getPropertyValue('--ink').trim()) || '#07050d';
const TAU = Math.PI * 2;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function makeCardTexture(num: string, title: string) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 680;
  const g = c.getContext('2d')!;
  const bg = g.createLinearGradient(0, 0, 0, 680);
  bg.addColorStop(0, INK); bg.addColorStop(1, INK);
  g.fillStyle = bg; g.fillRect(0, 0, 512, 680);
  const glow = g.createRadialGradient(400, 120, 10, 400, 120, 360);
  glow.addColorStop(0, `rgba(${ACC},.35)`); glow.addColorStop(1, `rgba(${ACC},0)`);
  g.fillStyle = glow; g.fillRect(0, 0, 512, 680);
  g.strokeStyle = `rgba(${ACC},.8)`; g.lineWidth = 3; g.strokeRect(14, 14, 484, 652);
  g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 1;
  for (let y = 60; y < 680; y += 28) { g.beginPath(); g.moveTo(14, y); g.lineTo(498, y); g.stroke(); }
  g.fillStyle = LIME; g.font = '600 26px "JetBrains Mono", monospace'; g.fillText(`/ ${num}`, 44, 72);
  g.fillStyle = BONE;
  g.font = '700 82px "Bricolage Grotesque", system-ui, sans-serif';
  const words = title.toUpperCase().split(' ');
  words.forEach((w, i) => g.fillText(w, 40, 440 + i * 84 - (words.length - 1) * 84));
  g.fillStyle = 'rgba(238,238,230,.55)'; g.font = '500 22px "JetBrains Mono", monospace';
  g.fillText('CLICK TO OPEN', 44, 624);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function Card({ index, total, item, selected, hovered, onHover, onSelect, dragged }: {
  index: number; total: number; item: OrbitItem; selected: boolean; hovered: boolean;
  onHover: (i: number | null) => void; onSelect: (i: number) => void; dragged: React.MutableRefObject<number>;
}) {
  const ref = React.useRef<THREE.Mesh>(null);
  const [tex, setTex] = React.useState<THREE.CanvasTexture | null>(null);
  React.useEffect(() => {
    let alive = true; let t: THREE.CanvasTexture | null = null;
    const build = () => { if (!alive) return; t = makeCardTexture(String(index + 1).padStart(2, '0'), item.title); setTex(t); };
    (document.fonts?.ready ?? Promise.resolve()).then(build);
    return () => { alive = false; t?.dispose(); };
  }, [index, item.title]);
  const a = (index / total) * TAU;
  useFrame((state, dt) => {
    const m = ref.current; if (!m) return;
    m.lookAt(state.camera.position);
    const s = THREE.MathUtils.damp(m.scale.x, selected ? 1.28 : hovered ? 1.14 : 1, 8, dt);
    m.scale.setScalar(s);
    m.position.y = THREE.MathUtils.damp(m.position.y, hovered || selected ? 0.18 : Math.sin(a * 2) * 0.08, 6, dt);
  });
  return (
    <mesh ref={ref} position={[Math.sin(a) * 3.4, 0, Math.cos(a) * 3.4]} rotation={[0, a, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(index); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = ''; }}
      onClick={(e) => { e.stopPropagation(); if (dragged.current < 6) onSelect(index); }}>
      <planeGeometry args={[1.7, 2.25]} />
      <meshBasicMaterial map={tex ?? undefined} color={hovered || selected ? '#ffffff' : '#a9aca0'} side={THREE.DoubleSide} toneMapped={false} transparent />
    </mesh>
  );
}

function Core({ hot }: { hot: boolean }) {
  const r1 = React.useRef<THREE.Mesh>(null);
  const r2 = React.useRef<THREE.Mesh>(null);
  const r3 = React.useRef<THREE.Mesh>(null);
  const ico = React.useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const k = hot ? 2.2 : 1;
    if (r1.current) r1.current.rotation.x += dt * 0.6 * k;
    if (r2.current) r2.current.rotation.y += dt * 0.8 * k;
    if (r3.current) r3.current.rotation.z += dt * 0.5 * k;
    if (ico.current) { ico.current.rotation.y += dt * 0.3; ico.current.rotation.x -= dt * 0.2; }
  });
  return (
    <group>
      <mesh ref={ico}><icosahedronGeometry args={[0.8, 1]} /><meshBasicMaterial color={LIME} wireframe transparent opacity={0.9} /></mesh>
      <mesh><sphereGeometry args={[0.46, 32, 32]} /><meshBasicMaterial color={INK} /></mesh>
      <mesh><sphereGeometry args={[0.2, 24, 24]} /><meshBasicMaterial color={LIME} toneMapped={false} /></mesh>
      <mesh ref={r1}><torusGeometry args={[1.25, 0.012, 8, 128]} /><meshBasicMaterial color={BONE} /></mesh>
      <mesh ref={r2} rotation={[1.1, 0, 0]}><torusGeometry args={[1.55, 0.012, 8, 128]} /><meshBasicMaterial color={LIME} /></mesh>
      <mesh ref={r3} rotation={[0, 1.1, 0]}><torusGeometry args={[1.85, 0.01, 8, 128]} /><meshBasicMaterial color={VIO} /></mesh>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const geo = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7, th = Math.random() * TAU, ph = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th); p[i * 3 + 1] = (Math.random() - 0.5) * 7; p[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g;
  }, [count]);
  const ref = React.useRef<THREE.Points>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.02; });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.035} color={LIME} transparent opacity={0.55} sizeAttenuation depthWrite={false} /></points>;
}

function Rig({ items, selected, onSelect }: { items: OrbitItem[]; selected: number | null; onSelect: (i: number | null) => void }) {
  const group = React.useRef<THREE.Group>(null);
  const rot = React.useRef(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const dragged = React.useRef(0);
  const dragging = React.useRef(false);
  const { gl, camera, pointer, size } = useThree();
  const narrow = size.width < 640;
  React.useEffect(() => {
    const el = gl.domElement; let lastX = 0;
    const down = (e: PointerEvent) => { dragging.current = true; dragged.current = 0; lastX = e.clientX; };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX; lastX = e.clientX; dragged.current += Math.abs(dx);
      rot.current += dx * 0.006;
    };
    const up = () => { dragging.current = false; };
    el.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [gl]);
  useFrame((_, dt) => {
    const g = group.current; if (!g) return;
    if (selected !== null && !dragging.current) {
      const target = -((selected / items.length) * TAU);
      rot.current += wrap(target - rot.current) * Math.min(1, dt * 4);
    } else if (!dragging.current && hovered === null) {
      rot.current += dt * 0.18;
    }
    g.rotation.y = rot.current;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.9, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.6 + pointer.y * 0.5, 3, dt);
    camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <group scale={narrow ? 0.68 : 1}>
        <Core hot={hovered !== null || selected !== null} />
        <group ref={group}>
          {items.map((it, i) => (
            <Card key={it.id} index={i} total={items.length} item={it} selected={selected === i} hovered={hovered === i}
              onHover={setHovered} onSelect={(n) => onSelect(selected === n ? null : n)} dragged={dragged} />
          ))}
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
          <ringGeometry args={[3.3, 3.34, 128]} /><meshBasicMaterial color={LIME} transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
          <ringGeometry args={[4.4, 4.42, 128]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      </group>
      <Dust count={narrow ? 160 : 380} />
    </>
  );
}

export default function Orbit3D({ items, selected, onSelect, active }: {
  items: OrbitItem[]; selected: number | null; onSelect: (i: number | null) => void; active: boolean;
}) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0.6, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} style={{ touchAction: 'pan-y' }}>
      <Rig items={items} selected={selected} onSelect={onSelect} />
    </Canvas>
  );
}
