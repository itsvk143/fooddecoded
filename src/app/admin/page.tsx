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
  Copy,
  Download,
  Image as ImageIcon,
  Tag,
  Merge,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductItem } from "@/types";
import { ProductManagementDashboard } from "@/components/admin/ProductManagementDashboard";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ProductMappingModal } from "@/components/admin/ProductMappingModal";
import { BulkEditModal } from "@/components/admin/BulkEditModal";
import { DuplicatesModal } from "@/components/admin/DuplicatesModal";
import { CategoryManagementView } from "@/components/admin/CategoryManagementView";
import { ProductDataQualityDashboard } from "@/components/admin/ProductDataQualityDashboard";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState("fooddecode_admin_secret_key_change_in_production");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "quality" | "products" | "categories" | "duplicates" | "submissions" | "ingredients" | "import" | "rules" | "logs"
  >("overview");

  // State data
  const [stats, setStats] = useState<any>(null);
  const [catalogStats, setCatalogStats] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsTotal, setProductsTotal] = useState<number>(0);
  const [productsPage, setProductsPage] = useState<number>(1);
  const [productsTotalPages, setProductsTotalPages] = useState<number>(1);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [customIngredients, setCustomIngredients] = useState<any[]>([]);
  const [rules, setRules] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Table Filter State
  const [tableFilters, setTableFilters] = useState<{
    q?: string;
    category?: string;
    subCategory?: string;
    brand?: string;
    imageStatus?: string;
    dataStatus?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>({
    status: "active",
    sortBy: "recent",
    sortOrder: "desc",
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<ProductItem | null>(null);

  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [selectedProductForMapping, setSelectedProductForMapping] = useState<ProductItem | null>(null);

  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);

  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);

  // Quick Ingestion State
  const [jsonImportText, setJsonImportText] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreviewReport, setImportPreviewReport] = useState<any>(null);

  // New Ingredient form
  const [newIngName, setNewIngName] = useState("");
  const [newIngRisk, setNewIngRisk] = useState<"safe" | "caution" | "avoid">("caution");
  const [newIngClassification, setNewIngClassification] = useState<"GREEN" | "ORANGE" | "RED">("ORANGE");
  const [newIngIns, setNewIngIns] = useState("");
  const [newIngCategory, setNewIngCategory] = useState("Sweetener");
  const [newIngOrigin, setNewIngOrigin] = useState("Manufactured / Synthetic");
  const [newIngDesc, setNewIngDesc] = useState("");
  const [newIngFunction, setNewIngFunction] = useState("");
  const [newIngAdi, setNewIngAdi] = useState("");
  const [newIngRecommended, setNewIngRecommended] = useState("");
  const [newIngVerdict, setNewIngVerdict] = useState("");
  const [newIngRegulatory, setNewIngRegulatory] = useState("FSSAI / EFSA / FDA Approved");
  const [newIngAliases, setNewIngAliases] = useState("");
  const [ingSearchQuery, setIngSearchQuery] = useState("");

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

  const loadCatalogStats = async (key = adminKey) => {
    try {
      const res = await fetch("/api/admin/products/stats", {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setCatalogStats(data);
      }
    } catch (err) {
      console.warn("Failed loading catalogue stats", err);
    }
  };

  const loadCategories = async (key = adminKey) => {
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.warn("Failed loading categories", err);
    }
  };

  const loadProductsTable = async (
    page = productsPage,
    filters = tableFilters,
    key = adminKey
  ) => {
    setTableLoading(true);
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(page));
      sp.set("limit", "25");
      if (filters.q) sp.set("q", filters.q);
      if (filters.category && filters.category !== "All") sp.set("category", filters.category);
      if (filters.subCategory && filters.subCategory !== "All") sp.set("subCategory", filters.subCategory);
      if (filters.brand && filters.brand !== "All") sp.set("brand", filters.brand);
      if (filters.imageStatus && filters.imageStatus !== "All") sp.set("imageStatus", filters.imageStatus);
      if (filters.dataStatus && filters.dataStatus !== "All") sp.set("dataStatus", filters.dataStatus);
      if (filters.status) sp.set("status", filters.status);
      if (filters.sortBy) sp.set("sortBy", filters.sortBy);
      if (filters.sortOrder) sp.set("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/admin/products?${sp.toString()}`, {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setProductsTotal(data.total || 0);
        setProductsPage(data.page || 1);
        setProductsTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed loading products table", err);
    } finally {
      setTableLoading(false);
    }
  };

  const loadAllData = async (key = adminKey) => {
    const headers = { "x-admin-key": key };
    try {
      await Promise.all([
        loadCatalogStats(key),
        loadCategories(key),
        loadProductsTable(1, tableFilters, key),
        fetch("/api/admin/submissions", { headers })
          .then((r) => r.json())
          .then((d) => Array.isArray(d) && setSubmissions(d)),
        fetch("/api/admin/ingredients", { headers })
          .then((r) => r.json())
          .then((d) => d.customIngredients && setCustomIngredients(d.customIngredients)),
        fetch("/api/admin/rules", { headers })
          .then((r) => r.json())
          .then((d) => setRules(d)),
        fetch("/api/admin/audit-logs?limit=50", { headers })
          .then((r) => r.json())
          .then((d) => d.logs && setAuditLogs(d.logs)),
        fetch("/api/brands")
          .then((r) => r.json())
          .then((d) => Array.isArray(d) && setBrands(d.map((b) => b.name || b))),
      ]);
    } catch (err) {
      console.warn("Failed loading full data", err);
    }
  };

  useEffect(() => {
    checkAuth(adminKey);
  }, []);

  // Filter change in ProductTable triggers fetch
  const handleTableFilterChange = (newFilters: any) => {
    setTableFilters(newFilters);
    setProductsPage(1);
    loadProductsTable(1, newFilters);
  };

  const handleTablePageChange = (newPage: number) => {
    setProductsPage(newPage);
    loadProductsTable(newPage, tableFilters);
  };

  // CRUD Operations
  const handleSaveProduct = async (productData: Partial<ProductItem>) => {
    const isEdit = !!productData._id;
    const url = isEdit
      ? `/api/admin/products/${productData._id}`
      : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save product");
    }

    setStatusMessage(`✓ Product "${data.name}" successfully ${isEdit ? "updated" : "created"}.`);
    loadCatalogStats();
    loadProductsTable(productsPage, tableFilters);
  };

  const handleCorrectMapping = (product: ProductItem) => {
    setSelectedProductForMapping(product);
    setIsMappingModalOpen(true);
  };

  const handleSaveMapping = async (mappingData: any) => {
    const res = await fetch("/api/admin/products/mapping", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(mappingData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update mapping");
    }
    setStatusMessage("✓ Product classification and search mapping successfully updated.");
    loadCatalogStats();
    loadProductsTable(productsPage, tableFilters);
  };

  const handleArchiveProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setStatusMessage("✓ Product archived (hidden from public directory).");
        loadCatalogStats();
        loadProductsTable(productsPage, tableFilters);
      }
    } catch (e: any) {
      setStatusMessage(`❌ Archive failed: ${e.message}`);
    }
  };

  const handleRestoreProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}&action=restore`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (res.ok) {
        setStatusMessage("✓ Product restored to active catalogue.");
        loadCatalogStats();
        loadProductsTable(productsPage, tableFilters);
      }
    } catch (e: any) {
      setStatusMessage(`❌ Restore failed: ${e.message}`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY delete "${name}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(
        `/api/admin/products?id=${encodeURIComponent(id)}&permanent=true`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );
      if (res.ok) {
        setStatusMessage(`✓ Product "${name}" permanently deleted.`);
        loadCatalogStats();
        loadProductsTable(productsPage, tableFilters);
      }
    } catch (e: any) {
      setStatusMessage(`❌ Delete failed: ${e.message}`);
    }
  };

  const handleBulkApply = async (params: any) => {
    const res = await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Bulk update failed");
    }
    setStatusMessage(`✓ Bulk update successfully applied to ${data.affectedCount} products.`);
    loadCatalogStats();
    loadProductsTable(productsPage, tableFilters);
  };

  const handleExportSelected = (selectedIds: string[]) => {
    const ids = selectedIds.join(",");
    window.open(`/api/admin/products/export?ids=${encodeURIComponent(ids)}&admin_key=${adminKey}`);
  };

  const handleExportAll = (status = "active") => {
    window.open(`/api/admin/products/export?status=${status}&admin_key=${adminKey}`);
  };

  // CSV File Preview & Import
  const handleCsvPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const rawCsv = evt.target?.result as string;
      try {
        const res = await fetch("/api/admin/products/import?preview=true", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ rawCsv }),
        });
        const report = await res.json();
        setImportPreviewReport(report);
      } catch (err: any) {
        setStatusMessage(`❌ Preview error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCommitCsvImport = async () => {
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const rawCsv = evt.target?.result as string;
      setLoading(true);
      try {
        const res = await fetch("/api/admin/products/import", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ rawCsv }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatusMessage(`✓ ${data.message}`);
          setCsvFile(null);
          setImportPreviewReport(null);
          loadAllData();
        } else {
          setStatusMessage(`❌ ${data.error}`);
        }
      } catch (err: any) {
        setStatusMessage(`❌ Import failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(csvFile);
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
          classification: newIngClassification,
          riskLevel: newIngClassification === "RED" ? "avoid" : newIngClassification === "ORANGE" ? "caution" : "safe",
          insNumber: newIngIns || null,
          category: newIngCategory,
          origin: newIngOrigin,
          description: newIngDesc,
          foodFunction: newIngFunction,
          adi: newIngAdi || null,
          recommendedIntake: newIngRecommended || null,
          verdict: newIngVerdict,
          regulatoryStatus: newIngRegulatory,
          aliases: newIngAliases,
        }),
      });
      if (res.ok) {
        setStatusMessage(`✓ Configured ingredient intelligence: ${newIngName}`);
        setNewIngName("");
        setNewIngIns("");
        setNewIngDesc("");
        setNewIngFunction("");
        setNewIngAdi("");
        setNewIngRecommended("");
        setNewIngVerdict("");
        setNewIngAliases("");
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-stone-900 dark:bg-stone-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-stone-900 dark:text-stone-50">
            Administrative Access
          </h2>
          <p className="text-xs text-stone-500">
            Enter your FoodDecode master admin key to manage the product catalogue.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs rounded-xl">
            {authError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAuth();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Admin secret key..."
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
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
            Product Management & Catalogue Control
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Audit, classify, edit, merge, and manage all food products connected to MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedProductForEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>

          <button
            type="button"
            onClick={() => handleExportAll("active")}
            className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => loadAllData()}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-stone-900 text-stone-100 text-xs font-semibold rounded-2xl border border-stone-800 flex items-center justify-between shadow-md">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        {[
          { id: "overview", label: "Dashboard", icon: Database },
          { id: "quality", label: "Product Data Quality", icon: ShieldAlert },
          { id: "products", label: `All Products (${catalogStats?.totalProducts || 175})`, icon: Layers },
          { id: "categories", label: `Categories & Subcategories (${categories.length})`, icon: Layers },
          { id: "duplicates", label: `Duplicates (${catalogStats?.potentialDuplicates || 0})`, icon: Copy },
          { id: "import", label: "Import / Export", icon: FileSpreadsheet },
          { id: "submissions", label: `Submissions (${stats?.pendingSubmissions || 0})`, icon: Clock },
          { id: "ingredients", label: `Ingredient Intelligence (${customIngredients.length})`, icon: Sparkles },
          { id: "rules", label: "Scoring Weights", icon: Cpu },
          { id: "logs", label: "Audit Log", icon: Clock },
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

      {/* TAB 1: DASHBOARD METRICS */}
      {activeTab === "overview" && (
        <ProductManagementDashboard
          stats={catalogStats}
          loading={loading}
          onNavigateTab={(tab, filter) => {
            if (filter) {
              setTableFilters({ ...tableFilters, ...filter });
            }
            setActiveTab(tab as any);
          }}
          onAddNewProduct={() => {
            setSelectedProductForEdit(null);
            setIsFormModalOpen(true);
          }}
        />
      )}

      {/* TAB 1.5: PRODUCT DATA QUALITY DASHBOARD */}
      {activeTab === "quality" && (
        <ProductDataQualityDashboard
          products={products}
          adminSecret={adminKey}
          onRefresh={() => loadProductsTable(productsPage, tableFilters)}
          onEditProduct={(p) => {
            setSelectedProductForEdit(p);
            setIsFormModalOpen(true);
          }}
        />
      )}

      {/* TAB 2: ALL PRODUCTS MANAGEMENT TABLE */}
      {activeTab === "products" && (
        <ProductTable
          products={products}
          total={productsTotal}
          page={productsPage}
          totalPages={productsTotalPages}
          limit={25}
          loading={tableLoading}
          categories={categories}
          brands={brands}
          filters={tableFilters}
          onFilterChange={handleTableFilterChange}
          onPageChange={handleTablePageChange}
          onEditProduct={(p) => {
            setSelectedProductForEdit(p);
            setIsFormModalOpen(true);
          }}
          onCorrectMapping={handleCorrectMapping}
          onArchiveProduct={handleArchiveProduct}
          onRestoreProduct={handleRestoreProduct}
          onDeleteProduct={handleDeleteProduct}
          onOpenBulkEdit={(ids) => {
            setBulkSelectedIds(ids);
            setIsBulkEditModalOpen(true);
          }}
          onExportSelected={handleExportSelected}
        />
      )}

      {/* TAB 3: CATEGORIES & SUBCATEGORIES MANAGEMENT */}
      {activeTab === "categories" && (
        <CategoryManagementView
          categories={categories}
          adminKey={adminKey}
          onRefresh={() => loadCategories()}
        />
      )}

      {/* TAB 4: DUPLICATE DETECTION & MERGE */}
      {activeTab === "duplicates" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Suspected Duplicate Records
              </h3>
              <p className="text-xs text-stone-500">
                Analyzes barcodes and brand + product name combinations for potential collisions
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDuplicatesModalOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Open Collision Resolution Tool
            </button>
          </div>

          <DuplicatesModal
            isOpen={true}
            adminKey={adminKey}
            onClose={() => {}}
            onMergeSuccess={() => {
              loadCatalogStats();
              loadProductsTable();
            }}
          />
        </div>
      )}

      {/* TAB 5: IMPORT / EXPORT */}
      {activeTab === "import" && (
        <div className="space-y-8">
          {/* CSV File Upload Section */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                CSV Catalogue Import with Pre-Validation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload a CSV spreadsheet with mandatory columns (`barcode`, `name`, `brand`, `category`, `subCategory`, `ingredients`). The system verifies barcodes and detects duplicates before committing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold text-xs cursor-pointer shadow-md">
                <Upload className="w-4 h-4" /> Select CSV File
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvPreview}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => handleExportAll("active")}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export Active Catalogue CSV
              </button>
            </div>

            {/* Validation & Preview Report Card */}
            {importPreviewReport && (
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3 animate-in fade-in">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Import Validation Report
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 text-[10px] block">Total Rows:</span>
                    <span className="font-black text-base">{importPreviewReport.totalSubmitted}</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 text-[10px] block">New Products:</span>
                    <span className="font-black text-base text-emerald-500">
                      {importPreviewReport.newProductsCount}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 text-[10px] block">Updates to Existing:</span>
                    <span className="font-black text-base text-amber-500">
                      {importPreviewReport.updateCount}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-400 text-[10px] block">Errors:</span>
                    <span className="font-black text-base text-rose-500">
                      {importPreviewReport.errorCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCsvFile(null);
                      setImportPreviewReport(null);
                    }}
                    className="px-3 py-1.5 text-xs text-stone-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCommitCsvImport}
                    disabled={loading || importPreviewReport.validCount === 0}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40"
                  >
                    Commit & Import {importPreviewReport.validCount} Valid Records
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bulk JSON Raw Ingestion */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Bulk JSON Import
            </h3>
            <textarea
              rows={6}
              value={jsonImportText}
              onChange={(e) => setJsonImportText(e.target.value)}
              placeholder={`[\n  {\n    "barcode": "999000111222",\n    "name": "Sample Organic Granola",\n    "brand": "Pure Oats",\n    "category": "Cereals & Breakfast",\n    "ingredientsText": "Whole oats, honey, almonds, sea salt."\n  }\n]`}
              className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* TAB 6: SUBMISSIONS */}
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
                      <span className="text-xs text-stone-500">
                        {sub.brand} · {sub.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500">No community submissions waiting in queue.</p>
          )}
        </div>
      )}

      {/* TAB 7: INGREDIENT INTELLIGENCE */}
      {activeTab === "ingredients" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Add / Configure Scientific Ingredient Intelligence
            </h3>
            <form onSubmit={handleCreateIngredient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  value={newIngName}
                  onChange={(e) => setNewIngName(e.target.value)}
                  placeholder="e.g. Erythritol or Mono- and Diglycerides"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Classification *
                  </label>
                  <select
                    value={newIngClassification}
                    onChange={(e) => setNewIngClassification(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold"
                  >
                    <option value="GREEN" className="text-emerald-600">GREEN — Beneficial / Low Concern</option>
                    <option value="ORANGE" className="text-amber-600">ORANGE — Consume in Moderation</option>
                    <option value="RED" className="text-rose-600">RED — Avoid / Significant Concern</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    INS / E-Number
                  </label>
                  <input
                    type="text"
                    value={newIngIns}
                    onChange={(e) => setNewIngIns(e.target.value)}
                    placeholder="e.g. INS 968 or E 471"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={newIngCategory}
                    onChange={(e) => setNewIngCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                  >
                    <option value="Sweetener">Sweetener</option>
                    <option value="Emulsifier">Emulsifier</option>
                    <option value="Stabilizer">Stabilizer</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Protein">Protein</option>
                    <option value="Dietary Fibre">Dietary Fibre</option>
                    <option value="Acidity Regulator">Acidity Regulator</option>
                    <option value="Preservative">Preservative</option>
                    <option value="Color">Color</option>
                    <option value="Fat / Oil">Fat / Oil</option>
                    <option value="Whole Food / General">Whole Food / General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Origin
                  </label>
                  <select
                    value={newIngOrigin}
                    onChange={(e) => setNewIngOrigin(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                  >
                    <option value="Natural">Natural</option>
                    <option value="Extracted">Extracted</option>
                    <option value="Fermentation-derived">Fermentation-derived</option>
                    <option value="Manufactured / Synthetic">Manufactured / Synthetic</option>
                    <option value="Mineral / Inorganic">Mineral / Inorganic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  What Is It? (Description)
                </label>
                <textarea
                  rows={2}
                  value={newIngDesc}
                  onChange={(e) => setNewIngDesc(e.target.value)}
                  placeholder="Plain language description for consumers..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Why Is It Used? (Food Function)
                </label>
                <input
                  type="text"
                  value={newIngFunction}
                  onChange={(e) => setNewIngFunction(e.target.value)}
                  placeholder="e.g. Acts as a thickener and retards ice crystal growth."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Acceptable Daily Intake (ADI)
                  </label>
                  <input
                    type="text"
                    value={newIngAdi}
                    onChange={(e) => setNewIngAdi(e.target.value)}
                    placeholder="e.g. 0 - 4 mg/kg bw/day [JECFA]"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                    Recommended Intake
                  </label>
                  <input
                    type="text"
                    value={newIngRecommended}
                    onChange={(e) => setNewIngRecommended(e.target.value)}
                    placeholder="e.g. < 50g/day free sugars [WHO]"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  FoodDecode Verdict
                </label>
                <input
                  type="text"
                  value={newIngVerdict}
                  onChange={(e) => setNewIngVerdict(e.target.value)}
                  placeholder="Short, practical conclusion for consumers..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Regulatory Standing
                </label>
                <input
                  type="text"
                  value={newIngRegulatory}
                  onChange={(e) => setNewIngRegulatory(e.target.value)}
                  placeholder="e.g. FDA GRAS / EFSA Authorized / FSSAI Permitted"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 dark:text-stone-400 block mb-1">
                  Aliases & Synonyms (comma-separated)
                </label>
                <input
                  type="text"
                  value={newIngAliases}
                  onChange={(e) => setNewIngAliases(e.target.value)}
                  placeholder="e.g. E968, erythritol powder, polyol"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Save Scientific Ingredient Intelligence
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                Active Ingredient Intelligence Registry ({customIngredients.length} entries)
              </h3>

              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={ingSearchQuery}
                  onChange={(e) => setIngSearchQuery(e.target.value)}
                  placeholder="Filter ingredients..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs"
                />
              </div>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[600px] overflow-y-auto text-xs space-y-1">
              {customIngredients
                .filter(
                  (ing) =>
                    !ingSearchQuery ||
                    ing.name?.toLowerCase().includes(ingSearchQuery.toLowerCase()) ||
                    ing.insNumber?.toLowerCase().includes(ingSearchQuery.toLowerCase()) ||
                    ing.category?.toLowerCase().includes(ingSearchQuery.toLowerCase())
                )
                .map((ing) => {
                  const cls = ing.classification || (
                    ing.riskLevel === "avoid" ? "RED" : ing.riskLevel === "caution" ? "ORANGE" : "GREEN"
                  );
                  return (
                    <div key={ing._id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-stone-900 dark:text-stone-100 capitalize text-sm">
                            {ing.name}
                          </span>
                          {ing.insNumber && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                              {ing.insNumber}
                            </span>
                          )}
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              cls === "GREEN"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : cls === "ORANGE"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            )}
                          >
                            {cls}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 line-clamp-2">
                          {ing.description || ing.foodFunction || "Standard food ingredient"}
                        </p>
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Category: {ing.category || "General"} · Regulatory: {ing.regulatoryStatus || "Permitted"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: RULES */}
      {activeTab === "rules" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Active Scoring Algorithm v{rules?.version || 1}
          </h3>
          <pre className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-xs overflow-x-auto text-stone-800 dark:text-stone-200">
            {JSON.stringify(rules?.rules, null, 2)}
          </pre>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Product Management Audit Trail
            </h3>
            <span className="text-xs text-stone-500">{auditLogs.length} events recorded</span>
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
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-500">{log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Add / Edit Product Modal */}
      <ProductFormModal
        product={selectedProductForEdit}
        categories={categories}
        isOpen={isFormModalOpen}
        adminKey={adminKey}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProductForEdit(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* 2. Dedicated Product Mapping Correction Modal */}
      <ProductMappingModal
        product={selectedProductForMapping}
        categories={categories}
        isOpen={isMappingModalOpen}
        onClose={() => {
          setIsMappingModalOpen(false);
          setSelectedProductForMapping(null);
        }}
        onSave={handleSaveMapping}
      />

      {/* 3. Bulk Edit Modal */}
      <BulkEditModal
        selectedIds={bulkSelectedIds}
        categories={categories}
        isOpen={isBulkEditModalOpen}
        onClose={() => {
          setIsBulkEditModalOpen(false);
          setBulkSelectedIds([]);
        }}
        onApply={handleBulkApply}
      />

      {/* 4. Duplicates Modal */}
      <DuplicatesModal
        isOpen={isDuplicatesModalOpen}
        adminKey={adminKey}
        onClose={() => setIsDuplicatesModalOpen(false)}
        onMergeSuccess={() => {
          loadCatalogStats();
          loadProductsTable();
        }}
      />
    </div>
  );
}
