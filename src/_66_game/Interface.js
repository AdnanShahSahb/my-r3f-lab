import { useKeyboardControls } from '@react-three/drei'
import useGame from './store/useGame'
import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'

export default function Interface() {

    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    const timeRef = useRef()


    useEffect(() => {
        const unsubAddEffect = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0;
            if (state.phase == 'playing')
                elapsedTime = Date.now() - state.startTime
            else if (state.phase == 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000;
            elapsedTime = elapsedTime.toFixed(2)

            if (timeRef.current)
                timeRef.current.textContent = elapsedTime
        })

        return () => {
            unsubAddEffect()
        }
    }, [])


    const holdRef = useRef(null)

    const setForward = useGame((state) => state.setForward)
    const setBackward = useGame((state) => state.setBackward)
    const setLeftward = useGame((state) => state.setLeftward)
    const setRightward = useGame((state) => state.setRightward)
    const setJump = useGame((state) => state.setJump)

    const hold = (setKey) => ({
        onContextMenu: (e) => e.preventDefault(),

        onPointerDown: (e) => {
            e.preventDefault()
            setKey(true)
        },
        onPointerUp: (e) => {
            e.preventDefault()
            setKey(false)
        },
        onPointerLeave: (e) => {
            setKey(false)
        }
    })

    return (<>
        <div className="interface">

            <div ref={timeRef} className="time">0.00</div>

            {
                phase == 'ended' &&
                <div className="restart"
                    onClick={() => { restart() }}
                >Restart</div>
            }

            <div className="interface">

                {/* ... */}

                {/* Controls */}
                <div className="controls">

                    <div className="raw">
                        <div className="key"

                            {...hold(setForward)}
                        />
                    </div>

                    <div className="raw">
                        <div className="key"
                            {...hold(setLeftward)}
                        />
                        <div className="key"
                            {...hold(setBackward)}
                        />
                        <div className="key"
                            {...hold(setRightward)}
                        />
                    </div>

                    <div className="raw">
                        <div className="key large"
                            {...hold(setJump)}
                        />
                    </div>

                </div>

            </div>
        </div>
    </>)
} 