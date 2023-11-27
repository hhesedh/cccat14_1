import Position from "../../domain/Position";

export default interface PositionRepository {
	save(position: Position): Promise<void>;
	getById(positionId: string): Promise<Position | undefined>;
}
