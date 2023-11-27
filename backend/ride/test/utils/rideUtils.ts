import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";


export async function createRequestRide(requestRide: RequestRide, accountId: string) {
	const inputRequestRide = {
		passengerId: accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};

	return requestRide.execute(inputRequestRide);
}

export async function signupPassenger(signup: Signup) {
	const passenger = createUser("Jhon Passageiro", true);
	return signup.execute(passenger);

}

export async function signupDriver(signup: Signup) {
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
