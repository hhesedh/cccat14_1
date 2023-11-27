import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";


let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
	const rideRepositoryDatabase = new RideRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new Signup(accountRepositoryDatabase, logger);
	getAccount = new GetAccount(accountRepositoryDatabase);
	requestRide = new RequestRide(rideRepositoryDatabase, accountRepositoryDatabase, logger);
	getRide = new GetRide(rideRepositoryDatabase, logger);
	acceptRide = new AcceptRide(rideRepositoryDatabase, accountRepositoryDatabase);
})

test("Deve aceitar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("accepted");
	expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Não pode aceitar uma corrida se a conta não for de um motorista", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only drivers can accept a ride"))
});

afterEach(async () => {
	await databaseConnection.close();
});
