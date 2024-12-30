'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface MoleculeViewerProps {
  molecule: string
  moleculeData: string
}

declare global {
  interface Window {
    $3Dmol: any;
  }
}

export default function MoleculeViewer({ molecule, moleculeData }: MoleculeViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const viewerInstanceRef = useRef<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(0)

  useEffect(() => {
    if (scriptsLoaded < 2) return

    const initViewer = () => {
      if (typeof window !== 'undefined' && window.$3Dmol && viewerRef.current) {
        if (!viewerInstanceRef.current) {
          viewerInstanceRef.current = window.$3Dmol.createViewer(viewerRef.current, {
            backgroundColor: 'white',
          })
        }

        const viewer = viewerInstanceRef.current

        viewer.clear()
        viewer.addModel(moleculeData, 'sdf')
        viewer.setStyle({}, { stick: {} })
        viewer.setColorByElement({ scheme: 'Jmol' })
        viewer.zoomTo()
        viewer.render()

        viewer.getModel().setClickable({}, true, (atom: any) => {
          viewer.setStyle({ serial: atom.serial }, { stick: { radius: 0.3 } })
          viewer.center({ serial: atom.serial }, 1000)
          viewer.render()
        })
      }
    }

    const loadInterval = setInterval(() => {
      if (window.$3Dmol) {
        clearInterval(loadInterval)
        initViewer()
      }
    }, 100)

    return () => {
      clearInterval(loadInterval)
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.clear()
      }
    }
  }, [molecule, moleculeData, scriptsLoaded])

  const handleScriptLoad = () => {
    setScriptsLoaded(prev => prev + 1)
  }

  return (
    <>
      <Script 
        src="https://3Dmol.org/build/3Dmol-min.js" 
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      <Script 
        src="https://3Dmol.org/build/3Dmol.ui-min.js" 
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
    </>
  )
}

