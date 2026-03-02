import React from 'react';
import logoImage from '../assets/logo.png'; // Update this path to match your project structure

function Logo({ className = '', size = 'medium' }) {
    // Size options - made bigger
    const sizes = {
        small: 'h-12',
        medium: 'h-16',
        large: 'h-24',
        xlarge: 'h-32'
    };

    return (
        <div className={`inline-block ${className}`}>
            <img
                src={logoImage}
                alt="Kool Kredit Logo"
                className={`${sizes[size]} w-auto`}
                style={{
                    // White stroke/outline around each element
                    filter: `
                        drop-shadow(-1px -1px 0 white)
                        drop-shadow(1px -1px 0 white)
                        drop-shadow(-1px 1px 0 white)
                        drop-shadow(1px 1px 0 white)
                        drop-shadow(-2px 0 0 white)
                        drop-shadow(2px 0 0 white)
                        drop-shadow(0 -2px 0 white)
                        drop-shadow(0 2px 0 white)
                    `,
                    WebkitFilter: `
                        drop-shadow(-1px -1px 0 white)
                        drop-shadow(1px -1px 0 white)
                        drop-shadow(-1px 1px 0 white)
                        drop-shadow(1px 1px 0 white)
                        drop-shadow(-2px 0 0 white)
                        drop-shadow(2px 0 0 white)
                        drop-shadow(0 -2px 0 white)
                        drop-shadow(0 2px 0 white)
                    `
                }}
            />
        </div>
    );
}

export default Logo;