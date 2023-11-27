import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";


let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
	const rideRepositoryDatabase = new RideRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new Signup(accountRepositoryDatabase, logger);
	requestRide = new RequestRide(rideRepositoryDatabase, accountRepositoryDatabase, logger);
	getRide = new GetRide(rideRepositoryDatabase, logger);
})

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não existir", async function () {
	const inputRequestRide = {
		passengerId: "5fd82c60-ff7c-40d0-9bb8-f56d6836f1aa",
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account does not exist"));
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow("Passenger has an active ride");
});

afterEach(async () => {
	await databaseConnection.close();
});
