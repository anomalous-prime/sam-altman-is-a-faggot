"use client";

import { useState } from 'react';

const API_BASE = 'http://localhost:4001';

interface TestResult {
  title: string;
  success: boolean;
  message: string;
  details?: string;
}

export default function CorsTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const makeRequest = async (method: string, endpoint: string, data = null) => {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const responseData = await response.json();
    
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData
    };
  };

  const testHealth = async () => {
    try {
      const result = await makeRequest('GET', '/health');
      if (result.status === 200) {
        addResult({
          title: 'Health Check',
          success: true,
          message: 'Service is healthy',
          details: `Status: ${result.data.status}\nDatabase: ${result.data.database}\nVersion: ${result.data.version}`
        });
      } else {
        addResult({
          title: 'Health Check',
          success: false,
          message: `HTTP ${result.status}`
        });
      }
    } catch (error: any) {
      addResult({
        title: 'Health Check',
        success: false,
        message: `Network error: ${error.message}`
      });
    }
  };

  const testClusters = async () => {
    try {
      const result = await makeRequest('GET', '/api/v1/clusters');
      if (result.status === 200) {
        const count = result.data.data ? result.data.data.length : 0;
        addResult({
          title: 'GET Clusters',
          success: true,
          message: `Found ${count} clusters`,
          details: `CORS Headers:\n${JSON.stringify({
            'access-control-allow-origin': result.headers['access-control-allow-origin'],
            'access-control-allow-methods': result.headers['access-control-allow-methods']
          }, null, 2)}`
        });
      } else {
        addResult({
          title: 'GET Clusters',
          success: false,
          message: `HTTP ${result.status}`
        });
      }
    } catch (error: any) {
      addResult({
        title: 'GET Clusters',
        success: false,
        message: `Network error: ${error.message}`
      });
    }
  };

  const testCreateCluster = async () => {
    try {
      const testData = {
        uid: `corstest${Date.now()}`,
        name: 'CORS Test Cluster',
        description: 'Created via CORS test'
      };
      
      const result = await makeRequest('POST', '/api/v1/clusters', testData);
      if (result.status === 201) {
        addResult({
          title: 'POST Cluster',
          success: true,
          message: 'Cluster created successfully',
          details: `Created cluster: ${result.data.data.name}\nUID: ${result.data.data.uid}`
        });
      } else {
        addResult({
          title: 'POST Cluster',
          success: false,
          message: `HTTP ${result.status}`,
          details: JSON.stringify(result.data, null, 2)
        });
      }
    } catch (error: any) {
      addResult({
        title: 'POST Cluster',
        success: false,
        message: `Network error: ${error.message}`
      });
    }
  };

  const testStats = async () => {
    try {
      const result = await makeRequest('GET', '/api/v1/stats');
      if (result.status === 200) {
        addResult({
          title: 'GET Stats',
          success: true,
          message: 'Statistics retrieved successfully',
          details: `Clusters: ${result.data.data.total_clusters}\nAreas: ${result.data.data.total_areas}\nTags: ${result.data.data.total_tags}`
        });
      } else {
        addResult({
          title: 'GET Stats',
          success: false,
          message: `HTTP ${result.status}`
        });
      }
    } catch (error: any) {
      addResult({
        title: 'GET Stats',
        success: false,
        message: `Network error: ${error.message}`
      });
    }
  };

  const runAllTests = async () => {
    clearResults();
    await testHealth();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testClusters();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testCreateCluster();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="glass-strong rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-display gradient-text mb-4">
              🌑 NightForge CORS Test Suite
            </h1>
            <p className="text-slate-400 text-lg">
              Testing Cross-Origin Resource Sharing between frontend (port 3000) and backend (port 4001)
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">🧪 API Endpoint Tests</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={testHealth}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-colors"
              >
                Test Health Check
              </button>
              <button
                onClick={testClusters}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-300 transition-colors"
              >
                Test GET Clusters
              </button>
              <button
                onClick={testCreateCluster}
                className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-300 transition-colors"
              >
                Test POST Cluster
              </button>
              <button
                onClick={testStats}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 transition-colors"
              >
                Test GET Stats
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={runAllTests}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-semibold transition-colors"
              >
                🚀 Run All Tests
              </button>
              <button
                onClick={clearResults}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">📊 Test Results</h3>
            {results.length === 0 ? (
              <div className="glass rounded-lg p-6 text-center">
                <p className="text-slate-400">No tests run yet. Click a test button above to start.</p>
              </div>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`glass rounded-lg p-6 border-l-4 ${
                    result.success 
                      ? 'border-green-500 bg-green-500/5' 
                      : 'border-red-500 bg-red-500/5'
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">
                    {result.success ? '✅' : '❌'} {result.title}
                  </h4>
                  <p className="mb-2">
                    <span className="font-semibold">
                      {result.success ? 'SUCCESS' : 'FAILED'}:
                    </span>{' '}
                    <span className={result.success ? 'text-green-300' : 'text-red-300'}>
                      {result.message}
                    </span>
                  </p>
                  {result.details && (
                    <pre className="bg-slate-800/50 rounded p-3 text-sm overflow-x-auto text-slate-300">
                      {result.details}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-8 glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">🔒 CORS Configuration</h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p><strong>Frontend Origin:</strong> <code className="bg-slate-800/50 px-2 py-1 rounded">http://localhost:3000</code></p>
              <p><strong>Backend URL:</strong> <code className="bg-slate-800/50 px-2 py-1 rounded">http://localhost:4001</code></p>
              <p><strong>Allowed Origins:</strong> <code className="bg-slate-800/50 px-2 py-1 rounded">http://localhost:3000, http://127.0.0.1:3000, http://10.188.163.88:3000</code></p>
              <p><strong>Allowed Methods:</strong> <code className="bg-slate-800/50 px-2 py-1 rounded">GET, POST, PUT, DELETE, OPTIONS</code></p>
              <p><strong>Allowed Headers:</strong> <code className="bg-slate-800/50 px-2 py-1 rounded">Content-Type, Authorization, X-Request-ID</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}