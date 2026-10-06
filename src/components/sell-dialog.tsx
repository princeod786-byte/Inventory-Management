import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/inventory";
import { formatMoney, parseMoney, roundMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function SellDialog({
  product,
  open,
  onOpenChange,
  onSell,
  busy,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSell: (sellingPrice: number) => Promise<Product>;
  busy: boolean;
}) {
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Product | null>(null);

  useEffect(() => {
    if (!open) return;
    setPrice("");
    setError(null);
    setResult(product?.status === "sold" ? product : null);
  }, [open, product]);

  const live = useMemo(() => {
    if (!product) return null;
    const selling = parseMoney(price);
    if (!price.trim() || selling <= 0) return null;
    return roundMoney(selling - product.purchasePrice);
  }, [price, product]);

  if (!product) return null;

  const shown = result ?? (product.status === "sold" ? product : null);

  async function submit() {
    if (!product) return;
    const selling = roundMoney(parseMoney(price));
    if (selling <= 0) {
      setError("Enter a selling price.");
      return;
    }
    setError(null);
    try {
      const sold = await onSell(selling);
      setResult(sold);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record the sale.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shown ? "Sale recorded" : `Sell ${product.name}?`}</DialogTitle>
          <DialogDescription>
            {shown
              ? `${shown.soldByName ?? "Someone"} sold this item.`
              : `Purchase price ${formatMoney(product.purchasePrice)}. Enter what it sold for.`}
          </DialogDescription>
        </DialogHeader>

        {shown && shown.sellingPrice != null && shown.profit != null ? (
          <div className="mt-4 space-y-4">
            <div
              className={cn(
                "rounded-lg px-4 py-5 text-center",
                shown.profit >= 0 ? "bg-profit/10" : "bg-loss/10",
              )}
            >
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                {shown.profit >= 0 ? "Profit" : "Loss"}
              </p>
              <p
                className={cn(
                  "mt-1 font-display text-4xl font-medium tracking-tight tabular-nums",
                  shown.profit >= 0 ? "text-profit" : "text-loss",
                )}
              >
                {formatMoney(shown.profit)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-subtle">Cost</dt>
                <dd className="font-medium tabular-nums">{formatMoney(shown.purchasePrice)}</dd>
              </div>
              <div>
                <dt className="text-subtle">Sold for</dt>
                <dd className="font-medium tabular-nums">{formatMoney(shown.sellingPrice)}</dd>
              </div>
            </dl>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="selling-price">Selling price</Label>
              <Input
                id="selling-price"
                inputMode="decimal"
                type="number"
                min="0.01"
                step="0.01"
                autoFocus
                placeholder="0.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            {live != null ? (
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  live >= 0 ? "text-profit" : "text-loss",
                )}
              >
                {live >= 0 ? "Profit" : "Loss"} {formatMoney(live)}
              </p>
            ) : null}
            {error ? <p className="text-sm text-loss">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Recording…" : "Record sale"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
