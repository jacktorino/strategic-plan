import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src="/images/UVLOGO.svg"
            alt="Logo"
            {...props}
            className={`h-10 w-10 ${props.className ?? ''}`}
        />
    );
}
