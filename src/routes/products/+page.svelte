<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import Select from '$lib/comps/Select.svelte';
	import { BASE_API_URL } from '$lib';
	interface Product {
		id: number;
		categoryId: number;
		name: string;
		producer: string;
		description: string;
	}

	interface Props {
		data: {
			categories: { id: number; name: string }[];
		};
		products: Product[];
	}

	let { data }: Props = $props();

	console.log(data);

	let products: Product[] = $state(data.products);

	let searchCategory = $state('');
	let filteredProducts = $state(products);

	let openDialog = $state(false);
	let dialogState: 'new' | 'edit' = $state('new');
</script>

<div class="px-20 pt-5">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-semibold">Products</h2>
		<Button onclick={() => {}}>Додати продукт</Button>
	</div>
	<div class="mb-4 flex items-center gap-2">
		<Input placeholder="Пошук за id категорії..." bind:value={searchCategory} oninput={() => {}} />
	</div>
	<Table.Root>
		<Table.Caption>Список продуктів</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>ID</Table.Head>
				<Table.Head>ID Категорії</Table.Head>
				<Table.Head>Назва товару</Table.Head>
				<Table.Head>Виробник</Table.Head>
				<Table.Head>Характеристика</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each products as product, i (i)}
				<Table.Row>
					<Table.Cell>{product.id}</Table.Cell>
					<Table.Cell>{product.categoryId}</Table.Cell>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell>{product.producer}</Table.Cell>
					<Table.Cell>{product.description}</Table.Cell>
					<Table.Cell>
						<Button size="sm" variant="outline" onclick={() => {}}>Редагувати</Button>
						<Button size="sm" variant="destructive" onclick={() => {}}>Видалити</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<Dialog.Root open={openDialog} onOpenChange={(open) => (openDialog = open)}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title
					>{dialogState === 'new' ? 'Додати продукт' : 'Редагувати продукт'}</Dialog.Title
				>
			</Dialog.Header>
			<form
				class="flex flex-col"
				onsubmit={(e) => {
					e.preventDefault();

					var formData = new FormData(e.currentTarget);
					// output as an object
					const data = Object.fromEntries(formData);

					data.categoryId = parseInt(data.categoryId);

					fetch(`${BASE_API_URL}/api/products`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(data)
					}).then(async (res) => {
						if (res.ok) {
							products = [await res.json(), ...products];
						} else {
							console.log(res);
							alert((await res.json()).details);
						}

						openDialog = false;
					});
				}}
			>
				<div class="mb-5 flex flex-col gap-2">
					<Select
						name="categoryId"
						options={data.categories.map((c) => ({ value: c.id, label: c.name }))}
					/>

					<Input placeholder="Назва товару" name="name" />
					<Input placeholder="Виробник" name="producer" />
					<Input placeholder="Характеристика" name="description" />
				</div>
				<Dialog.Footer>
					<Button type="submit">Додати</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
