import { FilteredData } from "@/lib/types";

interface Props {
  data: FilteredData;
}

export default function DataInspector({ data }: Props) {
  return (
    <div className="nf-card rounded-lg p-6">
      <h2 className="font-display text-xl font-semibold mb-4">
        Data Inspector
      </h2>
      <div id="dataInspector" className="space-y-4">
        {data.trees.map((tree) => (
          <div key={tree.id} className="nf-card rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold">
                {tree.name}
              </h3>
              <span
                className={`tag-badge ${tree.status === "active" ? "tag-status-active" : "tag-status-inactive"}`}
              >
                {tree.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tree.clusters.map((cluster) => (
                <div
                  key={cluster.uid}
                  className="border rounded-lg p-3"
                  style={{ borderColor: "var(--nf-gray-600)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{cluster.name}</h4>
                    <span className="tag-badge tag-cluster text-xs">
                      {cluster.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {data.areas
                      .filter((a) => a.cluster_uid === cluster.uid)
                      .map((area) => (
                        <div key={area.uid}>
                          <div className="flex items-center justify-between text-xs">
                            <span style={{ color: "var(--nf-gray-400)" }}>
                              {area.name}
                            </span>
                            <span
                              className={`tag-badge ${area.status === "active" ? "tag-status-active" : "tag-status-inactive"}`}
                              style={{
                                fontSize: "0.6rem",
                                padding: "0.125rem 0.375rem",
                              }}
                            >
                              {area.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {area.tags.map((tag) => (
                              <span
                                key={tag}
                                className="tag-badge tag-area"
                                style={{
                                  fontSize: "0.6rem",
                                  padding: "0.125rem 0.25rem",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
