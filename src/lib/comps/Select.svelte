<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	interface Props {
		value?: string;
		options: { value: string | number; label: string | number }[];
		name: string;
		class?: string;
	}

	let { value = $bindable(''), options, name, class: className }: Props = $props();

	const triggerContent = $derived(options.find((f) => f.value === value)?.label ?? 'Select item');
</script>

<Select.Root type="single" {name} bind:value>
	<Select.Trigger class={['w-full', className]}>
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		{#each options as item (item.value)}
			<Select.Item
				value={item.value}
				label={item.label.toString()}
				disabled={item.value === 'grapes'}
			>
				{item.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
