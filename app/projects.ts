import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

export interface IPRoject {
  created: Date;
  imageUrl: string;
  name: string;
  content?: string;
  contentPath?: string;
  slug: string;
  published: boolean;
}

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

export async function getProjectContent({ path }: { path: string }) {
  const file = await storage.bucket(process.env.BUCKET).file(path).download();
  return file.toString();
}
export async function getProjectImage({ path }: { path: string }) {
  const file = storage.bucket(process.env.BUCKET).file(path);
  return await getDownloadURL(file);
}

export async function getProject({
  slug,
}: {
  slug: string;
}): Promise<IPRoject> {
  const ref = await db.doc(`projects/${slug}`).get();
  const project = { ...ref.data() };
  if (project.contentPath) {
    project.content = await getProjectContent({ path: project.contentPath });
  }
  project.created = (project.created as Timestamp).toDate();
  if (project.imageUrl) {
    project.previewImageUrl = await getProjectImage({ path: project.imageUrl });
  }
  return project as IPRoject;
}

export async function getProjects(): Promise<(IPRoject & { id: number })[]> {
  const projects: Awaited<ReturnType<typeof getProjects>> = [];
  const projectsCollection = await db.collection("projects").get();
  for (const doc of projectsCollection.docs) {
    const data = doc.data();
    projects.push({
      content: data.contentPath,
      id: projects.length + 1,
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl
        ? await getProjectImage({ path: data.imageUrl })
        : data.imageUrl,
      created: (data.created as Timestamp).toDate(),
      published: !!data.published,
    });
  }
  return projects;
}
