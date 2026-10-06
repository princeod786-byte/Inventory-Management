import { r as createServerFn } from "./_ssr/ssr.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/__root-Cn8gvXfc.js
var fetchSessionUser_createServerFn_handler = createServerRpc({
	id: "2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26",
	name: "fetchSessionUser",
	filename: "src/routes/__root.tsx"
}, (opts) => fetchSessionUser.__executeServer(opts));
var fetchSessionUser = createServerFn({ method: "GET" }).handler(fetchSessionUser_createServerFn_handler, async () => {
	const { getSessionUser } = await import("./_ssr/verify.server-C_8U_h9K.mjs");
	const user = await getSessionUser();
	return user ? {
		id: user.id,
		email: user.email
	} : null;
});
//#endregion
export { fetchSessionUser_createServerFn_handler };
