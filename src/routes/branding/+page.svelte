<script lang="ts">
  import { page } from "$app/stores";

  const fontWeights = [
    { weight: 100, name: "Thin" },
    { weight: 200, name: "ExtraLight" },
    { weight: 300, name: "Light" },
    { weight: 400, name: "Regular" },
    { weight: 500, name: "Medium" },
    { weight: 600, name: "SemiBold" },
    { weight: 700, name: "Bold" },
    { weight: 800, name: "ExtraBold" },
    { weight: 900, name: "Black" },
  ];

  const brandAssets = [
    { name: "Logo SVG", path: "/logo.svg", type: "SVG" },
    { name: "Favicon", path: "/favicon.ico", type: "ICO" },
    { name: "Favicon SVG", path: "/favicon.svg", type: "SVG" },
    { name: "Favicon 96x96", path: "/favicon-96x96.png", type: "PNG" },
    { name: "Apple Touch Icon", path: "/apple-touch-icon.png", type: "PNG" },
    {
      name: "Web App Manifest 192x192",
      path: "/web-app-manifest-192x192.png",
      type: "PNG",
    },
    {
      name: "Web App Manifest 512x512",
      path: "/web-app-manifest-512x512.png",
      type: "PNG",
    },
    { name: "Open Graph Image", path: "/og.png", type: "PNG" },
  ];
</script>

<svelte:head>
  <title>DCA Insights - Brand Guidelines</title>
  <meta
    name="description"
    content="Brand guidelines and assets for DCA Insights"
  />
  <meta property="og:url" content={$page.url.href} />
</svelte:head>

<nav class="p-4 md:p-8 max-w-4xl mx-auto">
  <a href="/" class="inline-flex items-center gap-2">
    <img src="/logo.svg" alt="DCA Insights" class="w-auto h-12" />
  </a>
</nav>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <h1 class="text-2xl md:text-4xl mb-8">Brand Guidelines</h1>

  <section class="mb-12">
    <h2 class="text-xl md:text-2xl mb-4">Typography</h2>
    <div class="mb-4">
      <p class="text-gray-600">Primary Font: Lexend</p>
      <p class="text-gray-600">Font Stack: "Lexend", serif</p>
    </div>

    <div class="grid gap-4">
      {#each fontWeights as { weight, name }}
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded">
          <div class="w-24 text-sm text-gray-600">{weight} - {name}</div>
          <div style="font-weight: {weight}" class="text-xl">
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl md:text-2xl mb-4">Brand Assets</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
      {#each brandAssets as asset}
        <div class="flex flex-col items-center p-4 bg-gray-50 rounded">
          <div
            class="w-32 h-32 flex items-center justify-center mb-4 bg-white rounded p-4"
          >
            <img
              src={asset.path}
              alt={asset.name}
              class="max-w-full max-h-full object-contain"
            />
          </div>
          <p class="text-sm font-medium text-center">{asset.name}</p>
          <p class="text-xs text-gray-600">{asset.type}</p>
        </div>
      {/each}
    </div>
  </section>
</main>
