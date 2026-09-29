import { useEffect, useRef } from 'react'

// Adapted from the React Bits Grainient shader supplied with this project.
const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uGrainAmount;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackground;
uniform float uTint;
out vec4 fragColor;
mat2 Rot(float a) { float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }
float ribbon(vec2 p, vec2 center, float angle, float width, float length, float phase) {
  vec2 q=(p-center)*Rot(radians(angle));
  float curve=q.y+0.025*sin(q.x*7.0+phase);
  float core=exp(-pow(curve/width,2.0));
  float haze=exp(-pow(curve/(width*1.75),2.0));
  return (core*0.7+haze*0.3)*exp(-pow(q.x/length,4.0));
}
vec3 tone(vec3 color) { return clamp((color-0.5)*1.3+0.5,0.0,1.0); }
void main() {
  float t=iTime*0.2;
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec2 p=uv-0.5;
  float ribbon1=ribbon(p,vec2(-0.27+0.025*sin(t*0.7),0.23+0.015*cos(t*0.5)),-18.0,0.014,0.38,t*0.35);
  float ribbon2=ribbon(p,vec2(0.24+0.02*cos(t*0.6),-0.07+0.02*sin(t*0.4)),22.0,0.016,0.38,t*0.28+2.0);
  float ribbon3=ribbon(p,vec2(-0.13+0.02*sin(t*0.5),-0.38+0.015*cos(t*0.7)),-12.0,0.012,0.34,t*0.24+4.0);
  vec3 col=uBackground;
  col=mix(col,tone(uColor1),clamp(ribbon1*uTint,0.0,1.0));
  col=mix(col,tone(uColor2),clamp(ribbon2*uTint,0.0,1.0));
  col=mix(col,tone(uColor3),clamp(ribbon3*uTint,0.0,1.0));
  vec2 grainUv=uv*2.0;
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  float texture=0.15+0.85*max(max(ribbon1,ribbon2),ribbon3);
  fragColor=vec4(clamp(col+(grain-0.5)*uGrainAmount*texture,0.0,1.0),1.0);
}
`

function hexRgb(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim())
  return match ? [1, 3, 5].map((offset) => parseInt(match[1].slice(offset - 1, offset + 1), 16) / 255) : [0, 0, 0]
}

function themeColors() {
  const root = document.documentElement
  const style = getComputedStyle(root)
  const bg = hexRgb(style.getPropertyValue('--bg'))
  const strength = parseFloat(style.getPropertyValue('--wash-tint'))
  const tint = Number.isFinite(strength) ? strength / 100 : 0.65
  const washes = [1, 2, 3].map((number) => hexRgb(style.getPropertyValue(`--wash-${number}`)))
  return { bg, tint, washes }
}

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Grainient shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function Grainient({ grainEnabled, motionEnabled }) {
  const canvasRef = useRef(null)
  const controllerRef = useRef(null)
  const initialOptionsRef = useRef({ grainEnabled, motionEnabled })

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: true })
    if (!gl) return
    const vertexShader = compile(gl, gl.VERTEX_SHADER, vertex)
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment)
    if (!vertexShader || !fragmentShader) return
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Grainient program error:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return
    }
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = Object.fromEntries(['iResolution', 'iTime', 'uGrainAmount', 'uColor1', 'uColor2', 'uColor3', 'uBackground', 'uTint']
      .map((name) => [name, gl.getUniformLocation(program, name)]))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let elapsed = 0
    let lastTick = 0
    let options = initialOptionsRef.current
    let colors = themeColors()

    function render() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
      gl.uniform2f(uniform.iResolution, width, height)
      gl.uniform1f(uniform.iTime, elapsed)
      gl.uniform1f(uniform.uGrainAmount, options.grainEnabled ? 0.04 : 0)
      colors.washes.forEach((color, index) => gl.uniform3fv(uniform[`uColor${index + 1}`], color))
      gl.uniform3fv(uniform.uBackground, colors.bg)
      gl.uniform1f(uniform.uTint, colors.tint)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      canvas.classList.add('grainient-ready')
    }

    function tick(now) {
      if (!frame) return
      frame = requestAnimationFrame(tick)
      if (lastTick && now - lastTick < 32) return
      if (lastTick) elapsed += Math.min((now - lastTick) / 1000, 0.1)
      lastTick = now
      render()
    }

    function update() {
      const shouldMove = options.motionEnabled && !reducedMotion.matches && !document.hidden
      if (shouldMove && !frame) {
        lastTick = 0
        frame = requestAnimationFrame(tick)
      } else if (!shouldMove && frame) {
        cancelAnimationFrame(frame)
        frame = 0
        lastTick = 0
      }
      render()
    }

    controllerRef.current = (next) => { options = next; update() }
    const resize = new ResizeObserver(render)
    resize.observe(canvas)
    const themeObserver = new MutationObserver(() => { colors = themeColors(); render() })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] })
    reducedMotion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      themeObserver.disconnect()
      reducedMotion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      controllerRef.current = null
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  useEffect(() => {
    controllerRef.current?.({ grainEnabled, motionEnabled })
  }, [grainEnabled, motionEnabled])

  return <canvas className="grainient" ref={canvasRef} aria-hidden="true" />
}
