import "dotenv/config";
import { buildApp } from "./app";

(async () => {
	const app = await buildApp();
	const port = parseInt(process.env.PORT || "3333", 10);
	try {
		await app.listen({ port, host: "0.0.0.0" });
		console.log(`API rodando na porta ${port}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
})();
