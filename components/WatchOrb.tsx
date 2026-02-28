'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WatchOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.clientWidth || 256
    const h = canvas.clientHeight || 256

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50)
    camera.position.z = 5

    // Outer ring (watch bezel)
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.06, 16, 120),
      new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      })
    )
    scene.add(outerRing)

    // Inner ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.025, 12, 100),
      new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      })
    )
    scene.add(innerRing)

    // Watch face (thin disc)
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(1.18, 64),
      new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
      })
    )
    face.position.z = -0.01
    scene.add(face)

    // Hour tick marks
    const tickGroup = new THREE.Group()
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const isHour = i % 3 === 0
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(isHour ? 0.035 : 0.018, isHour ? 0.18 : 0.1, 0.01),
        new THREE.MeshStandardMaterial({
          color: isHour ? 0x00d4ff : 0x446677,
          emissive: isHour ? 0x00d4ff : 0x224455,
          emissiveIntensity: isHour ? 0.9 : 0.3,
        })
      )
      tick.position.set(Math.sin(angle) * 1.0, Math.cos(angle) * 1.0, 0.02)
      tick.rotation.z = -angle
      tickGroup.add(tick)
    }
    scene.add(tickGroup)

    // Center dot
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 1.2,
      })
    )
    scene.add(center)

    // Clock hands
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.55, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 })
    )
    hourHand.position.set(0, 0.275, 0.04)
    scene.add(hourHand)

    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.78, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.7 })
    )
    minuteHand.position.set(0, 0.39, 0.05)
    scene.add(minuteHand)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)
    const point = new THREE.PointLight(0x00d4ff, 1.5, 10)
    point.position.set(2, 2, 3)
    scene.add(point)
    const point2 = new THREE.PointLight(0x7c3aed, 0.8, 8)
    point2.position.set(-2, -1, 2)
    scene.add(point2)

    // Resize observer
    const ro = new ResizeObserver(() => {
      const nw = canvas.clientWidth
      const nh = canvas.clientHeight
      if (nw && nh) {
        renderer.setSize(nw, nh)
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
      }
    })
    ro.observe(canvas)

    // Animation
    let rafId: number
    const clock = new THREE.Clock()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Slow Y-axis tilt rotation
      outerRing.rotation.y = t * 0.3
      innerRing.rotation.y = -t * 0.2
      innerRing.rotation.x = Math.sin(t * 0.4) * 0.15

      // Clock hand rotation (decorative, not real time)
      const hourAngle = -t * 0.05
      const minuteAngle = -t * 0.6
      hourHand.rotation.z = hourAngle
      hourHand.position.set(
        Math.sin(hourAngle) * 0.275,
        Math.cos(hourAngle) * 0.275,
        0.04
      )
      minuteHand.rotation.z = minuteAngle
      minuteHand.position.set(
        Math.sin(minuteAngle) * 0.39,
        Math.cos(minuteAngle) * 0.39,
        0.05
      )

      // Gentle float
      scene.position.y = Math.sin(t * 0.8) * 0.06

      // Pulsing glow
      const glow = 0.7 + Math.sin(t * 1.5) * 0.2
      ;(outerRing.material as THREE.MeshStandardMaterial).emissiveIntensity = glow

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
