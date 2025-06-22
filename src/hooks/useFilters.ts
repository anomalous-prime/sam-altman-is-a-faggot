import { useMemo, useState } from "react";
import { Filters, FilteredData } from "@/lib/types";
import { seedData } from "@/lib/seedData";

export function getFilteredData(filters: Filters): FilteredData {
  let filteredTrees = JSON.parse(JSON.stringify(seedData.trees));
  let filteredAreas = JSON.parse(JSON.stringify(seedData.areas));

  if (filters.tree !== "all") {
    filteredTrees = filteredTrees.filter((t: any) => t.id === filters.tree);
    const ids = filteredTrees.reduce(
      (acc: any[], t: any) => acc.concat(t.clusters.map((c: any) => c.uid)),
      [] as any[],
    );
    filteredAreas = filteredAreas.filter((a: any) =>
      ids.includes(a.cluster_uid),
    );
  }

  if (filters.status === "active") {
    filteredTrees = filteredTrees.filter((t: any) => t.status === "active");
    filteredAreas = filteredAreas.filter((a: any) => a.status === "active");
    filteredTrees.forEach((t: any) => {
      t.clusters = t.clusters.filter((c: any) => c.status === "active");
    });
  }

  if (filters.type === "clusters") {
    filteredAreas = [];
  } else if (filters.type === "areas") {
    filteredTrees.forEach((t: any) => {
      t.clusters = t.clusters.filter((c: any) =>
        filteredAreas.some((a: any) => a.cluster_uid === c.uid),
      );
    });
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filteredAreas = filteredAreas.filter(
      (a: any) =>
        a.name.toLowerCase().includes(term) ||
        a.tags.some((tag: string) => tag.toLowerCase().includes(term)),
    );
    filteredTrees.forEach((t: any) => {
      t.clusters = t.clusters.filter(
        (c: any) =>
          c.name.toLowerCase().includes(term) ||
          filteredAreas.some((a: any) => a.cluster_uid === c.uid),
      );
    });
    filteredTrees = filteredTrees.filter(
      (t: any) => t.name.toLowerCase().includes(term) || t.clusters.length > 0,
    );
  }

  return { trees: filteredTrees, areas: filteredAreas } as FilteredData;
}

export default function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    tree: "all",
    status: "all",
    type: "all",
    search: "",
  });

  const setTree = (tree: string) => setFilters((f) => ({ ...f, tree }));
  const toggleStatus = () =>
    setFilters((f) => ({
      ...f,
      status: f.status === "active" ? "all" : "active",
    }));
  const toggleClusters = () =>
    setFilters((f) => ({
      ...f,
      type: f.type === "clusters" ? "all" : "clusters",
    }));
  const toggleAreas = () =>
    setFilters((f) => ({ ...f, type: f.type === "areas" ? "all" : "areas" }));
  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const resetFilters = () =>
    setFilters({ tree: "all", status: "all", type: "all", search: "" });

  const filteredData = useMemo(() => getFilteredData(filters), [filters]);

  return {
    filters,
    filteredData,
    setTree,
    toggleStatus,
    toggleClusters,
    toggleAreas,
    setSearch,
    resetFilters,
    setFilters,
  } as const;
}
