import crypto from "crypto";
import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetPosition from "../src/application/usecase/GetPosition";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import { createRequestRide, signupDriver, signupPassenger } from "./utils/rideUtils";


let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getPositon: GetPosition;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new Signup(accountRepositoryDatabase, logger);
	getAccount = new GetAccount(accountRepositoryDatabase);
	requestRide = new RequestRide(rideRepository, accountRepositoryDatabase, logger);
	getRide = new GetRide(rideRepository, logger);
	acceptRide = new AcceptRide(rideRepository, accountRepositoryDatabase);
	startRide = new StartRide(rideRepository);
	updatePosition = new UpdatePosition(rideRepository, positionRepository);
	getPositon = new GetPosition(positionRepository);
})
test('Deve verificar se o id da corrida existe', async () => {
	const rideId = crypto.randomUUID();
	const input = { lat: 1, long: 2, rideId }
	await expect(() => updatePosition.execute(input))
		.rejects.toThrow(new Error("ride does not exists"));
});

test('Deve verificar se a corrida está em status "in_progress", se não estiver lançar um erro', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const { accountId: passengerId } = passengerOutputSignup;
	const outputRequestRide = await createRequestRide(requestRide, passengerId);
	const { accountId: driverId } = driverOutputSignup;
	const { rideId } = outputRequestRide
	await acceptRide.execute({ rideId, driverId });
	const inputUpdatePosition = { lat: 1, long: 2, rideId };
	await expect(() => updatePosition.execute(inputUpdatePosition))
		.rejects.toThrow(new Error("ride status must be in_progress"));
});

test('Deve verificar se a corrida está em status "in_progress", se não estiver lançar um erro', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const { accountId: passengerId } = passengerOutputSignup;
	const outputRequestRide = await createRequestRide(requestRide, passengerId);
	const { accountId: driverId } = driverOutputSignup;
	const { rideId } = outputRequestRide
	await acceptRide.execute({ rideId, driverId });
	await startRide.execute(outputRequestRide);
	const inputUpdatePosition = { lat: 1, long: 2, rideId };
	const { positionId } = await updatePosition.execute(inputUpdatePosition);
	expect(positionId).toBeDefined();
	const position = await getPositon.execute({ positionId });
	expect(position.lat).toBe(1);
	expect(position.long).toBe(2);
});
afterEach(async () => {
	await databaseConnection.close();
});