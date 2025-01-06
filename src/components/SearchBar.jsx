import React, { useState } from 'react'
import { moleculeDatabase } from '../data/molecules'

const SearchBar = ({ onMoleculeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-10">
      <input
        type="text"
        className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        placeholder="Search molecules..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute mt-2 w-full max-w-md bg-gray-800 rounded-lg shadow-xl">
        {moleculeDatabase
          .filter(mol => mol.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(mol => (
            <div
              key={mol.id}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
              onClick={() => onMoleculeSelect(mol)}
            >
              {mol.name}
            </div>
          ))}
      </div>
    </div>
  )
}

export default SearchBar
