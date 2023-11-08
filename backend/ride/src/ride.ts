import pgp from "pg-promise";

type Coordinate = { lat: number, long: number }
export async function requestRide({ accountId, from, to }: { accountId: string, from: Coordinate, to: Coordinate }) {

    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
        const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
        if (!account.is_passenger) throw new Error("O id não é de passageiro");
        const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1", [accountId]);
        console.log('ride', ride);
    } finally {
        await connection.$pool.end();
    }

}