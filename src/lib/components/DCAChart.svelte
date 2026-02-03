<script lang="ts">
  import uPlot from "uplot";
  import "uplot/dist/uPlot.min.css";

  let { data, investmentAmount, onRangeSelect } = $props<{
    data: any[];
    investmentAmount: string | number;
    onRangeSelect: (range: { start: string; end: string }) => void;
  }>();
  let chartEl: HTMLDivElement;
  let plot: uPlot;

  $effect(() => {
    if (!chartEl || !data?.length) return;

    const opts = {
      width: chartEl.clientWidth,
      height: 400,
      padding: [20, 60, 20, 10],
      series: [
        {
          value: (u: any, v: any) => {
            if (!v) return "";
            return new Date(v * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            });
          },
        },
        {
          label: "Portfolio Value",
          stroke: "rgb(75, 192, 192)",
          value: (u: any, v: any) =>
            v != null ? `$${v.toLocaleString()}` : null,
        },
        {
          label: "Total Invested",
          stroke: "rgb(153, 102, 255)",
          value: (u: any, v: any) =>
            v != null ? `$${v.toLocaleString()}` : null,
        },
      ],
      axes: [
        {
          grid: { show: true },
          size: 40,
          values: (u: any, vals: any) =>
            vals.map((v: any) => {
              if (!v) return "";
              return new Date(v * 1000).getFullYear().toString();
            }),
        },
        {
          grid: { show: true },
          size: 60,
          values: (u: any, vals: any) =>
            vals.map((v: any) => {
              if (v == null) return "";
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(v);
            }),
        },
      ],
      hooks: {
        setScale: [
          (u: uPlot) => {
            const start = new Date((u.scales.x.min ?? 0) * 1000).toLocaleDateString();
            const end = new Date((u.scales.x.max ?? 0) * 1000).toLocaleDateString();
            console.log("Scale/Zoom changed:", { start, end });
            onRangeSelect?.({ start, end });
          },
        ],
      },
    };

    const chartData: (number | null)[][] = [
      data.map((d: any) => (d?.date ? new Date(d.date).getTime() / 1000 : null)),
      data.map((d: any) => {
        if (!d?.totalShares || !d?.value) return null;
        return Number(d.totalShares) * Number(d.value);
      }),
      data.map((d: any) => d?.invested ?? null),
    ];

    if (plot) plot.destroy();
    // @ts-ignore - uPlot types are complex
    plot = new uPlot(opts, chartData, chartEl);

    const resizeObserver = new ResizeObserver(() => {
      plot.setSize({
        width: chartEl.clientWidth,
        height: opts.height,
      });
    });

    resizeObserver.observe(chartEl);

    return () => {
      resizeObserver.disconnect();
      if (plot) plot.destroy();
    };
  });
</script>

<div class="chart w-full h-[400px] mb-8 p-4" bind:this={chartEl}></div>

<style>
  :global(.uplot) {
    width: 100% !important;
    height: 100% !important;
    font-family: "Lexend", Avenir, Helvetica, sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-weight: 300;
  }
</style>
