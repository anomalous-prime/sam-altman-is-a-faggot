"use client";

import { useState } from "react";
import Script from "next/script";
import useFilters from "@/hooks/useFilters";
import ControlsPanel from "./ControlsPanel";
import StatsDashboard from "./StatsDashboard";
import TreeVisualization from "./TreeVisualization";
import TagCloud from "./TagCloud";
import DataInspector from "./DataInspector";

export default function NightForgeDemo() {
  const {
    filters,
    filteredData,
    setTree,
    toggleStatus,
    toggleClusters,
    toggleAreas,
    setSearch,
    resetFilters,
    setFilters,
  } = useFilters();
  const [isD3Ready, setIsD3Ready] = useState(false);

  const handleD3Load = () => {
    setIsD3Ready(true);
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
        strategy="afterInteractive"
        onLoad={handleD3Load}
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <header className="mb-8">
            <h1
              className="font-display text-4xl font-semibold mb-2"
              style={{ color: "var(--nf-primary-300)" }}
            >
              🌑 NightForge Tree API
            </h1>
            <p className="text-lg" style={{ color: "var(--nf-gray-400)" }}>
              Interactive demonstration of tree-structured data management
            </p>
          </header>

          <ControlsPanel filters={filters} setFilters={setFilters} />
          <StatsDashboard data={filteredData} />
          <TreeVisualization data={filteredData} isD3Ready={isD3Ready} />
          <TagCloud
            data={filteredData}
            filters={filters}
            setFilters={setFilters}
          />
          <DataInspector data={filteredData} />
        </div>
      </div>
    </>
  );
}
