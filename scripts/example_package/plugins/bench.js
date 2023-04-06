import { eventBuilder, preformance, betweenVector3 } from '../../patchy_api/modules.js';
function isVectorInside(vectorA, vectorB, checkVector) {
	let minX = Math.min(vectorA.x, vectorB.x);
	let maxX = Math.max(vectorA.x, vectorB.x);
	let minY = Math.min(vectorA.y, vectorB.y);
	let maxY = Math.max(vectorA.y, vectorB.y);
	let minZ = Math.min(vectorA.z, vectorB.z);
	let maxZ = Math.max(vectorA.z, vectorB.z);
	if (checkVector.x >= minX && checkVector.x <= maxX && checkVector.y >= minY && checkVector.y <= maxY && checkVector.z >= minZ && checkVector.z <= maxZ)
		return true;
	return false;
}
eventBuilder.subscribe('bench', {
	worldLoad: () => {
		preformance.printTime(preformance.test({
			isVectorInside: (vector1, vector2, test) => {
				isVectorInside(vector1, vector2, test);
			},
			betweenVector3: (vector1, vector2, test) => {
				betweenVector3(test, vector1, vector2);
			}
		}, 1000, { x: 2, y: 8, z: 100 }, { x: -1, y: -2, z: 15 }, { x: 20, y: 20, z: -9 }));
	}
});