<script>
  let { children } = $props();
  import "../app.css";
  import Toast from "$lib/components/Toast.svelte";
</script>

<nav class="p-4 md:p-8 max-w-4xl mx-auto">
  <a href="/" class="inline-flex items-center gap-2">
    <img src="/logo.svg" alt="DCA Insights" class="w-auto h-12" />
  </a>
</nav>

{@render children()}

<Toast />
