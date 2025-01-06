const molecules = {
    water: {
        name: "Water (H₂O)",
        description: "A polar molecule essential for life",
        atoms: [
            { pos: [0, 0, 0], color: 0xff0000, element: 'O', radius: 0.4 },
            { pos: [-0.8, 0.6, 0], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [0.8, 0.6, 0], color: 0xffffff, element: 'H', radius: 0.2 }
        ],
        bonds: [
            { atoms: [0, 1], order: 1, key: true },
            { atoms: [0, 2], order: 1, key: true }
        ]
    },
    methane: {
        name: "Methane (CH₄)",
        description: "Simplest hydrocarbon molecule",
        atoms: [
            { pos: [0, 0, 0], color: 0x808080, element: 'C', radius: 0.4 },
            { pos: [0.8, 0.8, 0.8], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [-0.8, -0.8, 0.8], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [0.8, -0.8, -0.8], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [-0.8, 0.8, -0.8], color: 0xffffff, element: 'H', radius: 0.2 }
        ],
        bonds: [
            { atoms: [0, 1], order: 1, key: true },
            { atoms: [0, 2], order: 1, key: false },
            { atoms: [0, 3], order: 1, key: false },
            { atoms: [0, 4], order: 1, key: false }
        ]
    },
    ethanol: {
        name: "Ethanol (C₂H₅OH)",
        description: "Common alcohol molecule",
        atoms: [
            { pos: [0, 0, 0], color: 0x808080, element: 'C', radius: 0.4 },
            { pos: [1.2, 0, 0], color: 0x808080, element: 'C', radius: 0.4 },
            { pos: [2.0, 1.0, 0], color: 0xff0000, element: 'O', radius: 0.4 },
            { pos: [-0.5, 0.9, 0], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [-0.5, -0.9, 0], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [1.7, -0.9, 0], color: 0xffffff, element: 'H', radius: 0.2 },
            { pos: [2.8, 0.7, 0], color: 0xffffff, element: 'H', radius: 0.2 }
        ],
        bonds: [
            { atoms: [0, 1], order: 1, key: true },
            { atoms: [1, 2], order: 1, key: true },
            { atoms: [0, 3], order: 1, key: false },
            { atoms: [0, 4], order: 1, key: false },
            { atoms: [1, 5], order: 1, key: false },
            { atoms: [2, 6], order: 1, key: false }
        ]
    }
};
