'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'

const DynamicMoleculeViewer = dynamic(() => import('../components/MoleculeViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading viewer...</div>
})

const moleculeData = {
  methane: `
Methane
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
  5  4  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6301   -0.6301   -0.6301 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6301    0.6301   -0.6301 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6301   -0.6301    0.6301 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6301    0.6301    0.6301 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  END
`,
  ethanol: `
Ethanol
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
  9  8  0  0  0  0  0  0  0  0999 V2000
    1.1594   -0.1815    0.0154 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3430   -0.1815    0.0154 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7916    1.1923    0.0154 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.5484    0.3348    0.9020 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.5484    0.3348   -0.8712 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.5484   -1.2141    0.0154 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7320   -0.6978    0.9020 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7320   -0.6978   -0.8712 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.7616    1.1923    0.0154 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  2  3  1  0  0  0  0
  2  7  1  0  0  0  0
  2  8  1  0  0  0  0
  3  9  1  0  0  0  0
M  END
`,
  glucose: `
Glucose
  CHEMDOOD08070920033D 0   0.00000     0.00000     0
 
 24 23  0  0  0  0  0  0  0  0999 V2000
   -0.9480   -1.0266    0.3679 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1448   -0.1995   -0.1577 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.8833    1.2539    0.2323 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.5107    1.6669   -0.2805 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.5861    0.7398    0.2451 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.9587    1.1528   -0.2677 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.3246   -0.7136   -0.1449 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.1391   -2.0323    0.0358 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.8474   -1.0440    1.4518 H   0  0  0  0  0  0  0  0  0  0  0  0
   -3.0623   -0.5541    0.2733 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.2454   -0.2169   -1.2416 H   0  0  0  0  0  0  0  0  0  0  0  0
   -2.6551    1.8996   -0.1834 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9065    1.3487    1.3162 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.3196    2.6726    0.0516 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.4875    1.6495   -1.3644 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.5629    0.7572    1.3290 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.7305    0.5071    0.1480 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.1498    2.1585    0.0644 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.0593    1.1354   -1.3516 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.4252   -0.7310   -1.2288 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.0964   -1.3593    0.2660 H   0  0  0  0  0  0  0  0  0  0  0  0
   -3.2555    1.5563    0.1463 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.2573    3.0079    0.1323 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.2104    2.4991    0.1183 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  7  1  0  0  0  0
  1  8  1  0  0  0  0
  1  9  1  0  0  0  0
  2  3  1  0  0  0  0
  2 10  1  0  0  0  0
  2 11  1  0  0  0  0
  3  4  1  0  0  0  0
  3 12  1  0  0  0  0
  3 13  1  0  0  0  0
  4  5  1  0  0  0  0
  4 14  1  0  0  0  0
  4 15  1  0  0  0  0
  5  6  1  0  0  0  0
  5  7  1  0  0  0  0
  5 16  1  0  0  0  0
  6 17  1  0  0  0  0
  6 18  1  0  0  0  0
  6 19  1  0  0  0  0
  7 20  1  0  0  0  0
  7 21  1  0  0  0  0
  3 22  1  0  0  0  0
  4 23  1  0  0  0  0
  6 24  1  0  0  0  0
M  END
`
}

export default function Home() {
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLoadMolecule = () => {
    if (!selectedMolecule) {
      setError('Please select a molecule first.')
      return
    }
    setError(null)
    alert(`${selectedMolecule.charAt(0).toUpperCase() + selectedMolecule.slice(1)} loaded successfully!`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">3D Molecule Viewer</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <Select onValueChange={(value) => {
          setSelectedMolecule(value)
          setError(null)
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a molecule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="methane">Methane</SelectItem>
            <SelectItem value="ethanol">Ethanol</SelectItem>
            <SelectItem value="glucose">Glucose</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleLoadMolecule}>
          Load Molecule
        </Button>
      </div>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        {selectedMolecule ? (
          <DynamicMoleculeViewer
            key={selectedMolecule}
            molecule={selectedMolecule}
            moleculeData={moleculeData[selectedMolecule as keyof typeof moleculeData]}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Select a molecule to view
          </div>
        )}
      </div>
    </div>
  )
}

