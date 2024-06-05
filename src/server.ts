import { app } from "./app.ts";

if (!process.env.PORT) {
  console.log("No port value specified!");
}

const PORT = parseInt(process.env.PORT as string, 10);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
