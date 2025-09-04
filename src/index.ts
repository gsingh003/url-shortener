import app from "./app";
import sql from "./internal/db/db";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await sql.sync();
    console.log(`server listening on port ${PORT}...`);
});
