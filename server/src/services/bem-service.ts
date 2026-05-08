import { BemRepository } from "../repositories/bem-repository";

export class BemService {
	private bemRepository: BemRepository;

	constructor() {
		this.bemRepository = new BemRepository();
	}

	/**
	 * Get vehicles for a user.
	 */
	async getUserVehicles(userId: number) {
		return this.bemRepository.findByClienteId(userId);
	}
}
