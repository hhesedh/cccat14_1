import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";

export default class GetPosition {
	constructor(
		private readonly positionRepository: PositionRepository
	) { }

	async execute(input: Input): Promise<Position> {
		const position = await this.positionRepository.getById(input.positionId);
		if (!position) throw new Error("position not found");
		return position;
	}
}

type Input = {
	positionId: string;
}