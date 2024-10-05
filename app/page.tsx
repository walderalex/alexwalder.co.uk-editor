import { headers } from "next/headers";
import { getProjects } from "./projects";

let format: Intl.DateTimeFormat;

function ProjectTile({
  project,
}: {
  project: Awaited<ReturnType<typeof getProjects>>[number];
}) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="no-underline h-full flex flex-col tile border border-solid border-black dark:border-white"
    >
      <div
        className="aspect-video w-full border-b border-black dark:border-white"
        style={{
          backgroundImage: `url("${project.imageUrl}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="p-2 flex flex-col justify-between flex-1 gap-2">
        <h2 className="text-lg text-ellipsis overflow-hidden">
          {project.name}
        </h2>
        <span className="text-sm">
          {format.format(new Date(project.created))}
        </span>
      </div>
    </a>
  );
}

export default async function Home() {
  const projects = await getProjects();
  const headersList = headers();
  format = Intl.DateTimeFormat(
    `${headersList.get("Accept-Language")}`.split(";")[0].split(",")[0] ??
      undefined,
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  );
  return (
    <div
      className="grid gap-6 p-6 w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))]"
      style={{
        gridAutoRows: "max-content",
      }}
    >
      {projects.map((p) => (
        <ProjectTile project={p} key={p.id} />
      ))}
    </div>
  );
}
