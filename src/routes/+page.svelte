<script lang="ts">
	import { BASE_API_URL } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		data: {
			categories: {
				id: number;
				name: string;
			}[];
		};
	}

	let { data }: Props = $props();

	let categories = $state(data.categories);
	let searchQuery = $state('');

	function filterCategories() {
		fetch(`${BASE_API_URL}/api/categories/search?name=${searchQuery}`).then(async (res) => {
			categories = await res.json();
		});
	}

	function deleteCategory(id: number) {
		if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return;

		fetch(`${BASE_API_URL}/api/categories/${id}`, { method: 'DELETE' }).then((res) => {
			if (res.ok) {
				categories = categories.filter((c) => c.id !== id);
			}
		});
	}

	let openDialog = $state(false);

	let dialogInputValue = $state('');

	let dialogState: 'new' | 'edit' = $state('new');

	let selectedCategoryId: number = $state(0);
</script>

<div class="px-20 pt-5">
	<div class="mt-5">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-lg font-semibold">Categories</h2>

			<Button
				size="sm"
				onclick={() => {
					openDialog = true;
					dialogState = 'new';
				}}>New</Button
			>
		</div>

		<div class="flex items-center justify-between gap-2">
			<Input type="search" bind:value={searchQuery} placeholder="Search..." />

			<Button size="sm" onclick={filterCategories}>search</Button>
		</div>

		<Table.Root class="mt-2 rounded-md border">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">ID</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head class="w-[50px]"></Table.Head>
					<Table.Head class="w-[50px]"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each categories as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{item.id}</Table.Cell>
						<Table.Cell>{item.name}</Table.Cell>
						<Table.Cell>
							<Button
								color="primary"
								size="icon"
								title="Редагувати"
								onclick={() => {
									dialogInputValue = item.name;
									dialogState = 'edit';
									selectedCategoryId = item.id;
									openDialog = true;
								}}
							>
								<span aria-label="Редагувати" title="Редагувати">✏️</span>
							</Button>
						</Table.Cell>
						<Table.Cell>
							<Button
								color="destructive"
								size="icon"
								title="Видалити"
								onclick={() => deleteCategory(item.id)}
							>
								<span aria-label="Видалити" title="Видалити">🗑️</span>
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<Dialog.Root
	bind:open={openDialog}
	onOpenChange={(open) => {
		if (!open) {
			dialogInputValue = '';
		}
	}}
>
	<Dialog.Content class="flex flex-col justify-end gap-2">
		<Input name="name" placeholder="Category name" bind:value={dialogInputValue} />

		<Button
			type="submit"
			onclick={() => {
				const value = dialogInputValue;

				if (dialogState === 'edit') {
					fetch(`${BASE_API_URL}/api/categories/${selectedCategoryId}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name: dialogInputValue })
					}).then((res) => {
						if (res.ok) {
							const item = categories.find((c) => c.id === selectedCategoryId);
							if (!item) return;
							item.name = dialogInputValue;
							dialogInputValue = '';
							openDialog = false;
						}
					});
				} else if (dialogState === 'new') {
					fetch(`${BASE_API_URL}/api/categories`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name: value })
					}).then(async (res) => {
						if (res.ok) {
							categories = [await res.json(), ...categories];
							dialogInputValue = '';
							openDialog = false;
						} else {
							alert((await res.json()).details);
						}
					});
				}
			}}
		>
			Submit
		</Button>
	</Dialog.Content>
</Dialog.Root>
