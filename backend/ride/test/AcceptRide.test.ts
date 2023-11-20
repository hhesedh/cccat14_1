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

async function createRequestRide(requestRide: RequestRide, accountId: string) {
	const inputRequestRide = {
		passengerId: accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};

	return requestRide.execute(inputRequestRide);
}

async function signupPassenger(signup: Signup) {
	const passenger = createUser("Jhon Passageiro", true);
	return signup.execute(passenger);

}

async function signupDriver(signup: Signup) {
	const driver = createUser("Fabio Motorista", false);
	return signup.execute(driver);
}


function createUser(name: string, isPassenger: boolean) {
	const credencial = isPassenger ? 'passageiro' : 'motorista';
	const email = `${name.split(" ")[0].toLowerCase()}.${credencial};`
	return {
		name,
		email: `${email}${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger,
		isDriver: !isPassenger,
		password: "123456",
		...(isPassenger ? {} : { carPlate: generateCarPlate() })
	};
}


function generateCarPlate(): string {
	const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const letrasAleatorias = Array(3).fill(null).map(() => letras[Math.floor(Math.random() * 26)]);
	const numerosAleatorios = Array(4).fill(null).map(() => Math.floor(Math.random() * 10));
	return [...letrasAleatorias, ...numerosAleatorios].join("");
}

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
test('deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro', async () => {
	const driverOutputSignup = await signupDriver(signup);
	const passengerOutputSignup = await signupPassenger(signup);
	const outputRequestRide = await createRequestRide(requestRide, passengerOutputSignup.accountId);
	await expect(() => acceptRide.execute(outputRequestRide.rideId, driverOutputSignup.accountId)).rejects.toThrow(new Error("Motorista não pode ter outra corrida com status accepted ou in_progress"));
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