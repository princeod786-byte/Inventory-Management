import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/inventory";
import { cn } from "@/lib/utils";

function PictureFallback({ name }: { name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "S";
  return (
    <div className="grid h-full w-full place-items-center bg-primary/10 font-display text-5xl font-medium text-primary">
      {letter}
    </div>
  );
}

export function ProductCard({
  product,
  onPictureClick,
  onRemove,
}: {
  product: Product;
  onPictureClick: (product: Product) => void;
  onRemove: (product: Product) => void;
}) {
  const sold = product.status === "sold";
  const profit = product.profit;
  const profitLabel =
    profit == null
      ? null
      : profit >= 0
        ? `Profit ${formatMoney(profit)}`
        : `Loss ${formatMoney(profit)}`;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="relative">
        <button
          type="button"
          onClick={() => onPictureClick(product)}
          aria-label={sold ? `View sale for ${product.name}` : `Sell ${product.name}`}
          className="group relative block aspect-square w-full overflow-hidden bg-bg"
        >
          {product.pictureUrl ? (
            <img
              src={product.pictureUrl}
              alt=""
              className={cn(
                "h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105",
                sold && "grayscale",
              )}
            />
          ) : (
            <PictureFallback name={product.name} />
          )}
          {sold ? (
            <span className="absolute top-3 left-3 rounded-full bg-fg px-2.5 py-1 text-xs font-medium tracking-wide text-primary-fg uppercase">
              Sold
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onRemove(product)}
          className="absolute top-3 right-3 z-10 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-loss shadow-soft"
        >
          Remove
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-snug tracking-tight">
            {product.name}
          </h3>
          <p className="shrink-0 font-medium tabular-nums">
            {formatMoney(product.purchasePrice)}
          </p>
        </div>
        {product.description ? (
          <p className="line-clamp-2 text-sm text-muted">{product.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge>{sold ? "Sold" : "In stock"}</Badge>
          {profitLabel ? (
            <Badge
              className={
                profit != null && profit >= 0
                  ? "border-profit/20 bg-profit/10 text-profit"
                  : "border-loss/20 bg-loss/10 text-loss"
              }
            >
              {profitLabel}
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-subtle">
          Added by {product.createdByName}
          {product.soldByName ? ` · Sold by ${product.soldByName}` : ""}
        </p>
        <p className="text-xs text-subtle">
          {sold ? "Tap the photo to see profit" : "Tap the photo to sell"}
        </p>
      </div>
    </article>
  );
}
