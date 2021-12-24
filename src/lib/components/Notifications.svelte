<script lang="ts">
	import { notifications, removeNotification } from '$lib/state/notifications';
</script>

<div class="p-2 absolute bottom-0 w-full">
	{#each $notifications as notification (notification.id.toString())}
		<div
			class="flex items-center rounded py-2 px-3 shadow-md mb-2 cursor-pointer"
			class:bg-green-500={notification.type === 'success'}
			class:bg-red-500={notification.type === 'error'}
			on:click={() => removeNotification(notification.id)}
		>
			{#if notification.type === 'error'}
				<div class="text-red-500 rounded-full bg-white mr-3">
					<svg
						width="1.8em"
						height="1.8em"
						viewBox="0 0 16 16"
						class="bi bi-x"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
						/>
						<path
							fill-rule="evenodd"
							d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
						/>
					</svg>
				</div>
			{/if}
			<div class="text-white max-w-xs ">{notification.message}</div>
		</div>
	{/each}
</div>
