import { requestRide } from "../src/ride";

test('Não deve criar corrida se o  is_passenger do passageiro for false', async () => {
    const ride = {
        accountId: '04724c7a-4c19-416c-86eb-ab92ce71e951',
        from: { lat: 1, long: 2 },
        to: { lat: 1, long: 2 }
    }
    requestRide(ride);

    await expect(() => requestRide(ride)).rejects.toThrow(new Error("O id não é de passageiro"));

});