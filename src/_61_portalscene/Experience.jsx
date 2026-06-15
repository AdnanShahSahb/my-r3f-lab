import { Center, OrbitControls, shaderMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import portal_vertexShaders from "./shaders/portal/vertex.glsl"
import portal_fragmentShaders from "./shaders/portal/fragment.glsl"
import * as THREE from "three"
import { extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { deltaTime } from 'three/tsl'

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000'),
    },
    portal_vertexShaders,
    portal_fragmentShaders,
)
extend({ PortalMaterial })

export default function Experience() {

    const { nodes } = useGLTF('./model/portal.glb')
    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false;

    const portalMaterialRef = useRef()

    useFrame((state, delta) => {
        portalMaterialRef.current.uTime += delta;
    })

    return <>

        <color args={['#030202']} attach='background' />

        <OrbitControls makeDefault />

        <Center>
            <mesh geometry={nodes.baked.geometry}>
                <meshBasicMaterial map={bakedTexture} />
            </mesh>
            <mesh
                geometry={nodes.poleLightA.geometry}
                position={nodes.poleLightA.position}
            >
                <meshBasicMaterial color='#ffffe5' />
            </mesh>

            <mesh
                geometry={nodes.poleLightB.geometry}
                position={nodes.poleLightB.position}
            >
                <meshBasicMaterial color='#ffffe5' />
            </mesh>


            <mesh
                geometry={nodes.portalLight.geometry}
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
            >
                <portalMaterial ref={portalMaterialRef} />
                {/* <shaderMaterial
                    vertexShader={portal_vertexShaders}
                    fragmentShader={portal_fragmentShaders}
                    uniforms={
                        {
                            uTime: { value: 0 },
                            uColorStart: { value: new THREE.Color('#ffffff') },
                            uColorEnd: { value: new THREE.Color('#000000') },
                        }
                    }
                /> */}
            </mesh>


            <Sparkles
                size={6}
                scale={[4, 2, 4]}
                position-y={1}
                speed={0.2}
                count={40}
            />
        </Center>

    </>
}