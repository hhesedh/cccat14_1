import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";

export default class UpdatePosition {
	constructor(
		private readonly rideRepository: RideRepository,
		private readonly positionRepository: PositionRepository
	) { }
	async execute(input: Input): Promise<{ positionId: string }> {
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("ride does not exists");
		if (ride.getStatus() !== 'in_progress') throw new Error("ride status must be in_progress");
		const position = Position.create(input.rideId, input.lat, input.long);
		await this.positionRepository.save(position);
		return { positionId: position.positionId }
	}
}
type Input = {
	rideId: string,
	lat: number,
	long: number
}
