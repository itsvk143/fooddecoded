"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Database,
  Layers,
  FileSpreadsheet,
  Cpu,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Plus,
  Key,
  Upload,
  Lock,
  LogOut,
  Search,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState("fooddecode_admin_secret_key_change_in_production");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "ingredients" | "import" | "rules" | "submissions" | "logs"
  >("overview");

  // State data
  const [stats, setStats] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [customIngredients, setCustomIngredients] = useState<any[]>([]);
  const [rules, setRules] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [importJobs, setImportJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form states
  const [searchProd, setSearchProd] = useState("");
  const [jsonImportText, setJsonImportText] = useState("");

  // New Ingredient form
  const [newIngName, setNewIngName] = useState("");
  const [newIngRisk, setNewIngRisk] = useState<"safe" | "caution" | "avoid">("caution");
  const [newIngDesc, setNewIngDesc] = useState("");
  const [newIngRegulatory, setNewIngRegulatory] = useState("Banned in EU; Permitted in USA");
  const [newIngAliases, setNewIngAliases] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  });

  const checkAuth = async (keyToTest = adminKey) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-key": keyToTest },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setDbStatus(data.dbStatus);
        setIsAuthenticated(true);
        loadAllData(keyToTest);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Authentication failed.");
        setIsAuthenticated(false);
      }
    } catch (e) {
      setAuthError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (key = adminKey) => {
    const headers = { "x-admin-key": key };
    try {
      const [pRes, sRes, iRes, rRes, lRes, jRes] = await Promise.all([
        fetch("/api/admin/products?limit=50", { headers }).then((r) => r.json()),
        fetch("/api/admin/submissions", { headers }).then((r) => r.json()),
        fetch("/api/admin/ingredients", { headers }).then((r) => r.json()),
        fetch("/api/admin/rules", { headers }).then((r) => r.json()),
        fetch("/api/admin/audit-logs?limit=30", { headers }).then((r) => r.json()),
        fetch("/api/admin/import-jobs", { headers }).then((r) => r.json()),
      ]);

      if (pRes.products) setProducts(pRes.products);
      if (Array.isArray(sRes)) setSubmissions(sRes);
      if (iRes.customIngredients) setCustomIngredients(iRes.customIngredients);
      if (rRes) setRules(rRes);
      if (lRes.logs) setAuditLogs(lRes.logs);
      if (Array.isArray(jRes)) setImportJobs(jRes);
    } catch (err) {
      console.warn("Failed loading tab data", err);
    }
  };

  useEffect(() => {
    // Attempt automatic login with default dev key
    checkAuth(adminKey);
  }, []);

  const handleSeedDatabase = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`✓ ${data.message}`);
        checkAuth();
      } else {
        setStatusMessage(`❌ Error: ${data.message || data.error}`);
      }
    } catch (e) {
      setStatusMessage(`❌ Seeding failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateScores = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/recalculate", {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`✓ ${data.message}`);
        checkAuth();
      } else {
        setStatusMessage(`❌ Error: ${data.error}`);
      }
    } catch (e) {
      setStatusMessage(`❌ Recalculation error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = async (submissionId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ submissionId, status }),
      });
      if (res.ok) {
        setStatusMessage(`✓ Submission marked as ${status}`);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setStatusMessage("✓ Product deleted from database.");
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;

    try {
      const res = await fetch("/api/admin/ingredients", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: newIngName,
          riskLevel: newIngRisk,
          description: newIngDesc,
          regulatoryStatus: newIngRegulatory,
          aliases: newIngAliases,
        }),
      });
      if (res.ok) {
        setStatusMessage(`✓ Configured ingredient rule: ${newIngName}`);
        setNewIngName("");
        setNewIngDesc("");
        setNewIngAliases("");
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      setLoading(true);
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ items, source: "admin_bulk_paste" }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`✓ Imported ${data.successCount} products (${data.errorCount} errors)`);
        setJsonImportText("");
        loadAllData();
      } else {
        setStatusMessage(`❌ Import failed: ${data.error}`);
      }
    } catch (err) {
      setStatusMessage(`❌ Invalid JSON format: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-stone-900 dark:bg-stone-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50">
            FoodDecode Admin Portal
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Enter your secret administrative key configured in ADMIN_SECRET_KEY.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-xl font-medium">
            {authError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAuth(adminKey);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter ADMIN_SECRET_KEY..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
          >
            {loading ? "Authenticating..." : "Authenticate Admin"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrative Control Plane</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 dark:text-stone-50">
            Platform Administration
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage catalogue, review submissions, edit ingredient hazard rules, and trigger scoring batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeedDatabase}
            disabled={loading}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Seed MongoDB
          </button>
          <button
            type="button"
            onClick={handleRecalculateScores}
            disabled={loading}
            className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Recalculate Scores
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-stone-900 text-stone-100 text-xs font-medium rounded-xl border border-stone-800 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        {[
          { id: "overview", label: "Overview & Diagnostics", icon: Database },
          { id: "products", label: "Catalogue Management", icon: Layers },
          { id: "submissions", label: `Submissions (${stats?.pendingSubmissions || 0})`, icon: Clock },
          { id: "ingredients", label: "Ingredient Hazard Rules", icon: AlertTriangle },
          { id: "import", label: "Bulk JSON Import", icon: FileSpreadsheet },
          { id: "rules", label: "Scoring Weights", icon: Cpu },
          { id: "logs", label: "Audit Logs", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Diagnostics */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase">Total Products</span>
              <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {stats?.totalProducts || 0}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {stats?.verifiedProducts || 0} verified in catalogue
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase">Pending Submissions</span>
              <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {stats?.pendingSubmissions || 0}
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Awaiting editorial review
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase">Avg Catalogue Score</span>
              <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {stats?.averageOverallScore || 0}<span className="text-sm font-normal text-stone-400">/100</span>
              </div>
              <span className="text-[11px] text-stone-500">Across active items</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase">Database Link</span>
              <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-1 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${dbStatus?.connected ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span>{dbStatus?.connected ? "MongoDB Atlas" : "Demo Mode"}</span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono truncate block mt-0.5">
                {dbStatus?.maskedUri || "In-memory"}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              MongoDB Atlas Configuration Check
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {dbStatus?.connected
                ? `Connected to cluster! Collections active: ${dbStatus.collections?.join(", ") || "None"}.`
                : "MongoDB is not connected or MONGODB_URI is undefined. The platform is serving in-memory realistic seed products. To persist modifications to Atlas, provide MONGODB_URI in your Vercel Project Settings or .env.local."}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Products Catalogue */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchProd}
                onChange={(e) => setSearchProd(e.target.value)}
                placeholder="Filter by name or barcode..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
              />
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {products.length} products loaded
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-stone-100 dark:divide-stone-800">
              <thead className="bg-stone-50 dark:bg-stone-800/40 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Barcode</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Nutri</th>
                  <th className="p-3.5">Nova</th>
                  <th className="p-3.5">Verified</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {products
                  .filter((p) => !searchProd || p.name.toLowerCase().includes(searchProd.toLowerCase()) || p.barcode.includes(searchProd))
                  .map((p) => {
                    const id = p.id || p._id || p.barcode;
                    return (
                      <tr key={id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                        <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100 max-w-xs truncate">
                          {p.name}
                          <span className="block text-[10px] text-stone-500 font-normal">{p.brand}</span>
                        </td>
                        <td className="p-3.5 font-mono text-stone-600 dark:text-stone-400">{p.barcode}</td>
                        <td className="p-3.5 text-stone-600 dark:text-stone-400">{p.category}</td>
                        <td className="p-3.5 font-black">{p.overallScore}</td>
                        <td className="p-3.5 font-bold">{p.nutriScore}</td>
                        <td className="p-3.5">{p.novaGroup}</td>
                        <td className="p-3.5">
                          {p.verified ? (
                            <span className="text-emerald-600 font-bold">✓ Yes</span>
                          ) : (
                            <span className="text-amber-500">Pending</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(id)}
                            className="text-stone-400 hover:text-rose-500 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Submissions Review */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Community Submissions Queue
          </h3>
          {submissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Barcode: {sub.barcode}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {sub.name}
                      </h4>
                      <span className="text-xs text-stone-500">{sub.brand} · {sub.category}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sub.status === "approved" ? "bg-emerald-100 text-emerald-800" : sub.status === "rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl font-mono text-[11px] line-clamp-3">
                    {sub.ingredientsText}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 text-xs">
                    <span className="text-stone-500">By {sub.submittedBy || "Anonymous"}</span>
                    {sub.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleReviewSubmission(sub._id, "approved")}
                          className="px-3 py-1 bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs hover:bg-emerald-400"
                        >
                          Approve & Publish
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewSubmission(sub._id, "rejected")}
                          className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-rose-500 font-bold rounded-lg text-xs hover:bg-stone-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500">No community submissions waiting in queue.</p>
          )}
        </div>
      )}

      {/* Tab 4: Ingredient Hazard Rules */}
      {activeTab === "ingredients" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Add / Configure Ingredient Hazard Rule
            </h3>
            <form onSubmit={handleCreateIngredient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  placeholder="e.g. Potassium Bromate"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Risk Level
                </label>
                <select
                  value={newIngRisk}
                  onChange={(e) => setNewIngRisk(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                >
                  <option value="safe">Safe (Green)</option>
                  <option value="caution">Caution (Amber)</option>
                  <option value="avoid">Avoid / High Hazard (Red)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Regulatory Status
                </label>
                <input
                  type="text"
                  value={newIngRegulatory}
                  onChange={(e) => setNewIngRegulatory(e.target.value)}
                  placeholder="e.g. Banned in EU; Permitted in USA"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Aliases & E-Numbers (comma-separated)
                </label>
                <input
                  type="text"
                  value={newIngAliases}
                  onChange={(e) => setNewIngAliases(e.target.value)}
                  placeholder="e.g. E924, bromated flour"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Scientific Description & Concerns
                </label>
                <textarea
                  rows={3}
                  value={newIngDesc}
                  onChange={(e) => setNewIngDesc(e.target.value)}
                  placeholder="Health concerns, IARC classifications..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl"
              >
                Save Ingredient Rule
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Active Ingredient Rules ({customIngredients.length} custom, 20 built-in)
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-96 overflow-y-auto text-xs">
              {customIngredients.map((ing) => (
                <div key={ing._id} className="py-2.5 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                      {ing.name}
                    </span>
                    <span className="block text-[11px] text-stone-500">{ing.regulatoryStatus}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ing.riskLevel === "avoid" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {ing.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Bulk JSON Import */}
      {activeTab === "import" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Bulk Product Ingestion
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Paste an array of product JSON records to import them into MongoDB with duplicate checking and atomic updates.
            </p>
          </div>

          <textarea
            rows={8}
            value={jsonImportText}
            onChange={(e) => setJsonImportText(e.target.value)}
            placeholder={`[\n  {\n    "barcode": "999000111222",\n    "name": "Sample Organic Granola",\n    "brand": "Pure Oats",\n    "category": "Cereals & Breakfast",\n    "ingredientsText": "Whole oats, honey, almonds, sea salt.",\n    "nutritionPer100g": { "calories": 420, "sugars": 8, "protein": 11, "sodium": 40 }\n  }\n]`}
            className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-mono text-xs"
          />

          <button
            type="button"
            onClick={handleBulkImport}
            disabled={!jsonImportText.trim() || loading}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40"
          >
            {loading ? "Processing Bulk Import..." : "Import Products to MongoDB"}
          </button>
        </div>
      )}

      {/* Tab 6: Scoring Weights */}
      {activeTab === "rules" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Active Scoring Algorithm v{rules?.version || 1}
          </h3>
          <p className="text-xs text-stone-500">
            Parameters utilized by the versioned rules engine for Nutri-Score, Nova deductions, and FoodDecode scoring.
          </p>
          <pre className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-xs overflow-x-auto text-stone-800 dark:text-stone-200">
            {JSON.stringify(rules?.rules, null, 2)}
          </pre>
        </div>
      )}

      {/* Tab 7: Audit Logs */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Audit Trail
            </h3>
            <span className="text-xs text-stone-500">{auditLogs.length} events</span>
          </div>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs max-h-96 overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    {log.action}
                  </span>
                  <span className="text-stone-600 dark:text-stone-400">{log.details}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-stone-400 font-mono block">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[10px] text-stone-500">{log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
