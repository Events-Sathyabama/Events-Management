import Link from 'next/link';

export default function LandingNav(): JSX.Element {
	return (
		<div className="flex flex-row w-full h-20 justify-center items-center">
			<Link href="/" className="flex flex-row items-center gap-3">
				<img src="/logo.svg" className="h-12 w-12" />
				<h1 className="text-3xl font-roboto text-black font-semibold">
					Events@Sathyabama
				</h1>
				<svg
					className="text-red-600 -ml-4 -mt-9"
					xmlns="http://www.w3.org/2000/svg"
					width="36"
					height="36"
					viewBox="0 0 36 36">
					<path
						fill="currentColor"
						d="M7.21 14.07h3a1.61 1.61 0 0 1 1.81 1.5a1.44 1.44 0 0 1-.84 1.34a1.67 1.67 0 0 1 1.1 1.53a1.75 1.75 0 0 1-2 1.63H7.21Zm2.71 2.42c.48 0 .82-.28.82-.67s-.34-.65-.82-.65H8.49v1.32Zm.2 2.48a.75.75 0 1 0 0-1.47H8.49V19Z"
						className="clr-i-outline clr-i-outline-path-1"
					/>
					<path
						fill="currentColor"
						d="M14.55 15.23v1.2h3v1.16h-3v1.32h3.33v1.16h-4.62v-6h4.62v1.16Z"
						className="clr-i-outline clr-i-outline-path-2"
					/>
					<path
						fill="currentColor"
						d="M20.41 15.23h-1.87v-1.16h5v1.16H21.7v4.84h-1.29Z"
						className="clr-i-outline clr-i-outline-path-3"
					/>
					<path
						fill="currentColor"
						d="M28 19.12h-2.68l-.38.95H23.5l2.44-6h1.44l2.45 6h-1.45ZM27.55 18l-.89-2.19l-.89 2.19Z"
						className="clr-i-outline clr-i-outline-path-4"
					/>
					<path
						fill="currentColor"
						d="M8.06 30a.84.84 0 0 1-.38-.08a1 1 0 0 1-.62-.92v-4h-4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h30a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H13.48l-4.71 4.71a1 1 0 0 1-.71.29Zm-4-7h4a1 1 0 0 1 1 1v2.59l3.3-3.3a1 1 0 0 1 .7-.29h19V11h-28Z"
						className="clr-i-outline clr-i-outline-path-5"
					/>
					<path fill="none" d="M0 0h36v36H0z" />
				</svg>
			</Link>
		</div>
	);
}
