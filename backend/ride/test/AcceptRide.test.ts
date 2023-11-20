import AcceptRide from "../src/AcceptRide";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, logger);
	getRide = new GetRide(rideDAO, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO, logger);
})


test("Deve verificar se o account_id tem is_driver true", async () => {

	const DriverInputSignup = {
		name: "Fabio jhon",
		email: `john.fabio${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const driverOutputSignup = await signup.execute(DriverInputSignup);
	const passengerInputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const passengerOutputSignup = await signup.execute(passengerInputSignup);
	const inputRequestRide = {
		passengerId: passengerOutputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};

	const outputRequestRide = await requestRide.execute(inputRequestRide);

	await expect(() => acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId)).rejects.toThrow(new Error("Conta deve ser de um motorista"));





});