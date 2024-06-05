import { app } from "./app.ts";

const DEFAULT_PORT = "7000";

const PORT = parseInt(process.env.PORT || DEFAULT_PORT, 10);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
