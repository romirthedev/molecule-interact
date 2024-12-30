import React from 'react';
import { molecules } from '../services/moleculeData';

const MoleculeList = ({ onSelectMolecule }) => {
  return (
    <div>
      <h2>Molecules</h2>
      <ul>
        {molecules.map(molecule => (
          <li key={molecule.id} onClick={() => onSelectMolecule(molecule.id)}>
            {molecule.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoleculeList;
