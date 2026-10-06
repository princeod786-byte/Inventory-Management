import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { Jt as object, Zt as string, qt as number } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-D-LfF_z-.mjs";
import { a as roundMoney, i as parseMoney, r as isoDate, t as authMiddleware } from "./money-vl4JJyWU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DU5tv96Y.js
function mapProduct(row) {
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
		soldAt: row.sold_at == null ? null : isoDate(row.sold_at)
	};
}
function mapActivity(row) {
	return {
		id: row.id,
		actorId: row.actor_id,
		actorName: row.actor_name,
		action: row.action,
		productId: row.product_id,
		productName: row.product_name,
		detail: row.detail,
		createdAt: isoDate(row.created_at)
	};
}
async function actorName(userId) {
	const row = (await (await getSql())`
    select name, email from "user" where id = ${userId} limit 1
  `)[0];
	const name = row?.name?.trim();
	if (name) return name;
	const email = row?.email?.trim();
	if (email) return email;
	return "Teammate";
}
function isSafePicture(url) {
	if (!url) return true;
	if (url.length > 25e4) return false;
	if (url.startsWith("data:image/jpeg") || url.startsWith("data:image/png") || url.startsWith("data:image/webp") || url.startsWith("data:image/gif")) return true;
	if (url.startsWith("/products/") && !url.includes("..") && url.length < 200) return true;
	try {
		return new URL(url).protocol === "https:" && url.length < 2e3;
	} catch {
		return false;
	}
}
var productSelect = `
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
var listProducts_createServerFn_handler = createServerRpc({
	id: "e48423b7f039eaef36e9a5cee50455d668bd1893d939b0f522e23c7893602898",
	name: "listProducts",
	filename: "src/lib/inventory.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProducts_createServerFn_handler, async () => {
	return (await (await getSql()).query(`${productSelect} order by p.created_at desc, p.id desc`)).map(mapProduct);
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "3218daae38b514be8f535edf594be9b8b707e2992cfb2b6782bd375c60fc86fb",
	name: "getDashboard",
	filename: "src/lib/inventory.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async () => {
	const sql = await getSql();
	const statsRow = (await sql`
      select
        (select count(*)::int from products where status = 'in_stock') as in_stock,
        (select count(*)::int from products where status = 'sold') as sold,
        (select coalesce(sum(purchase_price), 0) from products where status = 'in_stock') as stock_value,
        (select coalesce(sum(profit), 0) from sales) as realized_profit
    `)[0];
	const userRows = await sql`
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
	const activityRows = await sql.query(`select id, actor_id, actor_name, action, product_id, product_name, detail, created_at
       from activity
       order by created_at desc, id desc
       limit 80`);
	return {
		stats: {
			inStock: Number(statsRow?.in_stock ?? 0),
			sold: Number(statsRow?.sold ?? 0),
			stockValue: parseMoney(statsRow?.stock_value),
			realizedProfit: parseMoney(statsRow?.realized_profit)
		},
		users: userRows.map((row) => ({
			id: row.id,
			name: row.name,
			email: row.email,
			image: row.image,
			addedCount: Number(row.added_count),
			soldCount: Number(row.sold_count)
		})),
		activity: activityRows.map(mapActivity)
	};
});
var addProductInput = object({
	name: string().trim().min(1).max(120),
	description: string().trim().max(500),
	purchasePrice: number().positive().max(1e6),
	pictureUrl: string().max(25e4).nullable()
});
var addProduct_createServerFn_handler = createServerRpc({
	id: "941dcd6e73ef7e56c4c8e3b6defcc8d9a5cc01538b69928c37c9666ab7a99810",
	name: "addProduct",
	filename: "src/lib/inventory.ts"
}, (opts) => addProduct.__executeServer(opts));
var addProduct = createServerFn({ method: "POST" }).validator((input) => addProductInput.parse(input)).middleware([authMiddleware]).handler(addProduct_createServerFn_handler, async ({ context, data }) => {
	if (!isSafePicture(data.pictureUrl)) throw new Error("That picture cannot be saved.");
	const name = await actorName(context.userId);
	const price = roundMoney(data.purchasePrice);
	const sql = await getSql();
	const product = (await sql`
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
    `)[0];
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
var sellProductInput = object({
	productId: number().int().positive(),
	sellingPrice: number().positive().max(1e6)
});
var sellProduct_createServerFn_handler = createServerRpc({
	id: "72df0126bf7559bb17954e4380a674c45c279257b44b12416bc4973d27674a79",
	name: "sellProduct",
	filename: "src/lib/inventory.ts"
}, (opts) => sellProduct.__executeServer(opts));
var sellProduct = createServerFn({ method: "POST" }).validator((input) => sellProductInput.parse(input)).middleware([authMiddleware]).handler(sellProduct_createServerFn_handler, async ({ context, data }) => {
	const sellingPrice = roundMoney(data.sellingPrice);
	const name = await actorName(context.userId);
	const sql = await getSql();
	const product = (await sql`
      select id, name, purchase_price, status
      from products
      where id = ${data.productId}
      limit 1
    `)[0];
	if (!product) throw new Error("Product not found.");
	if (product.status !== "in_stock") throw new Error("This item is already sold.");
	const purchasePrice = parseMoney(product.purchase_price);
	const profit = roundMoney(sellingPrice - purchasePrice);
	if ((await sql`
      update products
      set status = 'sold'
      where id = ${data.productId} and status = 'in_stock'
      returning id
    `).length === 0) throw new Error("This item is already sold.");
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
	const mapped = (await sql.query(`${productSelect} where p.id = $1`, [data.productId]))[0];
	if (!mapped) throw new Error("Sale recorded, but the item could not be reloaded.");
	return mapProduct(mapped);
});
var removeProductInput = object({ productId: number().int().positive() });
var removeProduct_createServerFn_handler = createServerRpc({
	id: "434ae038a887b17fcb6a3df1e391809d372454210cc541aacae9b5c2c929b640",
	name: "removeProduct",
	filename: "src/lib/inventory.ts"
}, (opts) => removeProduct.__executeServer(opts));
var removeProduct = createServerFn({ method: "POST" }).validator((input) => removeProductInput.parse(input)).middleware([authMiddleware]).handler(removeProduct_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const product = (await sql`
      select id, name, status from products where id = ${data.productId} limit 1
    `)[0];
	if (!product) throw new Error("Product not found.");
	if (product.status === "sold") throw new Error("Sold items stay on the ledger.");
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
//#endregion
export { addProduct_createServerFn_handler, getDashboard_createServerFn_handler, listProducts_createServerFn_handler, removeProduct_createServerFn_handler, sellProduct_createServerFn_handler };
