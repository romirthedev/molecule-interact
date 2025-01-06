import React from 'react'
import { Sphere } from '@react-three/drei'

const elementColors = {
  H: '#FFFFFF',
  C: '#909090',
  N: '#3050F8',
  O: '#FF0D0D',
  // Add more elements as needed
}

const Atom = ({ position, element }) => {
  return (
    <Sphere position={position} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={elementColors[element] || '#FFFFFF'} />
    </Sphere>
  )
}

export default Atom
