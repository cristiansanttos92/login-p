import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);

if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET, "utf8") < 32) {
  throw new Error("Configure JWT_SECRET com pelo menos 32 bytes no arquivo .env.");
}

app.listen(port, "127.0.0.1", () => {
  console.log(`API didática disponível em http://127.0.0.1:${port}`);
});
