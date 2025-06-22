import { Filters } from "@/lib/types";
import { seedData } from "@/lib/seedData";

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
}

export default function ControlsPanel({ filters, setFilters }: Props) {
  const handleTreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, tree: e.target.value });
  };

  const toggleStatus = () => {
    setFilters({
      ...filters,
      status: filters.status === "active" ? "all" : "active",
    });
  };

  const toggleClusters = () => {
    setFilters({
      ...filters,
      type: filters.type === "clusters" ? "all" : "clusters",
    });
  };

  const toggleAreas = () => {
    setFilters({
      ...filters,
      type: filters.type === "areas" ? "all" : "areas",
    });
  };

  const reset = () => {
    setFilters({ tree: "all", status: "all", type: "all", search: "" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="nf-card rounded-lg p-6 mb-8">
      <h2 className="font-display text-xl font-semibold mb-4">
        Controls & Filters
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          id="treeSelect"
          className="px-4 py-2 rounded-lg border"
          style={{
            background: "var(--nf-gray-700)",
            borderColor: "var(--nf-gray-600)",
            color: "var(--nf-gray-200)",
          }}
          value={filters.tree}
          onChange={handleTreeChange}
        >
          <option value="all">All Trees</option>
          {seedData.trees.map((tree) => (
            <option key={tree.id} value={tree.id}>
              {tree.name}
            </option>
          ))}
        </select>
        <button
          id="filterActive"
          className={`nf-btn-secondary px-4 py-2 rounded-lg ${filters.status === "active" ? "filter-active" : ""}`}
          onClick={toggleStatus}
        >
          Active Only
        </button>
        <button
          id="filterClusters"
          className={`nf-btn-secondary px-4 py-2 rounded-lg ${filters.type === "clusters" ? "filter-active" : ""}`}
          onClick={toggleClusters}
        >
          Clusters
        </button>
        <button
          id="filterAreas"
          className={`nf-btn-secondary px-4 py-2 rounded-lg ${filters.type === "areas" ? "filter-active" : ""}`}
          onClick={toggleAreas}
        >
          Areas
        </button>
        <button
          id="resetFilters"
          className="nf-btn-primary px-4 py-2 rounded-lg"
          onClick={reset}
        >
          Reset Filters
        </button>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          id="searchInput"
          placeholder="Search tags, clusters, areas..."
          aria-label="Search"
          className="px-4 py-2 rounded-lg border flex-1"
          style={{
            background: "var(--nf-gray-700)",
            borderColor: "var(--nf-gray-600)",
            color: "var(--nf-gray-200)",
          }}
          value={filters.search}
          onChange={handleSearch}
        />
        <button
          id="expandAll"
          className="nf-btn-secondary px-4 py-2 rounded-lg"
        >
          Expand All
        </button>
        <button
          id="collapseAll"
          className="nf-btn-secondary px-4 py-2 rounded-lg"
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}
