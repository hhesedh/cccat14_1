import AcceptRide from "../src/AcceptRide";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";
import StartRide from "../src/StartRide";
import { createRequestRide, signupDriver, signupPassenger } from "./utils/rideUtils";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;


beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, logger);
	getRide = new GetRide(rideDAO, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO, logger);
	startRide = new StartRide(rideDAO, logger);
});


test("Deve verificar se o account_id tem is_driver true", async () => {
	const driverOutputSignup = await signupPassenger(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await expect(() => acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId)).rejects.toThrow(new Error("Conta deve ser de um motorista"));
});


test('Deve verificar se o status da corrida é "requested", se não for, lançar um erro', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await expect(() => acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId)).rejects.toThrow(new Error("Corrida deve ter o status requested"));
});

// verificar essa condição
test.only('deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await startRide.execute(outputRequestRide.rideId);
	const otherPassengerOutputSignup = await signupPassenger(signup);
	const secondOutputRequestRide = await createRequestRide(requestRide, otherPassengerOutputSignup.accountId);
	await expect(() => acceptRide.execute(secondOutputRequestRide.rideId, driverOutputSignup.accountId))
		.rejects.toThrow(new Error("Motorista não pode ter outra corrida com status accepted ou in_progress"));
});

test('Deve associar o driver_id na corrida e mudar o status para "accepted"', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId);
	const ride = await getRide.execute(outputRequestRide.rideId);
	expect(ride.status).toBe("accepted");
	expect(ride.driver_id).toBe(driverOutputSignup.accountId);
});