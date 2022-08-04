import React from 'react';

export default function ColorBox({ available }) {
    let color = 'grey';

    if (available) {
        color = 'green';
    }

    return <p style={{ backgroundColor: color, color: 'transparent' }}>TEXT</p>;
}
