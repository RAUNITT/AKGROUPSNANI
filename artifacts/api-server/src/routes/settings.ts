import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  let [settings] = await db.select().from(siteSettingsTable);
  
  if (!settings) {
    [settings] = await db.insert(siteSettingsTable).values({
      officeAddress: "Level 42, The Summit Tower, Chennai, Tamil Nadu 600001",
      phone: "+91 98765 43210",
      email: "luxury@akgroup.com",
      whatsappNumber: "+91 98765 43210"
    }).returning();
  }
  
  res.json(settings);
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let [settings] = await db.select().from(siteSettingsTable);
  
  if (!settings) {
    [settings] = await db.insert(siteSettingsTable).values({
      officeAddress: "Level 42, The Summit Tower, Chennai, Tamil Nadu 600001",
      phone: "+91 98765 43210",
      email: "luxury@akgroup.com",
      whatsappNumber: "+91 98765 43210",
      ...parsed.data
    }).returning();
  } else {
    [settings] = await db
      .update(siteSettingsTable)
      .set(parsed.data)
      .where(eq(siteSettingsTable.id, settings.id))
      .returning();
  }

  res.json(settings);
});

export default router;
