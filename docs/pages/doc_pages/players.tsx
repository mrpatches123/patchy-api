import NavigationBar from "../navigationbar";
import Link from "next/link";

export default function Players() {
	return (
		<div className="flex flex-auto flex-row">
			<NavigationBar />
			<div className=" flex flex-auto flex-col justify-start m-10">
				<h1 className="class">Players</h1>
				<br />
				<h5 className="desc">Description: Wraps world.getPlayers() such that it only returns players who have commands ran on them</h5><br />
				<h5 className="methods">Methods</h5><br />
				<ul className="ml-10">
					<li>
						<h5 className="method">get</h5><br />
						<h5 className="method-ex">get<span className="parentheis">(</span><span className="param">entityQueryOptions:</span> <span className="class-param">EntityQueryOptions</span><span className="parentheis">)</span>: <span className="class-param">PlayerIterator</span></h5><br />
						<h5 className="params">Parameters</h5>
						<ul className="ml-10">
							<li>
								<h5 className="param">entityQueryOptions:</h5> <Link className="class-param" href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityqueryoptions">EntityQueryOptions</Link><br />
							</li>
						</ul>

						<h5 className="returns">Returns</h5> <Link className="class-param" href="/doc_pages/player_iterator">PlayerIterator</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}