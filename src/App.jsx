import './style.css'
import { Canvas } from '@react-three/fiber'
import Experience from './_61_portalscene/Experience.jsx'
import PortfolioExperience from "./_64_portfolio/PortfolioExperience.jsx"
import PhysicsRapier from './_65_rapier/Experience.js'
import R3fGame from './_66_game/Experience.js'
import { KeyboardControls } from '@react-three/drei'
import Interface from './_66_game/Interface.js'
import { useEffect, useState } from 'react'

export default function App() {

    const [state, setState] = useState('portalScene')

    useEffect(() => {
        const page = window.location.search.slice(1)

        if (page) {
            setState(page)
        }
    }, [])

    return <>

        {state === 'portalScene' && (
            <Canvas shadows flat camera={{ fov: 45, near: 0.1, far: 200, position: [1, 2, 6] }}>
                <Experience />
            </Canvas>
        )}

        {state === 'portfolio' && (
            <Canvas shadows flat camera={{ fov: 45, near: 0.1, far: 200, position: [1, 2, 6] }}>
                <PortfolioExperience />
            </Canvas>
        )}

        {state === 'game' && (
            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] }, // fixed
                    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                    { name: 'jump', keys: ['Space'] },
                ]}
            >
                <Canvas shadows flat camera={{ fov: 45, near: 0.1, far: 200, position: [1, 2, 6] }}>
                    <R3fGame />
                </Canvas>
                <Interface />
            </KeyboardControls>
        )}
    </>
}