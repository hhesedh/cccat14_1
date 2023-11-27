import PositionRepository from "../../application/repository/PositionRepository";
import Position from "../../domain/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export default class PositionRepositoryDatabase implements PositionRepository {

	constructor(private readonly connection: DatabaseConnection) { }
	async save(position: Position) {
		await this.connection.query(
			"insert into cccat14.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
			[position.positionId, position.rideId, position.lat, position.long, position.date]
		);
	}

	async getById(positionId: string): Promise<Position | undefined> {
		const [position] = await this.connection.query("select * from cccat14.position where position_id = $1", [positionId]);
		if (!position) return;
		return Position.restore(position.position_id, position.ride_id, parseFloat(position.lat), parseFloat(position.long), position.date);

	}
}
