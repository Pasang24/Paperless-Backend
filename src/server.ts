import { env } from "./config/env";
import app from "./app";

const { PORT } = env;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
