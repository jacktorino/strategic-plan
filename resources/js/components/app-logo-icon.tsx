import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src="/images/UVLOGO.svg" // This is the correct path for public/ images
            alt="Logo"
            {...props}
            className={`h-10 w-10 ${props.className ?? ''}`}
        />
    );
}
