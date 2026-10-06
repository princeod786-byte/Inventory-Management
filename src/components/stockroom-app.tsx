import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Warehouse } from "lucide-react";
import { toast } from "sonner";
import { UserButton } from "@/lib/auth/gates";
import type { AppUser } from "@/lib/auth/use-current-user";
import {
  addProduct,
  getDashboard,
  listProducts,
  removeProduct,
  sellProduct,
  type Product,
} from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProductDialog } from "@/components/add-product-dialog";
import { DashboardPanel } from "@/components/dashboard-panel";
import { ProductCard } from "@/components/product-card";
import { SellDialog } from "@/components/sell-dialog";
import { cn } from "@/lib/utils";

type Tab = "stock" | "activity";
type StatusFilter = "all" | "in_stock" | "sold";

function unauthorized(error: unknown): boolean {
  return error instanceof Error && error.message === "Unauthorized";
}

export function StockroomApp({ user }: { user: AppUser }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("stock");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [actor, setActor] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
  });

  const products = productsQuery.data ?? [];

  const actors = useMemo(() => {
    const names = new Map<string, string>();
    for (const product of products) {
      names.set(product.createdBy, product.createdByName);
      if (product.soldBy && product.soldByName) {
        names.set(product.soldBy, product.soldByName);
      }
    }
    return [...names.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (status !== "all" && product.status !== status) return false;
      if (actor !== "all") {
        const matches =
          product.createdBy === actor || product.soldBy === actor;
        if (!matches) return false;
      }
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle)
      );
    });
  }, [actor, products, query, status]);

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: ["products"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  const addMutation = useMutation({
    mutationFn: (input: {
      name: string;
      description: string;
      purchasePrice: number;
      pictureUrl: string | null;
    }) => addProduct({ data: input }),
    onSuccess: invalidate,
    onError: (error) => {
      if (unauthorized(error)) return;
      toast.error(error.message);
    },
  });

  const sellMutation = useMutation({
    mutationFn: (input: { productId: number; sellingPrice: number }) =>
      sellProduct({ data: input }),
    onSuccess: (product) => {
      setSelected(product);
      invalidate();
    },
    onError: (error) => {
      if (unauthorized(error)) return;
      toast.error(error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeProduct({ data: { productId } }),
    onSuccess: invalidate,
    onError: (error) => {
      if (unauthorized(error)) return;
      toast.error(error.message);
    },
  });

  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border bg-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-fg">
                <Warehouse className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-medium tracking-tight">
                  Stockroom
                </p>
                <p className="truncate text-xs text-muted sm:text-sm">
                  Shared stock · logged by person
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setAddOpen(true)} className="hidden sm:inline-flex">
                <Plus />
                Add product
              </Button>
              <UserButton />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex rounded-lg bg-bg p-1">
              {(
                [
                  ["stock", "Inventory"],
                  ["activity", "Dashboard"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "h-10 min-w-24 flex-1 rounded-md px-4 text-sm font-medium transition-colors duration-150 sm:flex-none",
                    tab === id
                      ? "bg-surface text-fg shadow-soft"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "stock" ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search stock"
                    className="pl-9"
                    aria-label="Search products"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    aria-label="Filter by status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as StatusFilter)
                    }
                    className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm sm:flex-none"
                  >
                    <option value="all">All items</option>
                    <option value="in_stock">In stock</option>
                    <option value="sold">Sold</option>
                  </select>
                  <select
                    aria-label="Filter by person"
                    value={actor}
                    onChange={(event) => setActor(event.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm sm:flex-none"
                  >
                    <option value="all">Anyone</option>
                    {actors.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-32 sm:px-6 sm:pb-16">
        {tab === "stock" ? (
          productsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : productsQuery.isError ? (
            <p className="text-sm text-loss">
              {unauthorized(productsQuery.error)
                ? "Please sign in again."
                : "Could not load inventory."}
            </p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl font-medium tracking-tight">
                {products.length === 0 ? "No stock yet" : "Nothing matches"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                {products.length === 0
                  ? "Add a product with a photo and cost. Tap the photo when it sells."
                  : "Try a different search or filter."}
              </p>
              {products.length === 0 ? (
                <Button className="mt-6" onClick={() => setAddOpen(true)}>
                  <Plus />
                  Add product
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPictureClick={setSelected}
                  onRemove={(item) => {
                    if (!window.confirm(`Remove ${item.name} from stock?`)) return;
                    removeMutation.mutate(item.id);
                  }}
                />
              ))}
            </div>
          )
        ) : dashboardQuery.isPending ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : dashboardQuery.isError || !dashboardQuery.data ? (
          <p className="text-sm text-loss">Could not load the dashboard.</p>
        ) : (
          <DashboardPanel data={dashboardQuery.data} currentUserId={user.id} />
        )}
      </main>

      <div className="fixed right-4 bottom-20 sm:hidden">
        <Button
          size="lg"
          className="rounded-full shadow-soft"
          onClick={() => setAddOpen(true)}
        >
          <Plus />
          Add
        </Button>
      </div>

      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        busy={addMutation.isPending}
        onAdd={async (input) => {
          await addMutation.mutateAsync(input);
        }}
      />
      <SellDialog
        product={selected}
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        busy={sellMutation.isPending}
        onSell={async (sellingPrice) => {
          if (!selected) throw new Error("No product selected.");
          return sellMutation.mutateAsync({
            productId: selected.id,
            sellingPrice,
          });
        }}
      />
    </div>
  );
}
