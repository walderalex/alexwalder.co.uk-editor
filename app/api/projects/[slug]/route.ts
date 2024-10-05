import { getProject } from "@/app/projects";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const project = await getProject({ slug });
  return NextResponse.json(project);
}

import { IPRoject } from "@/app/projects";
import { initializeApp } from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const project = (await req.json()) as Partial<IPRoject>;
  const { slug } = params;
  if ("content" in project) {
    delete project.content;
  }
  if (!project.slug) throw new Error("Slug is required");
  if (`${project.slug}`.toLowerCase() === "new")
    throw new Error("Slug is required");
  const isNew = slug === "new";
  if (!isNew) {
    if ("created" in project) {
      delete project.created;
    }
    const isMoved = slug === `${project.slug}`;
    if (isMoved) {
      await db.doc(`projects/${slug}`).delete();
    }
    await db.doc(`projects/${project.slug}`).update(project);
  } else {
    await db
      .doc(`projects/${project.slug}`)
      .create({ ...project, created: Timestamp.now() });
  }
  const res = new Response(null, { status: 204 });
  return res;
}
