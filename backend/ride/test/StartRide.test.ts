import AcceptRide from "../src/AcceptRide";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";
import StartRide from "../src/StartRide";
import { createRequestRide, signupDriver, signupPassenger } from "./utils/rideUtils";

let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;





beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	requestRide = new RequestRide(rideDAO, logger);
	getRide = new GetRide(rideDAO, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO, logger);
	startRide = new StartRide(rideDAO, logger);
})


test('Deve verificar se a corrida está em status "accepted", se não estiver lançar um erro', async () => {
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await expect(() => startRide.execute(outputRequestRide.rideId))
		.rejects.toThrow(new Error("Corrida deve ter status accepted"));
});


test.only('Deve modificar o status da corrida para "in_progress"', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId);
	await startRide.execute(outputRequestRide.rideId);
	const ride = await getRide.execute(outputRequestRide.rideId);
	expect(ride.status).toBe("in_progress");
});