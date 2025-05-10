const setMaterialObject = (materials: string[], materialArrayData: any) => {
	const materialObjectData: any = {};
	for (const key in materials) {
		const material = materials[key];
		materialObjectData[`${material}`] = convertArrayToObject(materialArrayData[`${material}`]);
	}
	return materialObjectData;
};

const convertArrayToObject = (array: any) => {
	const arrayObject = {} as any;
	let lastDate = null;

	for (const item of array) {
		const currentDate = new Date(item.datum);
		const currentDateKey = currentDate.toISOString().split('T')[0];

		if (lastDate) {
			const date = new Date(lastDate);
			while (date < currentDate) {
				date.setDate(date.getDate() + 1);
				const key = date.toISOString().split('T')[0];
				arrayObject[key] = { ...arrayObject[lastDate] };
			}
		}

		arrayObject[currentDateKey] = { ...item };
		lastDate = currentDateKey;
	}
	return arrayObject;
};

const fillDateInMatirialJSON = (materials: string[], baseMaterial: string, materialObjectData: any) => {
	const finalObj: any = {};
	for (const key in materialObjectData[baseMaterial]) {
		if (Object.prototype.hasOwnProperty.call(materialObjectData[baseMaterial], key)) {
			const element = materialObjectData[baseMaterial][key];
			finalObj[key] = {
				date: new Date(element.datum),
				close: element?.letzter || null,
				open: element?.erster || null,
				high: element?.hoch || null,
				low: element?.letzter_ || null
			};

			for (const key1 of materials) {
				finalObj[key][`compareValue${key1}`] = materialObjectData[key1][key]?.letzter || null;
			}
		}
	}
	return finalObj;
};

const chartService = {
	setMaterialObject: setMaterialObject,
	fillDateInMatirialJSON: fillDateInMatirialJSON
};

export default chartService;
