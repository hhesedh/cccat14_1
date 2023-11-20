export default interface RideDAO {
	save(ride: any): Promise<void>;
	getById(rideId: string): Promise<any>;
	acceptRide(rideId: string, driver_id: string): Promise<any>;
	startRide(rideId: string): Promise<any>;
	getByDriverId(driver_id: string): Promise<any[]>;
}
