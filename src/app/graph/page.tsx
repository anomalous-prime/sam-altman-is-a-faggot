import UnifiedTaxonomyView from "@/components/UnifiedTaxonomyView";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
        strategy="afterInteractive"
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <header className="mb-8">
            <h1
              className="font-display text-4xl font-semibold mb-2"
              style={{ color: "var(--nf-primary-300)" }}
            >
              🌑 NightForge Taxonomy
            </h1>
            <p className="text-lg" style={{ color: "var(--nf-gray-400)" }}>
              Unified tree visualization with comprehensive CRUD operations
            </p>
          </header>

          <div className="h-[calc(100vh-12rem)]">
            <UnifiedTaxonomyView />
          </div>
        </div>
      </div>
    </>
  );
}
