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
	}
}