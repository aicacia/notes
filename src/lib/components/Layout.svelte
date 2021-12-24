<script lang="ts">
	import RemoteStorage from './RemoteStorage.svelte';
	import Notifications from './Notifications.svelte';
</script>

<div class="h-screen w-screen bg-gray-200 flex">
	<div class="flex flex-col flex-grow">
		<slot />
	</div>
	<div class="absolute left-0 bottom-0 z-20">
		<RemoteStorage />
	</div>
	<Notifications />
</div>
