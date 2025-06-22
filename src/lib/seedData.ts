export const seedData = {
            trees: [
                {
                    id: "tree_001",
                    name: "Enterprise Architecture",
                    status: "active",
                    created_at: "2024-01-15T10:30:00Z",
                    clusters: [
                        {
                            uid: "cluster_001",
                            name: "Infrastructure",
                            status: "active",
                            parent_id: null,
                            tree_id: "tree_001",
                            children: ["cluster_002", "cluster_003"],
                            areas: ["area_001", "area_002", "area_003", "area_004", "area_005"]
                        },
                        {
                            uid: "cluster_002",
                            name: "Cloud Services",
                            status: "active",
                            parent_id: "cluster_001",
                            tree_id: "tree_001",
                            children: [],
                            areas: ["area_006", "area_007", "area_008", "area_009"]
                        },
                        {
                            uid: "cluster_003",
                            name: "Security",
                            status: "active",
                            parent_id: "cluster_001",
                            tree_id: "tree_001",
                            children: [],
                            areas: ["area_010", "area_011", "area_012"]
                        }
                    ]
                },
                {
                    id: "tree_002",
                    name: "Product Development",
                    status: "active",
                    created_at: "2024-02-01T14:15:00Z",
                    clusters: [
                        {
                            uid: "cluster_004",
                            name: "Frontend",
                            status: "active",
                            parent_id: null,
                            tree_id: "tree_002",
                            children: ["cluster_005"],
                            areas: ["area_013", "area_014", "area_015", "area_016"]
                        },
                        {
                            uid: "cluster_005",
                            name: "UI Components",
                            status: "active",
                            parent_id: "cluster_004",
                            tree_id: "tree_002",
                            children: [],
                            areas: ["area_017", "area_018", "area_019", "area_020"]
                        },
                        {
                            uid: "cluster_006",
                            name: "Backend",
                            status: "active",
                            parent_id: null,
                            tree_id: "tree_002",
                            children: [],
                            areas: ["area_021", "area_022", "area_023", "area_024"]
                        }
                    ]
                },
                {
                    id: "tree_003",
                    name: "Marketing Operations",
                    status: "inactive",
                    created_at: "2024-03-10T09:45:00Z",
                    clusters: [
                        {
                            uid: "cluster_007",
                            name: "Digital Marketing",
                            status: "active",
                            parent_id: null,
                            tree_id: "tree_003",
                            children: ["cluster_008"],
                            areas: ["area_025", "area_026"]
                        },
                        {
                            uid: "cluster_008",
                            name: "Social Media",
                            status: "inactive",
                            parent_id: "cluster_007",
                            tree_id: "tree_003",
                            children: [],
                            areas: ["area_027", "area_028", "area_029", "area_030"]
                        }
                    ]
                }
            ],
            areas: [
                // Infrastructure areas
                { uid: "area_001", name: "Servers", status: "active", cluster_uid: "cluster_001", tags: ["hardware", "infrastructure", "critical"] },
                { uid: "area_002", name: "Networking", status: "active", cluster_uid: "cluster_001", tags: ["network", "infrastructure", "security"] },
                { uid: "area_003", name: "Storage", status: "active", cluster_uid: "cluster_001", tags: ["storage", "backup", "infrastructure"] },
                { uid: "area_004", name: "Monitoring", status: "active", cluster_uid: "cluster_001", tags: ["monitoring", "alerts", "infrastructure"] },
                { uid: "area_005", name: "Load Balancing", status: "active", cluster_uid: "cluster_001", tags: ["performance", "scaling", "infrastructure"] },
                
                // Cloud Services areas
                { uid: "area_006", name: "AWS EC2", status: "active", cluster_uid: "cluster_002", tags: ["aws", "compute", "cloud"] },
                { uid: "area_007", name: "Kubernetes", status: "active", cluster_uid: "cluster_002", tags: ["k8s", "orchestration", "cloud"] },
                { uid: "area_008", name: "Docker", status: "active", cluster_uid: "cluster_002", tags: ["containers", "deployment", "cloud"] },
                { uid: "area_009", name: "Azure Functions", status: "inactive", cluster_uid: "cluster_002", tags: ["serverless", "azure", "cloud"] },
                
                // Security areas
                { uid: "area_010", name: "Authentication", status: "active", cluster_uid: "cluster_003", tags: ["auth", "security", "critical"] },
                { uid: "area_011", name: "Encryption", status: "active", cluster_uid: "cluster_003", tags: ["crypto", "security", "compliance"] },
                { uid: "area_012", name: "Firewall", status: "active", cluster_uid: "cluster_003", tags: ["network", "security", "protection"] },
                
                // Frontend areas
                { uid: "area_013", name: "React Components", status: "active", cluster_uid: "cluster_004", tags: ["react", "frontend", "ui"] },
                { uid: "area_014", name: "State Management", status: "active", cluster_uid: "cluster_004", tags: ["redux", "state", "frontend"] },
                { uid: "area_015", name: "Routing", status: "active", cluster_uid: "cluster_004", tags: ["navigation", "spa", "frontend"] },
                { uid: "area_016", name: "Performance", status: "active", cluster_uid: "cluster_004", tags: ["optimization", "speed", "frontend"] },
                
                // UI Components areas
                { uid: "area_017", name: "Design System", status: "active", cluster_uid: "cluster_005", tags: ["design", "components", "ui"] },
                { uid: "area_018", name: "Forms", status: "active", cluster_uid: "cluster_005", tags: ["input", "validation", "ui"] },
                { uid: "area_019", name: "Navigation", status: "active", cluster_uid: "cluster_005", tags: ["menu", "navigation", "ui"] },
                { uid: "area_020", name: "Data Display", status: "active", cluster_uid: "cluster_005", tags: ["tables", "charts", "ui"] },
                
                // Backend areas
                { uid: "area_021", name: "API Gateway", status: "active", cluster_uid: "cluster_006", tags: ["api", "gateway", "backend"] },
                { uid: "area_022", name: "Database", status: "active", cluster_uid: "cluster_006", tags: ["sql", "nosql", "backend"] },
                { uid: "area_023", name: "Caching", status: "active", cluster_uid: "cluster_006", tags: ["redis", "performance", "backend"] },
                { uid: "area_024", name: "Message Queue", status: "active", cluster_uid: "cluster_006", tags: ["queue", "async", "backend"] },
                
                // Digital Marketing areas
                { uid: "area_025", name: "SEO", status: "active", cluster_uid: "cluster_007", tags: ["seo", "marketing", "organic"] },
                { uid: "area_026", name: "Analytics", status: "active", cluster_uid: "cluster_007", tags: ["data", "metrics", "marketing"] },
                
                // Social Media areas
                { uid: "area_027", name: "Facebook Ads", status: "inactive", cluster_uid: "cluster_008", tags: ["facebook", "ads", "social"] },
                { uid: "area_028", name: "Twitter Campaign", status: "inactive", cluster_uid: "cluster_008", tags: ["twitter", "campaign", "social"] },
                { uid: "area_029", name: "Instagram Marketing", status: "active", cluster_uid: "cluster_008", tags: ["instagram", "visual", "social"] },
                { uid: "area_030", name: "LinkedIn Outreach", status: "active", cluster_uid: "cluster_008", tags: ["linkedin", "b2b", "social"] }
            ],
            tags: [
                // Infrastructure tags
                { slug: "hardware", name: "Hardware", status: "active", tree_id: "tree_001" },
                { slug: "infrastructure", name: "Infrastructure", status: "active", tree_id: "tree_001" },
                { slug: "critical", name: "Critical", status: "active", tree_id: "tree_001" },
                { slug: "network", name: "Network", status: "active", tree_id: "tree_001" },
                { slug: "security", name: "Security", status: "active", tree_id: "tree_001" },
                { slug: "storage", name: "Storage", status: "active", tree_id: "tree_001" },
                { slug: "backup", name: "Backup", status: "active", tree_id: "tree_001" },
                { slug: "monitoring", name: "Monitoring", status: "active", tree_id: "tree_001" },
                { slug: "alerts", name: "Alerts", status: "active", tree_id: "tree_001" },
                { slug: "performance", name: "Performance", status: "active", tree_id: "tree_001" },
                { slug: "scaling", name: "Scaling", status: "active", tree_id: "tree_001" },
                { slug: "aws", name: "AWS", status: "active", tree_id: "tree_001" },
                { slug: "compute", name: "Compute", status: "active", tree_id: "tree_001" },
                { slug: "cloud", name: "Cloud", status: "active", tree_id: "tree_001" },
                { slug: "k8s", name: "Kubernetes", status: "active", tree_id: "tree_001" },
                { slug: "orchestration", name: "Orchestration", status: "active", tree_id: "tree_001" },
                { slug: "containers", name: "Containers", status: "active", tree_id: "tree_001" },
                { slug: "deployment", name: "Deployment", status: "active", tree_id: "tree_001" },
                { slug: "serverless", name: "Serverless", status: "inactive", tree_id: "tree_001" },
                { slug: "azure", name: "Azure", status: "inactive", tree_id: "tree_001" },
                { slug: "auth", name: "Authentication", status: "active", tree_id: "tree_001" },
                { slug: "crypto", name: "Cryptography", status: "active", tree_id: "tree_001" },
                { slug: "compliance", name: "Compliance", status: "active", tree_id: "tree_001" },
                { slug: "protection", name: "Protection", status: "active", tree_id: "tree_001" },
                
                // Product Development tags
                { slug: "react", name: "React", status: "active", tree_id: "tree_002" },
                { slug: "frontend", name: "Frontend", status: "active", tree_id: "tree_002" },
                { slug: "ui", name: "UI", status: "active", tree_id: "tree_002" },
                { slug: "redux", name: "Redux", status: "active", tree_id: "tree_002" },
                { slug: "state", name: "State", status: "active", tree_id: "tree_002" },
                { slug: "navigation", name: "Navigation", status: "active", tree_id: "tree_002" },
                { slug: "spa", name: "SPA", status: "active", tree_id: "tree_002" },
                { slug: "optimization", name: "Optimization", status: "active", tree_id: "tree_002" },
                { slug: "speed", name: "Speed", status: "active", tree_id: "tree_002" },
                { slug: "design", name: "Design", status: "active", tree_id: "tree_002" },
                { slug: "components", name: "Components", status: "active", tree_id: "tree_002" },
                { slug: "input", name: "Input", status: "active", tree_id: "tree_002" },
                { slug: "validation", name: "Validation", status: "active", tree_id: "tree_002" },
                { slug: "menu", name: "Menu", status: "active", tree_id: "tree_002" },
                { slug: "tables", name: "Tables", status: "active", tree_id: "tree_002" },
                { slug: "charts", name: "Charts", status: "active", tree_id: "tree_002" },
                { slug: "api", name: "API", status: "active", tree_id: "tree_002" },
                { slug: "gateway", name: "Gateway", status: "active", tree_id: "tree_002" },
                { slug: "backend", name: "Backend", status: "active", tree_id: "tree_002" },
                { slug: "sql", name: "SQL", status: "active", tree_id: "tree_002" },
                { slug: "nosql", name: "NoSQL", status: "active", tree_id: "tree_002" },
                { slug: "redis", name: "Redis", status: "active", tree_id: "tree_002" },
                { slug: "queue", name: "Queue", status: "active", tree_id: "tree_002" },
                { slug: "async", name: "Async", status: "active", tree_id: "tree_002" },
                
                // Marketing tags
                { slug: "seo", name: "SEO", status: "active", tree_id: "tree_003" },
                { slug: "marketing", name: "Marketing", status: "active", tree_id: "tree_003" },
                { slug: "organic", name: "Organic", status: "active", tree_id: "tree_003" },
                { slug: "data", name: "Data", status: "active", tree_id: "tree_003" },
                { slug: "metrics", name: "Metrics", status: "active", tree_id: "tree_003" },
                { slug: "facebook", name: "Facebook", status: "inactive", tree_id: "tree_003" },
                { slug: "ads", name: "Ads", status: "inactive", tree_id: "tree_003" },
                { slug: "social", name: "Social", status: "active", tree_id: "tree_003" },
                { slug: "twitter", name: "Twitter", status: "inactive", tree_id: "tree_003" },
                { slug: "campaign", name: "Campaign", status: "inactive", tree_id: "tree_003" },
                { slug: "instagram", name: "Instagram", status: "active", tree_id: "tree_003" },
                { slug: "visual", name: "Visual", status: "active", tree_id: "tree_003" },
                { slug: "linkedin", name: "LinkedIn", status: "active", tree_id: "tree_003" },
                { slug: "b2b", name: "B2B", status: "active", tree_id: "tree_003" }
            ]
        } as const;

export type SeedData = typeof seedData;
