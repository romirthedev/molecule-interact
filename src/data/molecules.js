export const moleculeDatabase = [
  {
    id: 1,
    name: 'Water',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [-0.8, 0.6, 0] },
      { element: 'H', position: [0.8, 0.6, 0] }
    ],
    bonds: [
      { atoms: [0, 1], order: 1 },
      { atoms: [0, 2], order: 1 }
    ]
  },
  // Add more molecules as needed
]
