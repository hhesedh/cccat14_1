import crypto from "crypto";
import pgp from "pg-promise";

type Coordinate = { lat: number, long: number }
export async function requestRide({ passengerId, from, to }: { passengerId: string, from: Coordinate, to: Coordinate }) {

    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
        const [account] = await connection.query("select * from cccat14.account where account_id = $1", [passengerId]);
        if (!account.is_passenger) throw new Error("O id não é de passageiro");
        const passengerRides = await connection.query("select * from cccat14.ride where passenger_id = $1", [passengerId]);
        const passengerHasRideInProgress = passengerRides.some((ride: any) => ride.status !== 'completed');
        if (passengerHasRideInProgress) throw new Error("O passageiro possui corrida(s) em andamento");
        const rideId = crypto.randomUUID();
        const ride = {
            rideId,
            passengerId,
            date: new Date(),
            status: "requested",
            from,
            to,
        }

        await connection.query("INSERT INTO cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8);",
            [ride.rideId, ride.passengerId, ride.status, ride.from.lat, ride.from.long, ride.to.lat, ride.to.long, ride.date]);
        return { rideId };
    } finally {
        await connection.$pool.end();
    }
}


export async function GetRide(rideId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [ride] = await connection.query("select * from cccat14.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
    return ride;
}