import { useEffect, useState } from "react";
import Link from 'next/link';

export default function NavigationBar() {
	const [showNavigationBar, setNavigationBarVisibility] = useState<boolean>(true);
	const [paths, setPaths] = useState<{ text: string; path: string; }[]>([]);
	useEffect(() => {
		fetch('/api/routes')
			.then(response => response.json())
			.then(setPaths)
			.catch(console.error);
	});
	const toggleNavigationBarVisibility = () => {
		setNavigationBarVisibility(!showNavigationBar);
	};
	return (
		<div className="flex flex-auto flex-col">
			<button onClick={toggleNavigationBarVisibility} className=" text-white">{(showNavigationBar) ? 'close' : 'open'}</button>
			<div className={`${showNavigationBar ? 'visible' : 'invisible'}`}>
				<Link className=" text-white" href="/">API</Link><br />
				{paths.map(({ text = 'null', path = '/' }) => {
					return (<><Link className=" text-white" href={path}>{text}</Link><br /></>);
				})}
			</div>
		</div>
	);
};