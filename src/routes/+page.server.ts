import { BASE_API_URL } from '$lib';

function getJson(url: string) {
	return fetch(url).then((res) => res.json());
}

export const load = async () => {
	return {
		categories: await getJson(`${BASE_API_URL}/api/categories`)
	};
};
