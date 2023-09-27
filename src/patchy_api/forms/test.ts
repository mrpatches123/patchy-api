interface Buttons {
	callback: (data: string) => void;
}
function test(data: Buttons[]) {
	return data;
}

test([
	...[{
		callback: (data) => {

		}
	}],
	{
		callback: (data) => {

		}
	}
]);