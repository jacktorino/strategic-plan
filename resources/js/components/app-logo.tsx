import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            {/* Logo Container Box with Solid Black Background */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-md border bg-white p-1 text-sidebar-primary-foreground shadow-sm">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>

            {/* App Branding Text Layout Stack */}
            <div className="ml-2 grid flex-1 text-left">
                <span className="truncate text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Strategic Plan
                </span>
                <span className="mt-0.5 truncate text-[10px] leading-none font-medium tracking-wide text-muted-foreground">
                    University of the Visayas
                </span>
            </div>
        </>
    );
}
