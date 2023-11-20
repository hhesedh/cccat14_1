import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class StartRide {
	constructor(
		private readonly rideDAO: RideDAO,
		private readonly _: Logger
	) { }

	async execute(ride_id: string) {
		const ride = await this.rideDAO.getById(ride_id);
		if (ride.status !== 'accepted') throw new Error("Corrida deve ter status accepted");
		await this.rideDAO.startRide(ride.ride_id);
	}
}