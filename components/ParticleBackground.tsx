'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 180
const CONNECTION_DISTANCE = 2.2
const MOUSE_INFLUENCE = 0.6

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // Scene / Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 8

    // Particles
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: THREE.Vector3[] = []
    const basePositions: THREE.Vector3[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 16
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 4
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      basePositions.push(new THREE.Vector3(x, y, z))
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        )
      )
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Lines between nearby particles
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.12,
    })
    const lineGeo = new THREE.BufferGeometry()
    const maxLines = PARTICLE_COUNT * 3
    const linePositions = new Float32Array(maxLines * 2 * 3)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineSegments)

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let rafId: number
    const posAttr = geo.attributes.position as THREE.BufferAttribute
    const lineAttr = lineGeo.attributes.position as THREE.BufferAttribute

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const base = basePositions[i]
        const vel = velocities[i]

        base.x += vel.x
        base.y += vel.y
        base.z += vel.z

        // Wrap edges
        if (base.x > 8) base.x = -8
        if (base.x < -8) base.x = 8
        if (base.y > 5) base.y = -5
        if (base.y < -5) base.y = 5

        // Mouse influence — particles gently drift toward cursor
        const mx = mouse.current.x * MOUSE_INFLUENCE
        const my = mouse.current.y * MOUSE_INFLUENCE
        const dx = mx - base.x * 0.1
        const dy = my - base.y * 0.1
        base.x += dx * 0.0008
        base.y += dy * 0.0008

        posAttr.setXYZ(i, base.x, base.y, base.z)
      }
      posAttr.needsUpdate = true

      // Recompute lines
      let lineIdx = 0
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < maxLines; i++) {
        const ax = basePositions[i].x
        const ay = basePositions[i].y
        const az = basePositions[i].z
        for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < maxLines; j++) {
          const bx = basePositions[j].x
          const by = basePositions[j].y
          const bz = basePositions[j].z
          const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)
          if (dist < CONNECTION_DISTANCE) {
            lineAttr.setXYZ(lineIdx * 2, ax, ay, az)
            lineAttr.setXYZ(lineIdx * 2 + 1, bx, by, bz)
            lineIdx++
          }
        }
      }
      // Zero out unused line slots
      for (let k = lineIdx; k < maxLines; k++) {
        lineAttr.setXYZ(k * 2, 0, 0, 0)
        lineAttr.setXYZ(k * 2 + 1, 0, 0, 0)
      }
      lineAttr.needsUpdate = true
      lineGeo.setDrawRange(0, lineIdx * 2)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
