export function convertCoordinates(
	dados: Array<{
		date: Date;
		latitudeDecimalDegrees: string;
		longitudeDecimalDegrees: string;
		latitudeHemisphere: string;
		longitudeHemisphere: string;
		speed: number;
	}>,
) {
	const dadosFinais: {
		coordinates: Array<{
			date: string;
			latitudeDecimalDegrees: number;
			longitudeDecimalDegrees: number;
			speed: number;
		}>;
	} = { coordinates: [] };

	for (const data of dados) {
		let { date, latitudeDecimalDegrees, longitudeDecimalDegrees, speed } = data;

		// UTC-6 fix
		date = new Date(date.getTime() - 360 * 60000);

		// latitude
		if (latitudeDecimalDegrees.length === 9) {
			latitudeDecimalDegrees = `0${latitudeDecimalDegrees}`;
		}
		let g = parseFloat(latitudeDecimalDegrees.substring(0, 3));
		let d = parseFloat(latitudeDecimalDegrees.substring(3));
		latitudeDecimalDegrees = (g + d / 60).toString();
		if (data.latitudeHemisphere === "S") {
			latitudeDecimalDegrees = (
				parseFloat(latitudeDecimalDegrees) * -1
			).toString();
		}

		// longitude
		if (longitudeDecimalDegrees.length === 9) {
			longitudeDecimalDegrees = `0${longitudeDecimalDegrees}`;
		}
		g = parseFloat(longitudeDecimalDegrees.substring(0, 3));
		d = parseFloat(longitudeDecimalDegrees.substring(3));
		longitudeDecimalDegrees = (g + d / 60).toString();
		if (data.longitudeHemisphere === "W") {
			longitudeDecimalDegrees = (
				parseFloat(longitudeDecimalDegrees) * -1
			).toString();
		}

		// speed: km/h to mph
		speed = speed * 1.60934;

		dadosFinais.coordinates.push({
			date: date.toISOString(),
			latitudeDecimalDegrees: parseFloat(latitudeDecimalDegrees),
			longitudeDecimalDegrees: parseFloat(longitudeDecimalDegrees),
			speed,
		});
	}

	return dadosFinais;
}
