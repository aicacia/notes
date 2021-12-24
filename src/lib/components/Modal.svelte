<script lang="ts">
	import MdClose from 'svelte-icons/md/MdClose.svelte';

	export let onClose: () => void = () => undefined;
	export let open = false;

	function close() {
		open = false;
		onClose();
	}
</script>

<div
	class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	class:hidden={!open}
>
	<div class="relative my-6 w-96 md:w-1/2 mx-auto">
		<div
			class="border-0 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
		>
			<div class="flex items-start justify-between p-2">
				<div class="flex-grow">
					<slot name="title" />
				</div>
				<button
					class="bg-transparent border-0 text-black outline-none focus:outline-none"
					on:click={close}
				>
					<div class="w-8 h-8"><MdClose /></div>
				</button>
			</div>
			<div class="relative p-2 flex-auto">
				<slot />
			</div>
		</div>
	</div>
</div>
<div class="opacity-25 fixed inset-0 z-40 bg-black" class:hidden={!open} />
