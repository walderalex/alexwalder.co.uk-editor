import { IPRoject } from "@/app/projects";
import { initializeApp } from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export async function POST(req: Request) {
  const project = (await req.json()) as Partial<IPRoject>;
  const { slug } = project;
  if ("content" in project) {
    delete project.content;
  }
  if (slug === "new") throw new Error(`Slug 'new' not allowed`);
  const doc = await db.doc(`projects/${slug}`).get();
  if (doc.exists) {
    if ("created" in project) {
      delete project.created;
    }
    await db.doc(`projects/${slug}`).update(project);
  } else {
    await db
      .doc(`projects/${slug}`)
      .create({ ...project, created: Timestamp.now() });
  }
  const res = new Response(null, { status: 204 });
  return res;
}
