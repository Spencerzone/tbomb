import React from 'react';

export default function ColorBox({ available }) {
    let color = 'hsla(0,0%,80%,0.3)';

    if (available) {
        color = 'green';
    }

    return <p style={{ backgroundColor: color, color: 'transparent' }}>TEXT</p>;
}
