import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Jt as object, Zt as string, qt as number } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as roundMoney, i as parseMoney, n as formatMoney, t as authMiddleware } from "./money-vl4JJyWU.mjs";
import { a as Plus, i as Search, n as Warehouse, t as X } from "../_libs/lucide-react.mjs";
import { a as cn, i as LoginScreen, n as Input, o as useCurrentUser, r as Label, s as useCurrentUserState, t as Button } from "./login-screen-C_uz3mcl.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as createSsrRpc } from "./router-SFn1-wOU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CMk8LGx-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var listProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e48423b7f039eaef36e9a5cee50455d668bd1893d939b0f522e23c7893602898"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3218daae38b514be8f535edf594be9b8b707e2992cfb2b6782bd375c60fc86fb"));
var addProductInput = object({
	name: string().trim().min(1).max(120),
	description: string().trim().max(500),
	purchasePrice: number().positive().max(1e6),
	pictureUrl: string().max(25e4).nullable()
});
var addProduct = createServerFn({ method: "POST" }).validator((input) => addProductInput.parse(input)).middleware([authMiddleware]).handler(createSsrRpc("941dcd6e73ef7e56c4c8e3b6defcc8d9a5cc01538b69928c37c9666ab7a99810"));
var sellProductInput = object({
	productId: number().int().positive(),
	sellingPrice: number().positive().max(1e6)
});
var sellProduct = createServerFn({ method: "POST" }).validator((input) => sellProductInput.parse(input)).middleware([authMiddleware]).handler(createSsrRpc("72df0126bf7559bb17954e4380a674c45c279257b44b12416bc4973d27674a79"));
var removeProductInput = object({ productId: number().int().positive() });
createServerFn({ method: "POST" }).validator((input) => removeProductInput.parse(input)).middleware([authMiddleware]).handler(createSsrRpc("434ae038a887b17fcb6a3df1e391809d372454210cc541aacae9b5c2c929b640"));
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-border/70", className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-fg/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-soft outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 grid size-11 place-items-center rounded-md text-muted hover:bg-fg/5 hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-1.5 pr-8", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50", className),
		...props
	});
}
async function compressImage(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not read that image.");
	ctx.fillStyle = "#f3efe6";
	ctx.fillRect(0, 0, width, height);
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	let quality = .78;
	let dataUrl = canvas.toDataURL("image/jpeg", quality);
	while (dataUrl.length > 18e4 && quality > .42) {
		quality -= .08;
		dataUrl = canvas.toDataURL("image/jpeg", quality);
	}
	if (dataUrl.length > 24e4) throw new Error("That photo is still too large. Try a simpler image.");
	return dataUrl;
}
function AddProductDialog({ open, onOpenChange, onAdd, busy }) {
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [pictureUrl, setPictureUrl] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [compressing, setCompressing] = (0, import_react.useState)(false);
	function reset() {
		setName("");
		setDescription("");
		setPrice("");
		setPictureUrl(null);
		setError(null);
	}
	async function onFile(file) {
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
	async function submit(event) {
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
				pictureUrl
			});
			reset();
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not add the item.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next) reset();
			onOpenChange(next);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Photo, cost, and a short description. One card is one item." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 space-y-4",
			onSubmit: (event) => void submit(event),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "product-photo",
						children: "Picture"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer flex-col overflow-hidden rounded-lg border border-dashed border-border bg-bg",
						children: [pictureUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: pictureUrl,
							alt: "",
							className: "h-40 w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-28 place-items-center px-4 text-center text-sm text-muted",
							children: compressing ? "Preparing photo…" : "Tap to add a photo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "product-photo",
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: (event) => void onFile(event.target.files?.[0])
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "product-name",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "product-name",
						required: true,
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "Stoneware mug"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "product-price",
						children: "Purchase price"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "product-price",
						inputMode: "decimal",
						type: "number",
						min: "0.01",
						step: "0.01",
						required: true,
						value: price,
						onChange: (event) => setPrice(event.target.value),
						placeholder: "0.00"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "product-desc",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "product-desc",
						value: description,
						onChange: (event) => setDescription(event.target.value),
						placeholder: "What is it, briefly.",
						maxLength: 500
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-loss",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy || compressing,
					children: busy ? "Saving…" : "Add to stock"
				})
			]
		})] })
	});
}
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted", className),
		...props
	});
}
function timeLabel(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}
function DashboardPanel({ data, currentUserId }) {
	const [userId, setUserId] = (0, import_react.useState)("all");
	const [action, setAction] = (0, import_react.useState)("all");
	const activity = (0, import_react.useMemo)(() => {
		return data.activity.filter((row) => {
			if (userId !== "all" && row.actorId !== userId) return false;
			if (action !== "all" && row.action !== action) return false;
			return true;
		});
	}, [
		action,
		data.activity,
		userId
	]);
	const stats = [
		{
			label: "In stock",
			value: String(data.stats.inStock)
		},
		{
			label: "Sold",
			value: String(data.stats.sold)
		},
		{
			label: "Stock value",
			value: formatMoney(data.stats.stockValue)
		},
		{
			label: "Realized P/L",
			value: formatMoney(data.stats.realizedProfit),
			tone: data.stats.realizedProfit > 0 ? "profit" : data.stats.realizedProfit < 0 ? "loss" : "neutral"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface px-4 py-4 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: stat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-2 font-display text-2xl font-medium tracking-tight tabular-nums", "tone" in stat && stat.tone === "profit" && "text-profit", "tone" in stat && stat.tone === "loss" && "text-loss"),
						children: stat.value
					})]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium tracking-tight",
						children: "Team"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Signed-in people and what they have done in this shop."
					}),
					data.users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "No accounts yet besides seed stock."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: data.users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 py-3",
							children: [
								user.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: user.image,
									alt: "",
									className: "size-10 rounded-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-medium text-primary",
									children: (user.name || "?").charAt(0).toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 truncate font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: user.name
										}), user.id === currentUserId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "you" }) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-subtle",
										children: user.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-right text-xs text-muted tabular-nums",
									children: [
										user.addedCount,
										" added",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										user.soldCount,
										" sold"
									]
								})
							]
						}, user.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium tracking-tight",
						children: "Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Who added, sold, or removed an item."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Filter by person",
							value: userId,
							onChange: (event) => setUserId(event.target.value),
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Everyone"
							}), data.users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: user.id,
								children: user.name
							}, user.id))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Filter by action",
							value: action,
							onChange: (event) => setAction(event.target.value),
							className: "h-11 rounded-md border border-border bg-surface px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All actions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "added",
									children: "Added"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "sold",
									children: "Sold"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "removed",
									children: "Removed"
								})
							]
						})]
					})]
				}), activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Nothing matches those filters."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: activity.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-1 rounded-lg border border-border bg-bg px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									row.actorName,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted",
										children: [
											row.action,
											" ",
											row.productName
										]
									})
								]
							}), row.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-subtle",
								children: row.detail
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "capitalize",
								children: row.action
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle tabular-nums",
								children: timeLabel(row.createdAt)
							})]
						})]
					}, row.id))
				})]
			})
		]
	});
}
function PictureFallback({ name }) {
	const letter = name.trim().charAt(0).toUpperCase() || "S";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full w-full place-items-center bg-primary/10 font-display text-5xl font-medium text-primary",
		children: letter
	});
}
function ProductCard({ product, onPictureClick }) {
	const sold = product.status === "sold";
	const profit = product.profit;
	const profitLabel = profit == null ? null : profit >= 0 ? `Profit ${formatMoney(profit)}` : `Loss ${formatMoney(profit)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-xl border border-border bg-surface shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onPictureClick(product),
			"aria-label": sold ? `View sale for ${product.name}` : `Sell ${product.name}`,
			className: "group relative block aspect-square w-full overflow-hidden bg-bg",
			children: [product.pictureUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.pictureUrl,
				alt: "",
				className: cn("h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105", sold && "grayscale")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureFallback, { name: product.name }), sold ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-3 left-3 rounded-full bg-fg px-2.5 py-1 text-xs font-medium tracking-wide text-primary-fg uppercase",
				children: "Sold"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-medium leading-snug tracking-tight",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shrink-0 font-medium tabular-nums",
						children: formatMoney(product.purchasePrice)
					})]
				}),
				product.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2 text-sm text-muted",
					children: product.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: sold ? "Sold" : "In stock" }), profitLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: profit != null && profit >= 0 ? "border-profit/20 bg-profit/10 text-profit" : "border-loss/20 bg-loss/10 text-loss",
						children: profitLabel
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-subtle",
					children: [
						"Added by ",
						product.createdByName,
						product.soldByName ? ` · Sold by ${product.soldByName}` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: sold ? "Tap the photo to see profit" : "Tap the photo to sell"
				})
			]
		})]
	});
}
function SellDialog({ product, open, onOpenChange, onSell, busy }) {
	const [price, setPrice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setPrice("");
		setError(null);
		setResult(product?.status === "sold" ? product : null);
	}, [open, product]);
	const live = (0, import_react.useMemo)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: shown ? "Sale recorded" : `Sell ${product.name}?` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: shown ? `${shown.soldByName ?? "Someone"} sold this item.` : `Purchase price ${formatMoney(product.purchasePrice)}. Enter what it sold for.` })] }), shown && shown.sellingPrice != null && shown.profit != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-lg px-4 py-5 text-center", shown.profit >= 0 ? "bg-profit/10" : "bg-loss/10"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: shown.profit >= 0 ? "Profit" : "Loss"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 font-display text-4xl font-medium tracking-tight tabular-nums", shown.profit >= 0 ? "text-profit" : "text-loss"),
						children: formatMoney(shown.profit)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Cost"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium tabular-nums",
						children: formatMoney(shown.purchasePrice)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Sold for"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium tabular-nums",
						children: formatMoney(shown.sellingPrice)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: () => onOpenChange(false),
					children: "Done"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 space-y-4",
			onSubmit: (event) => {
				event.preventDefault();
				submit();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "selling-price",
						children: "Selling price"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "selling-price",
						inputMode: "decimal",
						type: "number",
						min: "0.01",
						step: "0.01",
						autoFocus: true,
						placeholder: "0.00",
						value: price,
						onChange: (event) => setPrice(event.target.value)
					})]
				}),
				live != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("text-sm font-medium tabular-nums", live >= 0 ? "text-profit" : "text-loss"),
					children: [
						live >= 0 ? "Profit" : "Loss",
						" ",
						formatMoney(live)
					]
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-loss",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Recording…" : "Record sale"
				})
			]
		})] })
	});
}
function unauthorized(error) {
	return error instanceof Error && error.message === "Unauthorized";
}
function StockroomApp({ user }) {
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("stock");
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [actor, setActor] = (0, import_react.useState)("all");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const productsQuery = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const dashboardQuery = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const products = productsQuery.data ?? [];
	const actors = (0, import_react.useMemo)(() => {
		const names = /* @__PURE__ */ new Map();
		for (const product of products) {
			names.set(product.createdBy, product.createdByName);
			if (product.soldBy && product.soldByName) names.set(product.soldBy, product.soldByName);
		}
		return [...names.entries()].sort((a, b) => a[1].localeCompare(b[1]));
	}, [products]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return products.filter((product) => {
			if (status !== "all" && product.status !== status) return false;
			if (actor !== "all") {
				if (!(product.createdBy === actor || product.soldBy === actor)) return false;
			}
			if (!needle) return true;
			return product.name.toLowerCase().includes(needle) || product.description.toLowerCase().includes(needle);
		});
	}, [
		actor,
		products,
		query,
		status
	]);
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["products"] });
		queryClient.invalidateQueries({ queryKey: ["dashboard"] });
	}
	const addMutation = useMutation({
		mutationFn: (input) => addProduct({ data: input }),
		onSuccess: invalidate,
		onError: (error) => {
			if (unauthorized(error)) return;
			toast.error(error.message);
		}
	});
	const sellMutation = useMutation({
		mutationFn: (input) => sellProduct({ data: input }),
		onSuccess: (product) => {
			setSelected(product);
			invalidate();
		},
		onError: (error) => {
			if (unauthorized(error)) return;
			toast.error(error.message);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-surface/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-lg bg-primary text-primary-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl font-medium tracking-tight",
									children: "Stockroom"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted sm:text-sm",
									children: "Shared stock · logged by person"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setAddOpen(true),
								className: "hidden sm:inline-flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add product"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-lg bg-bg p-1",
							children: [["stock", "Inventory"], ["activity", "Dashboard"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTab(id),
								className: cn("h-10 min-w-24 flex-1 rounded-md px-4 text-sm font-medium transition-colors duration-150 sm:flex-none", tab === id ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg"),
								children: label
							}, id))
						}), tab === "stock" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-w-0 flex-1 sm:w-56 sm:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search stock",
									className: "pl-9",
									"aria-label": "Search products"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Filter by status",
									value: status,
									onChange: (event) => setStatus(event.target.value),
									className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm sm:flex-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All items"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "in_stock",
											children: "In stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sold",
											children: "Sold"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Filter by person",
									value: actor,
									onChange: (event) => setActor(event.target.value),
									className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm sm:flex-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "Anyone"
									}), actors.map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: id,
										children: name
									}, id))]
								})]
							})]
						}) : null]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-6 pb-32 sm:px-6 sm:pb-16",
				children: tab === "stock" ? productsQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[3/4] rounded-xl" }, index))
				}) : productsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-loss",
					children: unauthorized(productsQuery.error) ? "Please sign in again." : "Could not load inventory."
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-medium tracking-tight",
							children: products.length === 0 ? "No stock yet" : "Nothing matches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-sm text-sm text-muted",
							children: products.length === 0 ? "Add a product with a photo and cost. Tap the photo when it sells." : "Try a different search or filter."
						}),
						products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-6",
							onClick: () => setAddOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add product"]
						}) : null
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: filtered.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product,
						onPictureClick: setSelected
					}, product.id))
				}) : dashboardQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
						children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, index))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" })]
				}) : dashboardQuery.isError || !dashboardQuery.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-loss",
					children: "Could not load the dashboard."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardPanel, {
					data: dashboardQuery.data,
					currentUserId: user.id
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed right-4 bottom-20 sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					className: "rounded-full shadow-soft",
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddProductDialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				busy: addMutation.isPending,
				onAdd: async (input) => {
					await addMutation.mutateAsync(input);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellDialog, {
				product: selected,
				open: selected != null,
				onOpenChange: (open) => {
					if (!open) setSelected(null);
				},
				busy: sellMutation.isPending,
				onSell: async (sellingPrice) => {
					if (!selected) throw new Error("No product selected.");
					return sellMutation.mutateAsync({
						productId: selected.id,
						sellingPrice
					});
				}
			})
		]
	});
}
function Home() {
	const { user } = useCurrentUserState();
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockroomApp, { user });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {});
}
//#endregion
export { Home as component };
