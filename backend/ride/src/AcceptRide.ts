import AccountDAO from "./AccountDAO";
import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class AcceptRide {
	constructor(
		private readonly rideDAO: RideDAO,
		private readonly AccountDAO: AccountDAO,
		private readonly logger: Logger
	) { }

	async execute(ride_id: string, driver_id: string) {
		const account = await this.AccountDAO.getById(driver_id);
		if (!account?.is_driver) throw new Error("Conta deve ser de um motorista");
		const ride = await this.rideDAO.getById(ride_id);

		if (ride?.status !== 'requested') throw new Error("Corrida deve ter o status requested");
		const driverRides = await this.rideDAO.getByDriverId(driver_id);
		console.log(driverRides);
		const driverHasPendentsRides = driverRides.some(ride => ride.status === 'accepted' || ride.status === 'in_progress');

		if (driverHasPendentsRides) throw new Error("Motorista não pode ter outra corrida com status accepted ou in_progress");
		await this.rideDAO.acceptRide(ride_id, driver_id);
	}
}