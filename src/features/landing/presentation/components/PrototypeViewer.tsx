import { useEffect, useRef, useState } from 'react'
import { Box3, Color, DirectionalLight, FrontSide, HemisphereLight, Mesh, MeshPhysicalMaterial, PerspectiveCamera, PMREMGenerator, Scene, Sphere, Texture, Vector3, WebGLRenderer, NeutralToneMapping } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { LoaderCircle, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

function disposeModel(scene: Scene | import('three').Group) {
  scene.traverse(object => {
    if (!(object instanceof Mesh)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach(material => {
      Object.values(material).forEach(value => { if (value instanceof Texture) value.dispose() })
      material.dispose()
    })
  })
}

export default function PrototypeViewer() {
  const mount = useRef<HTMLDivElement>(null)
  const actions = useRef<{ reset: () => void; zoom: (factor: number) => void; rotate: (value: boolean) => void } | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [progress, setProgress] = useState(0)
  const [rotating, setRotating] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const host = mount.current!
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    } catch {
      queueMicrotask(() => setStatus('error'))
      return
    }
    let disposed = false
    let visible = true
    const scene = new Scene()
    scene.background = new Color('#171b1a')
    renderer.toneMapping = NeutralToneMapping
    renderer.toneMappingExposure = 0.85
    host.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.setAttribute('aria-label', 'Modelo 3D de Nich-Ká. Usa los controles para girar y acercar la vista.')
    const camera = new PerspectiveCamera(32, 1, 0.01, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.autoRotateSpeed = 0.7
    const room = new RoomEnvironment()
    const pmrem = new PMREMGenerator(renderer)
    const environment = pmrem.fromScene(room)
    scene.environment = environment.texture
    scene.environmentIntensity = 0.3
    room.dispose()
    pmrem.dispose()
    scene.add(new HemisphereLight(0xffffff, 0x737373, 1))
    const key = new DirectionalLight(0xffffff, 2.2)
    key.position.set(-3, 5, 5)
    scene.add(key)
    let radius = 1
    let loaded = false
    const framePoints: Vector3[] = []
    const direction = new Vector3(0.12, 0.22, 1).normalize()
    const reset = () => {
      // Fit the actual mesh bounds in camera space, rather than a loose sphere.
      // Keep a small margin on all sides, including narrow mobile viewports.
      camera.position.copy(direction)
      camera.lookAt(0, 0, 0)
      const inverseRotation = camera.quaternion.clone().invert()
      const viewPoints = framePoints.map(point => point.clone().applyQuaternion(inverseRotation))
      const viewCenter = new Box3().setFromPoints(viewPoints).getCenter(new Vector3())
      const target = viewCenter.clone().applyQuaternion(camera.quaternion)
      const tanVertical = Math.tan(camera.fov * Math.PI / 360)
      const tanHorizontal = tanVertical * camera.aspect
      let distance = radius
      for (const point of viewPoints) {
        point.sub(viewCenter)
        distance = Math.max(distance, point.z + Math.abs(point.x) / (tanHorizontal * 0.94), point.z + Math.abs(point.y) / (tanVertical * 0.94))
      }
      camera.position.copy(target).addScaledVector(direction, distance)
      camera.near = radius / 100
      camera.far = distance * 30
      camera.updateProjectionMatrix()
      controls.target.copy(target)
      controls.minDistance = radius * 1.15
      controls.maxDistance = distance * 3
      controls.update()
    }
    const resize = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      // Supersampling also sharpens fine edges on standard (1×) displays.
      // Bound the pixel budget to avoid oversized GPU buffers on large screens.
      const pixelRatio = Math.min(Math.max(window.devicePixelRatio, 2), 3, Math.sqrt(8_000_000 / (width * height)), renderer.capabilities.maxTextureSize / Math.max(width, height))
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      if (loaded) reset()
    })
    resize.observe(host)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    intersection.observe(host)
    const onContextLost = (event: Event) => {
      event.preventDefault()
      setStatus('error')
    }
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    new GLTFLoader().load('/assets/model/nichka.glb', gltf => {
      if (disposed) { disposeModel(gltf.scene); return }
      const bounds = new Box3().setFromObject(gltf.scene)
      radius = Math.max(bounds.getBoundingSphere(new Sphere()).radius, 0.01)
      gltf.scene.position.sub(bounds.getCenter(new Vector3()))
      scene.add(gltf.scene)
      gltf.scene.updateMatrixWorld(true)
      gltf.scene.traverse(object => {
        if (!(object instanceof Mesh)) return
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        for (const material of materials) {
          // A clear inspection shell keeps the internals legible, like the
          // Blender reference, without the blurred screen-space refraction.
          if (material instanceof MeshPhysicalMaterial && material.name === 'NichKa_Clear_Acrylic') {
            material.transmission = 0
            material.transparent = true
            material.opacity = 0.16
            material.depthWrite = false
            material.side = FrontSide
            material.roughness = 0.25
            material.envMapIntensity = 0.15
            material.needsUpdate = true
          }
        }
        object.geometry.computeBoundingBox()
        const box = object.geometry.boundingBox!
        for (const x of [box.min.x, box.max.x]) {
          for (const y of [box.min.y, box.max.y]) {
            for (const z of [box.min.z, box.max.z]) {
              framePoints.push(new Vector3(x, y, z).applyMatrix4(object.matrixWorld))
            }
          }
        }
      })
      loaded = true
      reset()
      setStatus('ready')
    }, event => {
      if (!disposed && event.total) setProgress(Math.round(event.loaded / event.total * 100))
    }, () => { if (!disposed) setStatus('error') })
    actions.current = {
      reset,
      rotate: value => { controls.autoRotate = value },
      zoom: factor => {
        camera.position.sub(controls.target).multiplyScalar(factor).clampLength(controls.minDistance, controls.maxDistance).add(controls.target)
        controls.update()
      },
    }
    let previous = 0
    renderer.setAnimationLoop(time => {
      const delta = Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (!visible || document.hidden) return
      controls.update(delta)
      renderer.render(scene, camera)
    })
    return () => {
      disposed = true
      actions.current = null
      renderer.setAnimationLoop(null)
      resize.disconnect()
      intersection.disconnect()
      controls.dispose()
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      disposeModel(scene)
      environment.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [attempt])

  const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-neutral-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-green-400 disabled:opacity-40'
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111514]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <span className="text-sm font-medium">Nich-Ká <span className="ml-2 text-neutral-500">/ Prototipo</span></span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Explorador 3D</span>
      </div>
      <div className="relative">
        <div ref={mount} className="h-[60svh] min-h-105 w-full sm:h-[76svh] sm:min-h-160" />
        {status !== 'ready' && <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#171b1a] px-6 text-center" role="status" aria-live="polite">
          {status === 'loading' ? <><LoaderCircle className="animate-spin text-green-400" /><p className="text-sm text-neutral-300">Preparando el prototipo{progress > 0 && progress < 100 ? ` · ${progress}%` : '…'}</p></> : <><p className="text-sm text-neutral-300">No se pudo mostrar el modelo 3D. Revisa tu conexión y que tu navegador permita WebGL.</p><button className={buttonClass} onClick={() => { setStatus('loading'); setProgress(0); setRotating(false); setAttempt(value => value + 1) }}>Volver a intentar</button></>}
        </div>}
      </div>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:flex-row">
        <p className="text-xs leading-relaxed text-neutral-400">Arrastra para girar · Usa la rueda o pellizca para acercar</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button className={buttonClass} disabled={status !== 'ready'} aria-label="Alejar" onClick={() => actions.current?.zoom(1.2)}><ZoomOut size={16} /></button>
          <button className={buttonClass} disabled={status !== 'ready'} aria-label="Acercar" onClick={() => actions.current?.zoom(1 / 1.2)}><ZoomIn size={16} /></button>
          <button className={buttonClass} disabled={status !== 'ready'} aria-pressed={rotating} onClick={() => { actions.current?.rotate(!rotating); setRotating(!rotating) }}>{rotating ? <Pause size={14} /> : <Play size={14} />}{rotating ? 'Pausar' : 'Girar'}</button>
          <button className={buttonClass} disabled={status !== 'ready'} onClick={() => { actions.current?.rotate(false); setRotating(false); actions.current?.reset() }}><RotateCcw size={14} />Restablecer</button>
        </div>
      </div>
    </div>
  )
}
