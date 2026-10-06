import { useState, type FormEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { compressImage } from "@/lib/image";
import { parseMoney, roundMoney } from "@/lib/money";

export function AddProductDialog({
  open,
  onOpenChange,
  onAdd,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (input: {
    name: string;
    description: string;
    purchasePrice: number;
    pictureUrl: string | null;
  }) => Promise<void>;
  busy: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  function reset() {
    setName("");
    setDescription("");
    setPrice("");
    setPictureUrl(null);
    setError(null);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setCompressing(true);
    try {
      const url = await compressImage(file);
      setPictureUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that photo.");
    } finally {
      setCompressing(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const purchasePrice = roundMoney(parseMoney(price));
    if (!name.trim()) {
      setError("Give the item a name.");
      return;
    }
    if (purchasePrice <= 0) {
      setError("Enter a purchase price.");
      return;
    }
    setError(null);
    try {
      await onAdd({
        name: name.trim(),
        description: description.trim(),
        purchasePrice,
        pictureUrl,
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the item.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            Photo, cost, and a short description. One card is one item.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4" onSubmit={(event) => void submit(event)}>
          <div className="space-y-1.5">
            <Label htmlFor="product-photo">Picture</Label>
            <label className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-dashed border-border bg-bg">
              {pictureUrl ? (
                <img src={pictureUrl} alt="" className="h-40 w-full object-cover" />
              ) : (
                <span className="grid h-28 place-items-center px-4 text-center text-sm text-muted">
                  {compressing ? "Preparing photo…" : "Tap to add a photo"}
                </span>
              )}
              <input
                id="product-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => void onFile(event.target.files?.[0])}
              />
            </label>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product-name">Name</Label>
            <Input
              id="product-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Stoneware mug"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product-price">Purchase price</Label>
            <Input
              id="product-price"
              inputMode="decimal"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product-desc">Description</Label>
            <Textarea
              id="product-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is it, briefly."
              maxLength={500}
            />
          </div>
          {error ? <p className="text-sm text-loss">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy || compressing}>
            {busy ? "Saving…" : "Add to stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
