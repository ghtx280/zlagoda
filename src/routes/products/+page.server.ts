import { BASE_API_URL } from '$lib';

export const load = async () => {
	return {
		products: await fetch(`${BASE_API_URL}/api/products`).then((res) => res.json())
	};
};
