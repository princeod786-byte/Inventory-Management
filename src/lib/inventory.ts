import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { isoDate, parseMoney, roundMoney } from "@/lib/money";

export type ProductStatus = "in_stock" | "sold";

export type Product = {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  pictureUrl: string | null;
  status: ProductStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  sellingPrice: number | null;
  profit: number | null;
  soldBy: string | null;
  soldByName: string | null;
  soldAt: string | null;
};

export type Activity = {
  id: number;
  actorId: string;
  actorName: string;
  action: "added" | "sold" | "removed";
  productId: number | null;
  productName: string;
  detail: string;
  createdAt: string;
};

export type TeamUser = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  addedCount: number;
  soldCount: number;
};

export type Dashboard = {
  stats: {
    inStock: number;
    sold: number;
    stockValue: number;
    realizedProfit: number;
  };
  users: TeamUser[];
  activity: Activity[];
};

type ProductRow = {
  id: number;
  name: string;
  description: string;
  purchase_price: string | number;
  picture_url: string | null;
  status: ProductStatus;
  created_by: string;
  created_by_name: string;
  created_at: unknown;
  selling_price: string | number | null;
  profit: string | number | null;
  sold_by: string | null;
  sold_by_name: string | null;
  sold_at: unknown | null;
};

type ActivityRow = {
  id: number;
  actor_id: string;
  actor_name: string;
  action: Activity["action"];
  product_id: number | null;
  product_name: string;
  detail: string;
  created_at: unknown;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    purchasePrice: parseMoney(row.purchase_price),
    pictureUrl: row.picture_url,
    status: row.status,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: isoDate(row.created_at),
    sellingPrice: row.selling_price == null ? null : parseMoney(row.selling_price),
    profit: row.profit == null ? null : parseMoney(row.profit),
    soldBy: row.sold_by,
    soldByName: row.sold_by_name,
    soldAt: row.sold_at == null ? null : isoDate(row.sold_at),
  };
}

function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    actorId: row.actor_id,
    actorName: row.actor_name,
    action: row.action,
    productId: row.product_id,
    productName: row.product_name,
    detail: row.detail,
    createdAt: isoDate(row.created_at),
  };
}

async function actorName(userId: string): Promise<string> {
  const sql = await getSql();
  const rows = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  const name = row?.name?.trim();
  if (name) return name;
  const email = row?.email?.trim();
  if (email) return email;
  return "Teammate";
}

function isSafePicture(url: string | null): boolean {
  if (!url) return true;
  if (url.length > 250_000) return false;
  if (
    url.startsWith("data:image/jpeg") ||
    url.startsWith("data:image/png") ||
    url.startsWith("data:image/webp") ||
    url.startsWith("data:image/gif")
  ) {
    return true;
  }
  if (url.startsWith("/products/") && !url.includes("..") && url.length < 200) {
    return true;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && url.length < 2000;
  } catch {
    return false;
  }
}

const productSelect = `
  select
    p.id,
    p.name,
    p.description,
    p.purchase_price,
    p.picture_url,
    p.status,
    p.created_by,
    p.created_by_name,
    p.created_at,
    s.selling_price,
    s.profit,
    s.sold_by,
    s.sold_by_name,
    s.sold_at
  from products p
  left join sales s on s.product_id = p.id
`;

export const listProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Product[]> => {
    const sql = await getSql();
    const rows = await sql.query<ProductRow>(
      `${productSelect} order by p.created_at desc, p.id desc`,
    );
    return rows.map(mapProduct);
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<Dashboard> => {
    const sql = await getSql();

    const statsRows = await sql<{
      in_stock: number;
      sold: number;
      stock_value: string | number | null;
      realized_profit: string | number | null;
    }>`
      select
        (select count(*)::int from products where status = 'in_stock') as in_stock,
        (select count(*)::int from products where status = 'sold') as sold,
        (select coalesce(sum(purchase_price), 0) from products where status = 'in_stock') as stock_value,
        (select coalesce(sum(profit), 0) from sales) as realized_profit
    `;
    const statsRow = statsRows[0];

    const userRows = await sql<{
      id: string;
      name: string;
      email: string | null;
      image: string | null;
      added_count: number;
      sold_count: number;
    }>`
      select
        u.id,
        u.name,
        u.email,
        u.image,
        coalesce(a.added, 0)::int as added_count,
        coalesce(s.sold, 0)::int as sold_count
      from "user" u
      left join (
        select created_by as user_id, count(*)::int as added
        from products
        group by created_by
      ) a on a.user_id = u.id
      left join (
        select sold_by as user_id, count(*)::int as sold
        from sales
        group by sold_by
      ) s on s.user_id = u.id
      order by u.name asc
    `;

    const activityRows = await sql.query<ActivityRow>(
      `select id, actor_id, actor_name, action, product_id, product_name, detail, created_at
       from activity
       order by created_at desc, id desc
       limit 80`,
    );

    return {
      stats: {
        inStock: Number(statsRow?.in_stock ?? 0),
        sold: Number(statsRow?.sold ?? 0),
        stockValue: parseMoney(statsRow?.stock_value),
        realizedProfit: parseMoney(statsRow?.realized_profit),
      },
      users: userRows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        image: row.image,
        addedCount: Number(row.added_count),
        soldCount: Number(row.sold_count),
      })),
      activity: activityRows.map(mapActivity),
    };
  });

const addProductInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  purchasePrice: z.number().positive().max(1_000_000),
  pictureUrl: z.string().max(250_000).nullable(),
});

export const addProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => addProductInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<Product> => {
    if (!isSafePicture(data.pictureUrl)) {
      throw new Error("That picture cannot be saved.");
    }
    const name = await actorName(context.userId);
    const price = roundMoney(data.purchasePrice);
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      insert into products (name, description, purchase_price, picture_url, created_by, created_by_name)
      values (
        ${data.name},
        ${data.description},
        ${price},
        ${data.pictureUrl},
        ${context.userId},
        ${name}
      )
      returning
        id, name, description, purchase_price, picture_url, status,
        created_by, created_by_name, created_at,
        null::numeric as selling_price,
        null::numeric as profit,
        null::text as sold_by,
        null::text as sold_by_name,
        null::timestamptz as sold_at
    `;
    const product = rows[0];
    if (!product) throw new Error("Could not add product.");
    await sql`
      insert into activity (actor_id, actor_name, action, product_id, product_name, detail)
      values (
        ${context.userId},
        ${name},
        'added',
        ${product.id},
        ${product.name},
        ${`Cost ${price.toFixed(2)}`}
      )
    `;
    return mapProduct(product);
  });

const sellProductInput = z.object({
  productId: z.number().int().positive(),
  sellingPrice: z.number().positive().max(1_000_000),
});

export const sellProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => sellProductInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<Product> => {
    const sellingPrice = roundMoney(data.sellingPrice);
    const name = await actorName(context.userId);
    const sql = await getSql();

    const current = await sql<{
      id: number;
      name: string;
      purchase_price: string | number;
      status: ProductStatus;
    }>`
      select id, name, purchase_price, status
      from products
      where id = ${data.productId}
      limit 1
    `;
    const product = current[0];
    if (!product) throw new Error("Product not found.");
    if (product.status !== "in_stock") throw new Error("This item is already sold.");

    const purchasePrice = parseMoney(product.purchase_price);
    const profit = roundMoney(sellingPrice - purchasePrice);

    const updated = await sql`
      update products
      set status = 'sold'
      where id = ${data.productId} and status = 'in_stock'
      returning id
    `;
    if (updated.length === 0) throw new Error("This item is already sold.");

    await sql`
      insert into sales (product_id, selling_price, profit, sold_by, sold_by_name)
      values (${data.productId}, ${sellingPrice}, ${profit}, ${context.userId}, ${name})
    `;

    const verb = profit >= 0 ? "profit" : "loss";
    await sql`
      insert into activity (actor_id, actor_name, action, product_id, product_name, detail)
      values (
        ${context.userId},
        ${name},
        'sold',
        ${data.productId},
        ${product.name},
        ${`Sold for ${sellingPrice.toFixed(2)} (${verb} ${Math.abs(profit).toFixed(2)})`}
      )
    `;

    const rows = await sql.query<ProductRow>(
      `${productSelect} where p.id = $1`,
      [data.productId],
    );
    const mapped = rows[0];
    if (!mapped) throw new Error("Sale recorded, but the item could not be reloaded.");
    return mapProduct(mapped);
  });

const removeProductInput = z.object({
  productId: z.number().int().positive(),
});

export const removeProduct = createServerFn({ method: "POST" })
  .validator((input: unknown) => removeProductInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<{ id: number }> => {
    const sql = await getSql();
    const rows = await sql<{ id: number; name: string; status: ProductStatus }>`
      select id, name, status from products where id = ${data.productId} limit 1
    `;
    const product = rows[0];
    if (!product) throw new Error("Product not found.");
    if (product.status === "sold") {
      throw new Error("Sold items stay on the ledger.");
    }
    const name = await actorName(context.userId);
    await sql`delete from products where id = ${data.productId} and status = 'in_stock'`;
    await sql`
      insert into activity (actor_id, actor_name, action, product_id, product_name, detail)
      values (
        ${context.userId},
        ${name},
        'removed',
        ${data.productId},
        ${product.name},
        'Removed from stock'
      )
    `;
    return { id: data.productId };
  });
