import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
	const [showNavBar, setNavBarVisibility] = useState(false);
	const navBarToggle = () => { setNavBarVisibility(!showNavBar); };
	return (
		<header>
			<div className="text-red-700">wdklwdkldwk</div>
			<button onClick={navBarToggle}></button>

			<div className={`invisible flex flex-row`}>
				<ol>
					<ul>
						<Link href="/"> Home</Link>
					</ul>
					<ul>
						<Link href="/about"> About</Link>
					</ul>
					<ul>
						<b>Classes</b>
					</ul>
				</ol>



			</div>
		</header >
	);
};
