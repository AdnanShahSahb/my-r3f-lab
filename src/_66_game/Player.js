import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"
import useGame from "./store/useGame";



export default function Player() {

    const bodyRef = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const rapierWorld = world;

    const [smoothedCameraPos] = useState(() => new THREE.Vector3(-10, -10, -10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const blocksCount = useGame((state) => state.blocksCount)
    const restart = useGame((state) => state.restart)


    const jump = () => {
        const origin = bodyRef.current.translation()
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = rapierWorld.castRay(ray, 10, true)
        if (hit?.timeOfImpact < 0.15)
            bodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }

    const reset = () => {
        bodyRef.current.setTranslation({ x: 0, y: 1, z: 0 })
        bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 })
        bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() => {
        const unsubJumpPress = useGame.subscribe(
            (state) => state.jump,
            (value) => {
                if (value)
                    jump()
            }
        )
        const unsubReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value == 'ready')
                    reset()
            }
        )

        const unsubJump = subscribeKeys(
            (state) => {
                return state.jump
            },
            (val) => {
                if (val)
                    jump();
            },
        )

        const unsubAny = subscribeKeys(
            () => {
                start()
            }
        )

        return () => {
            unsubJump();
            unsubAny();
            unsubReset();
            unsubJumpPress();
        }
    }, [])

    useFrame((state, delta) => {
        const gameState = useGame.getState()
        const keys = getKeys()

        const forward = gameState.forward || keys.forward
        const backward = gameState.backward || keys.backward
        const leftward = gameState.leftward || keys.leftward
        const rightward = gameState.rightward || keys.rightward


        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        } if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        } if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        } if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }

        bodyRef.current?.applyImpulse(impulse)
        bodyRef.current?.applyTorqueImpulse(torque)



        // CAMERA
        if (!bodyRef.current)
            return;


        const bodyPos = bodyRef.current.translation()
        const cameraPos = new THREE.Vector3()
        cameraPos.copy(bodyPos)
        cameraPos.z += 2.25
        cameraPos.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPos)
        cameraTarget.y += 0.25;

        smoothedCameraPos.lerp(cameraPos, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPos)
        state.camera.lookAt(smoothedCameraTarget)




        if (bodyPos.z < -(blocksCount * 4 + 2))
            end()

        if (bodyPos.y < -4)
            restart()

    })

    return (
        <RigidBody
            ref={bodyRef}
            colliders="ball"
            position={[0, 1, 0]}
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color={'mediumpurple'} />
            </mesh>
        </RigidBody>
    )

}