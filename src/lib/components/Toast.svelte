<script lang="ts">
  import { toastState } from "$lib/state.svelte";
  import { fly } from "svelte/transition";
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {#each toastState.messages as toast (toast.id)}
    <div
      transition:fly={{ x: 100 }}
      class="px-4 py-2 rounded shadow-lg {toast.type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'}"
    >
      {toast.message}
    </div>
  {/each}
</div>
