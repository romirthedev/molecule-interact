import React from 'react';
import { molecules } from '../services/moleculeData';

const BondDetail = ({ moleculeId, bondId }) => {
  const molecule = molecules.find(m => m.id === moleculeId);
  const bond = molecule?.bonds.find(b => b.id === bondId);

  if (!bond) {
    return <div>Bond not found</div>;
  }

  return (
    <div>
      <h2>Bond Detail</h2>
      <p>Atoms: {bond.atom1} - {bond.atom2}</p>
      <p>Type: {bond.type}</p>
      <p>Zoomed-in view...</p>
    </div>
  );
};

export default BondDetail;
