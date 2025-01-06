import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import MoleculeViewer from './components/MoleculeViewer'
import SearchBar from './components/SearchBar'
import { OrbitControls } from '@react-three/drei'

const App = () => {
  const [selectedMolecule, setSelectedMolecule] = useState(null)
  const [focusedBond, setFocusedBond] = useState(null)

  return (
    <div className="h-screen w-screen bg-gray-900">
      <SearchBar onMoleculeSelect={setSelectedMolecule} />
      <Canvas className="h-full w-full">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {selectedMolecule && (
          <MoleculeViewer
            molecule={selectedMolecule}
            focusedBond={focusedBond}
            setFocusedBond={setFocusedBond}
          />
        )}
      </Canvas>
    </div>
  )
}

export default App
