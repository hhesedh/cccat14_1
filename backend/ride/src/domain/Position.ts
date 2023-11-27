import crypto from "crypto";

export default class Position {
	private constructor(
		public readonly positionId: string,
		public readonly rideId: string,
		public readonly lat: number,
		public readonly long: number,
		public readonly date: Date,
	) { }

	static create(rideId: string, lat: number, long: number) {
		const positionId = crypto.randomUUID();
		const date = new Date();
		return new Position(positionId, rideId, lat, long, date);
	}

	static restore(positionId: string, rideId: string, lat: number, long: number, date: Date) {
		return new Position(positionId, rideId, lat, long, date);
	}
}

