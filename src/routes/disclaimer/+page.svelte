<script lang="ts">
  import { AlertTriangle, DollarSign, TrendingUp, Shield } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Important Disclosures - DCA Insights</title>
  <meta name="description" content="Important financial disclosures and legal information" />
</svelte:head>

<main class="p-4 md:p-8 max-w-4xl mx-auto">
  <div class="text-center mb-12">
    <AlertTriangle class="w-16 h-16 text-yellow-500 mx-auto mb-6" />
    <h1 class="text-3xl font-bold mb-4">Important Disclosures</h1>
    <p class="text-gray-600">
      Please read these important disclosures before using DCA Insights.
    </p>
  </div>
  
  <div class="space-y-8">
    <!-- Educational Purpose Only -->
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-none">
          <Shield class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-2">Educational Purpose Only</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            DCA Insights is an educational tool designed to help users understand Dollar Cost Averaging strategies. 
            The information provided on this website is for informational and educational purposes only. 
            We do not provide financial advice, investment advice, or any professional advisory services.
          </p>
        </div>
      </div>
    </div>
    
    <!-- No Investment Advice -->
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-none">
          <TrendingUp class="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-2">Not Investment Advice</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            The historical performance data, calculations, and analysis presented on DCA Insights are for 
            illustrative and educational purposes only. Past performance does not guarantee future results. 
            Nothing on this website should be construed as a recommendation to buy, sell, or hold any 
            particular investment or investment strategy.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Risk Disclosure -->
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-none">
          <AlertTriangle class="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-2">Risk Disclosure</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            All investments involve risk, including the potential loss of principal. Dollar Cost Averaging 
            does not guarantee a profit or protect against loss in declining markets. The effectiveness of 
            DCA strategies depends on various factors including market conditions, economic factors, and 
            individual circumstances. You should consider your financial situation, investment objectives, 
            and risk tolerance before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Historical Data Disclaimer -->
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-none">
          <DollarSign class="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-2">Historical Data Limitations</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            The historical S&P 500 data and performance calculations presented on this website are based 
            on publicly available information. While we strive for accuracy, we cannot guarantee the 
            completeness or accuracy of this data. Historical returns do not reflect taxes, transaction 
            costs, or other fees that would have reduced returns. Results may vary if calculated using 
            different data sources or methodologies.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Affiliate Disclosure -->
    <div class="border border-gray-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-none">
          <DollarSign class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 class="text-lg font-bold mb-2">Affiliate Disclosure</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            DCA Insights may contain links to third-party products and services, including brokerage 
            platforms and financial tools. We may receive a commission or referral fee if you click on 
            these links and make a purchase or sign up for a service. This comes at no additional cost 
            to you. We only recommend products and services that we believe provide value to our users.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Terms of Service -->
    <div class="border-t border-gray-200 pt-8 mt-8">
      <h2 class="text-xl font-bold mb-4">Terms of Service</h2>
      <p class="text-gray-600 text-sm leading-relaxed mb-4">
        By using DCA Insights, you agree to our Terms of Service and Privacy Policy. These documents 
        govern your use of our website and services. Please review them carefully.
      </p>
      <div class="flex flex-wrap gap-4">
        <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
        <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>
        <a href="/contact" class="text-blue-600 hover:underline">Contact Us</a>
      </div>
    </div>
    
    <!-- Last Updated -->
    <div class="text-sm text-gray-500 pt-4">
      <p>Last updated: January 7, 2026</p>
    </div>
  </div>
</main>
