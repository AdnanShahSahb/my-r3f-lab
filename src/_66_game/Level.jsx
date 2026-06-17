import { Text, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })


function BlockStart({ position = [0, 0, 0] }) {

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        >
            {/* <boxGeometry args={[4, 0.2, 4]} /> */}
            {/* <meshStandardMaterial color={'limegreen'} /> */}
        </mesh>
    </group>

}
function BlockEnd({ position = [0, 0, 0] }) {

    const hamburger = useGLTF('./hamburger.glb')
    hamburger.scene.children.forEach((d) => {
        d.castShadow = true;
    })

    return <group position={position}>
        <Text
            font="./bebas-neue-v9-latin-regular.woff"
            scale={0.6}
            position={[0, 1.25, 2]}
        >
            FINISH
            <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        >
        </mesh>
        <RigidBody
            type="fixed"
            colliders="hull"
            restitution={0.2}
            position={[0, 0.25, 0]}
            friction={0}
        >
            <primitive
                object={hamburger.scene}
                scale={0.2}
            />
        </RigidBody>
    </group>

}

export function BlockSpinner({ position = [0, 0, 0] }) {

    const obstacleRef = useRef()
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random < 0.5 ? -1 : 1))

    useFrame((state) => {

        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacleRef.current?.setNextKinematicRotation(rotation)


    })


    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        >
            {/* <boxGeometry args={[4, 0.2, 4]} /> */}
            {/* <meshStandardMaterial color={'limegreen'} /> */}
        </mesh>

        <RigidBody
            ref={obstacleRef}
            type="kinematicPosition"
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
            >
            </mesh>
        </RigidBody>

    </group>

}


export function BlockLimbo({ position = [0, 0, 0] }) {

    const obstacleRef = useRef()
    const [timeOffset] = useState(() => (Math.random() * Math.PI * 2))

    useFrame((state) => {

        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15;
        obstacleRef.current?.setNextKinematicTranslation({ x: 0, y: y, z: position[2] })

    })


    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        >
            {/* <boxGeometry args={[4, 0.2, 4]} /> */}
            {/* <meshStandardMaterial color={'limegreen'} /> */}
        </mesh>

        <RigidBody
            ref={obstacleRef}
            type="kinematicPosition"
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
            >
            </mesh>
        </RigidBody>

    </group>

}


export function BlockAxe({ position = [0, 0, 0] }) {

    const obstacleRef = useRef()
    const [timeOffset] = useState(() => (Math.random() * Math.PI * 2))

    useFrame((state) => {

        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25;
        obstacleRef.current?.setNextKinematicTranslation({ x: x, y: 0 + 0.75, z: position[2] })

    })


    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        >
            {/* <boxGeometry args={[4, 0.2, 4]} /> */}
            {/* <meshStandardMaterial color={'limegreen'} /> */}
        </mesh>

        <RigidBody
            ref={obstacleRef}
            type="kinematicPosition"
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[1.5, 1.3, 0.3]}
                castShadow
            >
            </mesh>
        </RigidBody>

    </group>

}


const Bounds = ({ length = 1 }) => {

    return (
        <>
            <RigidBody
                type="fixed"
                restitution={0.2}
                friction={0}
            >
                <mesh
                    position={[2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    castShadow
                />
                <mesh
                    position={[-2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    receiveShadow
                />

                <mesh
                    position={[0, 0.75, -(length * 4) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[4, 1.5, 0.3]}
                    receiveShadow
                />
                <CuboidCollider
                    args={[2, 0.1, 2 * length]}
                    position={[0, -0.1, -(2 * length) + 2]}
                    restitution={0.2}
                    friction={1}
                />
            </RigidBody>

        </>
    )
}


export default function Level({
    count = 3,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
    seed = 0
}) {

    const blocks = useMemo(() => {
        const blocks = []
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }
        return blocks;
    }, [count, types, seed])


    return (
        <>
            {/* <mesh castShadow position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh receiveShadow position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh> */}

            <BlockStart position={[0, 0, 0]} />
            {blocks.map((B, i) => <B
                key={i}
                position={[0, 0, -(i + 1) * 4]}
            />)}

            <BlockEnd position={[0, 0, -(count + 1) * 4]} />

            {/* <BlockStart position={[0, 0, 16]} />
            <BlockSpinner position={[0, 0, 12]} />
            <BlockLimbo position={[0, 0, 8]} />
            <BlockAxe position={[0, 0, 4]} />
            <BlockEnd position={[0, 0, 0]} /> */}


            <Bounds length={count + 2} />
        </>
    )

}