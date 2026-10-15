import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const NOISE = `float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}`

// Fotosfera: qaynayotgan granulalar (Worley shovqini), supergranulalar, quyosh dog'lari, fakellar, chekkada qorayish
const WORLEY = `vec3 hash3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return fract(sin(p)*43758.5453);}
float worley(vec3 x){vec3 i=floor(x),f=fract(x);float d=8.;
for(int a=-1;a<=1;a++)for(int b=-1;b<=1;b++)for(int c=-1;c<=1;c++){vec3 g=vec3(float(a),float(b),float(c));vec3 o=hash3(i+g);o=.5+.5*sin(time*.35+6.2831*o);vec3 r=g+o-f;d=min(d,dot(r,r));}
return sqrt(d);}`
const surfVS = 'varying vec2 vUv;varying vec3 vN;varying vec3 vP;void main(){vUv=uv;vP=position;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'
const surfFS = `uniform sampler2D sunMap;uniform float time;varying vec2 vUv;varying vec3 vN;varying vec3 vP;${NOISE}${WORLEY}
void main(){
 float mu=clamp(dot(normalize(vN),vec3(0.,0.,1.)),0.,1.);vec3 p=normalize(vP);
 float large=fbm(p*5.+vec3(0.,time*.02,0.));
 float gran=fbm(p*38.+vec3(time*.05,0.,time*.04));
 float w=worley(p*52.),w2=worley(p*10.+3.);
 float heat=.5+.4*large+.18*(gran-.5)+.38*(.55-w)+.12*(.5-w2);
 float spot=smoothstep(.64,.74,fbm(p*3.1+vec3(7.3,1.7,2.9)));heat*=1.-.8*spot;
 float fac=smoothstep(.7,.8,fbm(p*4.+vec3(3.,9.,1.)))*(1.-spot);heat+=.18*fac;
 vec3 col=mix(vec3(.85,.2,.02),vec3(1.,.66,.2),smoothstep(.2,.65,heat));
 col=mix(col,vec3(1.,.93,.72),smoothstep(.65,1.05,heat));
 col*=.75+.5*texture2D(sunMap,vUv).r;
 col*=1.-.6*(1.-mu);col=mix(col*vec3(1.,.5,.25),col,pow(mu,.35));
 gl_FragColor=vec4(col*1.35,1.);
 #include <colorspace_fragment>
}`
// Toj: halo, xromosfera, protuberanetslar (chekkadagi qizil yoylar), nur oqimlari va obyektiv "streak"i
const corVS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'
const corFS = `uniform float time;uniform float S;varying vec2 vUv;${NOISE}
void main(){
 vec2 q=(vUv-.5)*2.;float rr=length(q)*S;if(rr<.98)discard;
 float a=atan(q.y,q.x);vec2 d=vec2(cos(a),sin(a));float k=rr-1.;
 float glow=exp(-k*2.2)*.95+exp(-k*.55)*.25;
 float ray=noise(vec3(d*3.5,time*.12))*.6+noise(vec3(d*9.,-time*.17))*.4;ray=pow(ray,2.4)*2.6;
 float chromo=exp(-pow((rr-1.02)*45.,2.))*.7;
 float ph=smoothstep(.5,.85,noise(vec3(d*2.4,time*.04,5.)))*.16+smoothstep(.62,.9,noise(vec3(d*5.,-time*.05,9.)))*.07;
 float prom=(1.-smoothstep(1.,1.+ph+.002,rr))*(.6+.4*noise(vec3(d*14.,rr*30.,time*.3)));
 float I=(glow+ray*exp(-k*.5)*.55)*(1.-smoothstep(S*.55,S,rr))+chromo+prom*.9;I*=.95+.05*sin(time*.8);
 vec3 c=mix(vec3(1.,.82,.5),vec3(1.,.38,.1),clamp(k*.45,0.,1.));c=mix(c,vec3(1.,.28,.2),clamp(chromo+prom*1.5,0.,1.));
 float streak=exp(-abs(q.y)*S*14.)*exp(-abs(q.x)*1.8)*.28;
 vec3 tot=c*I+vec3(.8,.9,1.)*streak;float A=clamp(max(tot.r,max(tot.g,tot.b)),0.,1.);
 gl_FragColor=vec4(tot/max(A,.0001),A);
 #include <colorspace_fragment>
}`
const S = 5
export default function SunBody({ radius = 1, onClick }) {
  const tex = useTexture('/textures/sunmap.jpg'), { camera } = useThree(), cor = useRef()
  const { surf, corona } = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    return {
      surf: new THREE.ShaderMaterial({ vertexShader: surfVS, fragmentShader: surfFS, uniforms: { sunMap: { value: tex }, time: { value: 0 } } }),
      corona: new THREE.ShaderMaterial({ vertexShader: corVS, fragmentShader: corFS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { time: { value: 0 }, S: { value: S } } }),
    }
  }, [tex])
  useEffect(() => () => { surf.dispose(); corona.dispose() }, [surf, corona])
  useFrame((_, dt) => {
    if (!reduce) { surf.uniforms.time.value += dt; corona.uniforms.time.value += dt }
    if (cor.current) cor.current.quaternion.copy(camera.quaternion) // toj doim kameraga qaragan
  })
  return <group scale={radius}>
    {/* faqat shar bosiladi; toj bosishni ushlamaydi */}
    <mesh material={surf} onClick={onClick}><sphereGeometry args={[1, 96, 96]}/></mesh>
    <mesh ref={cor} material={corona} raycast={() => null} renderOrder={1}><planeGeometry args={[S * 2, S * 2]}/></mesh>
  </group>
}
