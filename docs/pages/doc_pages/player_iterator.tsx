import NavigationBar from "../navigationbar";
import Link from "next/link";
export default function PlayerIterator() {
	return (
		<div className="flex flex-auto flex-row">
			<NavigationBar />
			<div className=" flex flex-auto flex-col justify-start m-10">
				<h1 className="class">PlayerIterator</h1>
				<br />
				<h5 className="desc">Description: Wraps world.getPlayers() such that it only returns players who have commands ran on them</h5><br />
				<h5 className="methods">Methods</h5><br />
				<ul className="ml-10">
					<li>
						<h5 className="method">iterate</h5><br />
						<h5>
							<span className="method-ex">iterate</span>
							<span className="parentheis">(</span>
							<span className="param">callback: </span>
							<span className="parentheis">(</span>
							<span className="param">player: </span>
							<span className="class-param">Player</span>
							<span className="parentheis">)</span>
							<span className="op"> =&gt; </span>
							<span className="parentheis">&#123; &nbsp;&#125;</span>
							<span className="parentheis">):</span>
							<span className="op"> void</span>
						</h5><br />
						<h5 className="params">Parameters</h5>
						<ul className="ml-10">
							<li>
								<span className="param">callback: </span>
								<span className="parentheis">(</span>
								<span className="param">player: </span>
								<Link className="class-param" href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/player">Player</Link>
								<span className="parentheis">)</span>
								<span className="op"> =&gt; </span>
								<span className="parentheis">&#123; &nbsp;&#125;</span>
							</li>
						</ul>
						<h5 className="returns">Returns</h5> <span className="op">void</span>
					</li>
					<li>
						<h5 className="method">array</h5><br />
						<h5>
							<span className="method-ex">object</span>
							<span className="parentheis">(</span>
							<span className="parentheis">): </span>
							<span className="class-param">Player</span>
							<span className="parentheis">[]</span>
						</h5><br />
						<h5 className="returns">Returns</h5>
						<span className="parentheis"> &#123;</span>
						<span className="parentheis">[</span>
						<span className="param">playerId: </span>
						<span className="class-param">String</span>
						<span className="parentheis">]: </span>
						<Link className="class-param" href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/player">Player</Link>
						<span className="parentheis">&#125; </span>
					</li>
					<li>
						<h5 className="method">object</h5><br />
						<h5>
							<span className="method-ex">object</span>
							<span className="parentheis">(</span>
							<span className="parentheis">):</span>
							<span className="parentheis"> &#123;</span>
							<span className="parentheis">[</span>
							<span className="param">playerId: </span>
							<span className="class-param">String</span>
							<span className="parentheis">]:</span>
							<span className="class-param"> Player</span>
							<span className="parentheis">&#125; </span>
						</h5><br />
						<h5 className="returns">Returns</h5>
						<span className="parentheis"> &#123;</span>
						<span className="parentheis">[</span>
						<span className="param">playerId: </span>
						<span className="class-param">String</span>
						<span className="parentheis">]: </span>
						<Link className="class-param" href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/player">Player</Link>
						<span className="parentheis">&#125; </span>
					</li>
					<li>
						<h5 className="method">ids</h5><br />
						<h5>
							<span className="method-ex">ids</span>
							<span className="parentheis">(</span>
							<span className="parentheis">): </span>
							<span className="class-param">String</span>
							<span className="op">[]</span>
						</h5><br />
						<h5 className="returns">Returns</h5> <span className="class-param" >String</span><span className="op">[]</span>
					</li>
					<li>
						<h5 className="method">name</h5><br />
						<h5>
							<span className="method-ex">name</span>
							<span className="parentheis">(</span>
							<span className="parentheis">): </span>
							<span className="class-param">String</span>
							<span className="op">[]</span>
						</h5><br />
						<h5 className="returns">Returns</h5> <span className="class-param" >String</span><span className="op">[]</span>
					</li>
					<li>
						<h5 className="method"> [Symbol.iterator]</h5><br />
						<h5>
							<span className="method-ex">[Symbol.iterator]</span>
							<span className="parentheis">(</span>
							<span className="parentheis">): </span>
							<span className="class-param">Iterator</span>
							<span className=" parentheis">&lt;</span>
							<span className="class-param">Player</span><span className="parentheis">&gt;</span>
						</h5><br />
						<h5 className="returns">Returns</h5> <span className="class-param">Iterator</span><span className=" parentheis">&lt;</span><Link className="class-param" href="https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/player">Player</Link><span className="parentheis">&gt;</span>
					</li>
				</ul>
			</div>
		</div >
	);
}
