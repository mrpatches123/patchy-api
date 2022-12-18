import NavigationBar from "../navigationbar";
export default function Players() {
	return (
		<div className="flex flex-auto flex-row">
			<NavigationBar />
			<div className=" flex flex-auto flex-col justify-start m-10">
				<h1 className=" text-green-600 text-xl">Players</h1>
				<br />
				<h5 className="text-gray-600 text-lg">Description: Wraps world.getPlayers() such that it only returns players who have commands ran on them</h5>
			</div>
		</div>
	);
}