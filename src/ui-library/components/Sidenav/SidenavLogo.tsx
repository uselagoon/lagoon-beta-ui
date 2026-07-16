'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import LagoonIcon from '../../icons/sidebar/logo-dark.svg';
import { useLinkComponent } from '@ui-lib/providers/NextLinkProvider';
import { useSyncTheme } from '@ui-lib/hooks/useSyncTheme';


export default function SidenavLogo() {
	const { resolvedTheme } = useTheme();

	useSyncTheme();

	const Link = useLinkComponent();

	const getLogos= () => {
		const iconFolder = '/sidebar-icons';
		// We need to fallback to the dark logo if resolvedTheme is undefined for some reason
		return `${iconFolder}/logo-${resolvedTheme ?? 'dark'}.svg`;
	};

	const FALLBACK_LOGO = '/sidebar-icons/logo-dark.svg';

	const renderLogo = () => {
		const logoPath = getLogos();
		// The LagoonIcon svg can be either a string or a React component depending on the Next/image config, so we need to handle both cases.
		const fallbackPath = typeof LagoonIcon === 'string' ? LagoonIcon : FALLBACK_LOGO;

		return (
			<img
				src={logoPath}
				alt="Logo"
				onError={(e) => {
					const target = e.currentTarget;
					// Basic gaurd against  the infinite loop if the fallback svg fails (shouldn't with the above logic, but just in case)
					if (target.src !== fallbackPath) {
						target.src = fallbackPath;
					}
				}}
			/>
		);
	};

	return (
		<>
			<section className="flex items-center gap-1 pl-1">
				<div className={`aspect-square min-w-[280px] max-h-[50px] rounded-lg text-sidebar-primary-foreground size-16 p-2 mb-2`}>
					<Link href="/projects" className="w-auto h-auto">{renderLogo()}</Link>
				</div>
			</section>
		</>
	);
}
