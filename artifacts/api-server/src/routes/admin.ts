import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, propertiesTable, contactsTable } from "@workspace/db";
import {
  AdminCreatePropertyBody,
  AdminUpdatePropertyParams,
  AdminUpdatePropertyBody,
  AdminGetPropertyParams,
  AdminDeletePropertyParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/properties", async (_req, res): Promise<void> => {
  const properties = await db
    .select()
    .from(propertiesTable)
    .orderBy(propertiesTable.createdAt);
  res.json(properties);
});

router.post("/admin/properties", async (req, res): Promise<void> => {
  const parsed = AdminCreatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [property] = await db.insert(propertiesTable).values(parsed.data).returning();
  res.status(201).json(property);
});

router.get("/admin/properties/:id", async (req, res): Promise<void> => {
  const params = AdminGetPropertyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, params.data.id));

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.json(property);
});

router.patch("/admin/properties/:id", async (req, res): Promise<void> => {
  const params = AdminUpdatePropertyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = AdminUpdatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [property] = await db
    .update(propertiesTable)
    .set(parsed.data)
    .where(eq(propertiesTable.id, params.data.id))
    .returning();

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.json(property);
});

router.delete("/admin/properties/:id", async (req, res): Promise<void> => {
  const params = AdminDeletePropertyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [property] = await db
    .delete(propertiesTable)
    .where(eq(propertiesTable.id, params.data.id))
    .returning();

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/admin/contacts", async (_req, res): Promise<void> => {
  const contacts = await db
    .select()
    .from(contactsTable)
    .orderBy(contactsTable.createdAt);
  res.json(contacts);
});

export default router;
