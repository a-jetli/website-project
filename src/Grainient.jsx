import { useEffect, useRef } from 'react'

// React Bits Grainient: original rotation, warp, softness and contrast.
// Changes: theme palette mixed in OKLab, perceptual grain, defined smoothstep.
const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uGrainAmount;
uniform float uGrainSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackground;
uniform float uTint;
out vec4 fragColor;

mat2 Rot(float a) { float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }
vec2 hash(vec2 p) {
  p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);
  return 0.5+0.5*n;
}

// pcg2d integer hash (Jarzynski & Olano): no sin() precision patterns in the grain.
vec2 random2(uvec2 v) {
  v=v*1664525u+1013904223u;
  v.x+=v.y*1664525u; v.y+=v.x*1664525u;
  v^=v>>16u;
  v.x+=v.y*1664525u; v.y+=v.x*1664525u;
  v^=v>>16u;
  return vec2(v)/4294967295.0;
}

vec3 toLinear(vec3 c) { return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c)); }
vec3 toSrgb(vec3 c) { return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c)); }
vec3 oklab(vec3 srgb) {
  vec3 c=toLinear(srgb);
  vec3 lms=pow(vec3(
    dot(c,vec3(0.4122214708,0.5363325363,0.0514459929)),
    dot(c,vec3(0.2119034982,0.6806995451,0.1073969566)),
    dot(c,vec3(0.0883024619,0.2817188376,0.6299787005))),vec3(1.0/3.0));
  return vec3(
    dot(lms,vec3(0.2104542553,0.7936177850,-0.0040720468)),
    dot(lms,vec3(1.9779984951,-2.4285922050,0.4505937099)),
    dot(lms,vec3(0.0259040371,0.7827717662,-0.8086757660)));
}
vec3 srgb(vec3 lab) {
  vec3 lms=vec3(
    dot(lab,vec3(1.0,0.3963377774,0.2158037573)),
    dot(lab,vec3(1.0,-0.1055613458,-0.0638541728)),
    dot(lab,vec3(1.0,-0.0894841775,-1.2914855480)));
  lms*=lms*lms;
  return toSrgb(clamp(vec3(
    dot(lms,vec3(4.0767416621,-3.3077115913,0.2309699292)),
    dot(lms,vec3(-1.2684380046,2.6097574011,-0.3413193965)),
    dot(lms,vec3(-0.0041960863,-0.7034186147,1.7076147010))),0.0,1.0));
}

void main() {
  // Source defaults: speed, zoom, rotation, warp and blend softness.
  float t=iTime*0.25;
  float softness=0.05;
  vec2 uv=gl_FragCoord.xy/iResolution;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=(uv-0.5)/0.9;

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*2.0);
  tuv.y/=ratio;
  tuv*=Rot(radians((degree-0.5)*500.0+180.0));
  tuv.y*=ratio;
  float warpTime=t*2.0;
  tuv.x+=sin(tuv.y*5.0+warpTime)/50.0;
  tuv.y+=sin(tuv.x*7.5+warpTime)/25.0;

  float horizontal=smoothstep(-0.3-softness,0.2+softness,tuv.x);
  // The source reverses smoothstep edges here, which GLSL leaves undefined.
  float vertical=1.0-smoothstep(-0.3-softness,0.5+softness,tuv.y);
  // Blending in OKLab keeps hues clean where bands meet instead of greying out.
  vec3 c1=oklab(uColor1), c2=oklab(uColor2), c3=oklab(uColor3);
  vec3 field=mix(mix(c3,c2,horizontal),mix(c2,c1,horizontal),vertical);

  // Source contrast (1.5x) pivots on the palette's own lightness instead of
  // mid-grey, so dark palettes keep their band depth rather than crushing to black.
  float pivot=(c1.x+c2.x+c3.x)/3.0;
  field.x=pivot+(field.x-pivot)*1.5;
  field.yz*=1.2;
  vec3 lab=mix(oklab(uBackground),field,uTint);

  // Grain on perceptual lightness reads the same on dark and light themes.
  // Two samples give a triangular distribution, closer to film grain.
  vec2 samples=random2(uvec2(gl_FragCoord.xy/uGrainSize));
  float grain=samples.x+samples.y-1.0;
  lab.x+=grain*uGrainAmount;
  fragColor=vec4(srgb(lab),1.0);
}
`

// The CSS minifier shortens colors (#ffffff to #fff, named colors), so let the
// browser normalize any CSS color to #rrggbb.
const colorParser = document.createElement('canvas').getContext('2d')
function rgb(value) {
  colorParser.fillStyle = '#000000'
  colorParser.fillStyle = value.trim()
  const hex = colorParser.fillStyle
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
}

function themeColors() {
  const root = document.documentElement
  const style = getComputedStyle(root)
  const bg = rgb(style.getPropertyValue('--bg'))
  const strength = parseFloat(style.getPropertyValue('--wash-tint'))
  const tint = Number.isFinite(strength) ? strength / 100 : 0.38
  const grain = parseFloat(style.getPropertyValue('--grain-amount'))
  const washes = [1, 2, 3].map((number) => rgb(style.getPropertyValue(`--wash-${number}`)))
  return { bg, tint, grain: Number.isFinite(grain) ? grain : 0.025, washes }
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
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: false })
    if (!gl) return
    const vertexShader = compile(gl, gl.VERTEX_SHADER, vertex)
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, fragment)
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader)
      if (fragmentShader) gl.deleteShader(fragmentShader)
      return
    }
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
    const uniform = Object.fromEntries(['iResolution', 'iTime', 'uGrainAmount', 'uGrainSize', 'uColor1', 'uColor2', 'uColor3', 'uBackground', 'uTint']
      .map((name) => [name, gl.getUniformLocation(program, name)]))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let elapsed = 0
    let lastTick = 0
    let options = initialOptionsRef.current
    let colors = themeColors()

    function render() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      gl.viewport(0, 0, width, height)
      gl.uniform2f(uniform.iResolution, width, height)
      gl.uniform1f(uniform.iTime, elapsed)
      gl.uniform1f(uniform.uGrainAmount, options.grainEnabled ? colors.grain : 0)
      // About 1.5 CSS pixels per grain at any display density.
      gl.uniform1f(uniform.uGrainSize, Math.max(1, Math.round(ratio * 1.5)))
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
