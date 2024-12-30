import React from 'react';
import { molecules } from '../services/moleculeData';

const BondList = ({ moleculeId, onSelectBond }) => {
  const molecule = molecules.find(m => m.id === moleculeId);

  if (!molecule) {
    return <div>Molecule not found</div>;
  }

  return (
    <div>
      <h2>Bonds of {molecule.name}</h2>
      <ul>
        {molecule.bonds.map(bond => (
          <li key={bond.id} onClick={() => onSelectBond(bond.id)}>
            {bond.atom1} - {bond.atom2} ({bond.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BondList;
