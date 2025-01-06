const moleculeDatabase = [
    {
        id: 'water',
        name: 'Water (H₂O)',
        atoms: [
            { element: 'O', position: [0, 0, 0], color: '#FF0000' },
            { element: 'H', position: [-0.8, 0.6, 0], color: '#FFFFFF' },
            { element: 'H', position: [0.8, 0.6, 0], color: '#FFFFFF' }
        ],
        bonds: [
            { from: 0, to: 1 },
            { from: 0, to: 2 }
        ]
    },
    {
        id: 'methane',
        name: 'Methane (CH₄)',
        atoms: [
            { element: 'C', position: [0, 0, 0], color: '#808080' },
            { element: 'H', position: [0.8, 0.8, 0.8], color: '#FFFFFF' },
            { element: 'H', position: [-0.8, -0.8, 0.8], color: '#FFFFFF' },
            { element: 'H', position: [0.8, -0.8, -0.8], color: '#FFFFFF' },
            { element: 'H', position: [-0.8, 0.8, -0.8], color: '#FFFFFF' }
        ],
        bonds: [
            { from: 0, to: 1 },
            { from: 0, to: 2 },
            { from: 0, to: 3 },
            { from: 0, to: 4 }
        ]
    }
];
