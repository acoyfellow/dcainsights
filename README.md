# DCA Insights

A comprehensive web application for analyzing Dollar Cost Averaging (DCA) investment strategies across different market scenarios. Built with SvelteKit and deployed at [dcainsights.com](https://dcainsights.com).

## Features

### 📊 Investment Analysis Tools

- **S&P 500 DCA Calculator** - Calculate historical DCA performance with customizable investment amounts and time periods
- **DCA vs Lump Sum Comparison** - Compare DCA strategy against lump sum investments using historical data
- **DCA Timing Optimizer** - Statistical analysis to find optimal investment timing (days of month/week)
- **Bear Market DCA Analysis** - Study DCA performance during major market downturns
- **Recession DCA Analysis** - Analyze DCA strategies during official US recession periods

### 🛠 Technical Features

- Interactive charts and visualizations using uPlot
- Historical S&P 500 data analysis
- Responsive design with Tailwind CSS
- Fast performance with SvelteKit and Svelte 5
- SEO optimized with proper meta tags and sitemaps

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS 4
- **Charts**: uPlot for high-performance data visualization
- **Icons**: Lucide Svelte
- **Date Handling**: date-fns
- **Deployment**: Cloudflare (via @sveltejs/adapter-cloudflare)
- **Language**: TypeScript

## Features in Detail

Each tool provides:
- Historical data analysis from S&P 500 performance
- Interactive charts and visualizations
- Customizable parameters (investment amounts, time periods)
- Statistical insights and performance metrics
- Mobile-responsive design

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Historical S&P 500 data from reliable financial data sources
- Built with modern web technologies for optimal performance
- Designed for both individual investors and financial education

## Ralph loop automation

This repo uses a lightweight Ralph loop to ship one story at a time.

- State lives in `AGENTS.md`, `scripts/ralph/prd.json`, `scripts/ralph/progress.txt`, `scripts/ralph/constraints.json`, and `scripts/ralph/failure.json`.
- The guard runs with `bash scripts/ralph/guard.sh scripts/ralph/constraints.json` and blocks large or risky diffs.
- GitHub Actions workflow: `.github/workflows/ralph.yml` (trigger via `workflow_dispatch` or on pushes to Ralph state files).
- Required secret: `RALPH_PAT` (or `RALPH_GITHUB_PAT`) with `repo` scope so the workflow can push updates.
- Persistent memory is limited to repository files and commit history.
