import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Bond = ({ start, end, bondOrder, isFocused, onClick }) => {
  const bondRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    if (isFocused) {
      ringRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      ringRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const bondVector = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end),
    new THREE.Vector3(...start)
  )
  const bondLength = bondVector.length()
  const bondCenter = new THREE.Vector3().addVectors(
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ).multiplyScalar(0.5)

  return (
    <group position={bondCenter} onClick={onClick}>
      <mesh ref={bondRef}>
        <cylinderGeometry args={[0.1, 0.1, bondLength, 32]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {isFocused && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.3, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" />
        </mesh>
      )}
    </group>
  )
}

export default Bond
