import type { ImgHTMLAttributes } from 'react';
// Vite will resolve this path during the build process
import logo from '../../images/UVLOGO.svg';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src={logo}
            alt="Logo"
            {...props}
            className={`h-10 w-10 ${props.className ?? ''}`}
        />
    );
}
