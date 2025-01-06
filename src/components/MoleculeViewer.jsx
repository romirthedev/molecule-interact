import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import Atom from './Atom'
import Bond from './Bond'

const MoleculeViewer = ({ molecule, focusedBond, setFocusedBond }) => {
  const groupRef = useRef()

  useFrame(() => {
    if (!focusedBond) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {molecule.atoms.map((atom, i) => (
        <Atom key={i} position={atom.position} element={atom.element} />
      ))}
      {molecule.bonds.map((bond, i) => (
        <Bond
          key={i}
          start={molecule.atoms[bond.atoms[0]].position}
          end={molecule.atoms[bond.atoms[1]].position}
          bondOrder={bond.order}
          isFocused={focusedBond === i}
          onClick={() => setFocusedBond(focusedBond === i ? null : i)}
        />
      ))}
    </group>
  )
}

export default MoleculeViewer
