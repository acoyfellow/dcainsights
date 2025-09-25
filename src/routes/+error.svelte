<script lang="ts">
  import { page } from "$app/stores";
  import { Home, ArrowLeft, RefreshCcw } from "lucide-svelte";
</script>

<svelte:head>
  <title>{$page.status} - {$page.error?.message}</title>
</svelte:head>

<div
  class="min-h-[70vh] flex items-center justify-center px-8 py-20 text-center gap-4 flex-col"
>
  <h1 class="text-6xl font-bold text-primary-600">{$page.status}</h1>

  <p class="text-2xl font-semibold text-zinc-900">
    {$page.error?.message || "Something went wrong."}
  </p>

  <p class="text-xl text-zinc-800 text-balance max-w-lg mx-auto">
    We're having trouble loading the data. You can try refreshing the page or
    going back to where you were.
  </p>

  <div class="flex gap-4 justify-center py-10 flex-col md:flex-row">
    <button
      onclick={() => history.back()}
      class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4" />
      Go Back
    </button>

    <button
      onclick={() => location.reload(true)}
      class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg cursor-pointer"
    >
      <RefreshCcw class="w-4 h-4" />
      Try Again
    </button>

    <a
      href="/"
      class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
    >
      <Home class="w-4 h-4" />
      Go Home
    </a>
  </div>
</div>
