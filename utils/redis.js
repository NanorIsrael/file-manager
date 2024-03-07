import { createClient } from "redis";
import {promisify} from 'util';


class RedisClient {
	client
	constructor() {
		this.client = createClient()

		this.client.on('error', (err) => {
			console.error('Redis connection error:', err);
		})
	}

	isAlive() {
		return this.client.connected;
	}

	async get(value) {
		const promisifiedClient = promisify(this.client.GET).bind(this.client);
		const result = await promisifiedClient(value);
		return result ? JSON.parse(result) : null;
	}

	async set(key, value, expireTime) {
		const promisifiedClient = promisify(this.client.SET).bind(this.client);
		await promisifiedClient(key, JSON.stringify(value), { expireTime });
	}

	async det(key) {
		const promisifiedClient = promisify(this.client.DEL).bind(this.client);
		 await promisifiedClient(key);
	}
}
module.exports = RedisClient;
