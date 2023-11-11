import { GetRide, requestRide } from "../src/ride";

test('Não deve criar corrida se o is_passenger do passageiro for false', async () => {
    const rideInput = {
        passengerId: '04724c7a-4c19-416c-86eb-ab92ce71e951',
        from: { lat: 1, long: 2 },
        to: { lat: 3, long: 4 }
    }
    await expect(() => requestRide(rideInput)).rejects.toThrow(new Error("O id não é de passageiro"));
});

test('Não deve criar corrida se o passageiro tiver uma corrida em andamento', async () => {
    const rideInput = {
        passengerId: '8b707076-a1d9-4cb8-b182-6dfcd399f806',
        from: { lat: 1, long: 2 },
        to: { lat: 3, long: 4 }
    }
    await expect(() => requestRide(rideInput)).rejects.toThrow(new Error("O passageiro possui corrida(s) em andamento"));
});



test("Deve criar uma conta para o motorista", async function () {
    const rideInput = {
        passengerId: '8db175b3-c95c-43cc-8281-df48f98b70fd',
        from: { lat: 1, long: 2 },
        to: { lat: 3, long: 4 }
    }
    const outputRequestRide = await requestRide(rideInput);
    const outputGetRide = await GetRide(outputRequestRide.rideId);
    expect(outputRequestRide.rideId).toBeDefined();
    expect(parseFloat(outputGetRide.from_lat)).toBe(rideInput.from.lat);
    expect(parseFloat(outputGetRide.from_long)).toBe(rideInput.from.long);
    expect(parseFloat(outputGetRide.to_lat)).toBe(rideInput.to.lat);
    expect(parseFloat(outputGetRide.to_long)).toBe(rideInput.to.long)
    expect(outputGetRide.passenger_id).toBe(rideInput.passengerId);
    expect(outputGetRide.status).toBe('requested');

});

