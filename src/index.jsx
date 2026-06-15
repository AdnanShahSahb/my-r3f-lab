import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './_61_portalscene/Experience.jsx'
import PortfolioExperience from "./_64_portfolio/PortfolioExperience.jsx"

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        flat
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [1, 2, 6]
        }}
    >
        {/* <Experience /> */}
        <PortfolioExperience/>
    </Canvas>
)