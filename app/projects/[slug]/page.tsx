"use client";

import { IPRoject } from "@/app/projects";
import { useTheme } from "@/app/useTheme";
import { Editor } from "@monaco-editor/react";
import { marked } from "marked";
import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Field,
  Input,
  Switch,
  Toast,
  Toaster,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import "github-markdown-css";
import { useRouter } from "next/navigation";

function newProject(): IPRoject {
  return {
    contentPath: "",
    created: new Date(),
    imageUrl: "",
    name: "New project",
    slug: "new",
    published: false,
  };
}

export default function EditProject({ params }: { params: { slug: string } }) {
  const [projectData, setProjectData] = useState<IPRoject | null>(null);
  const { dispatchToast } = useToastController("toaster");
  const slug = params.slug;
  useEffect(() => {
    let subbed = true;
    if (slug !== "new") {
      fetch(`/api/projects/${slug}`)
        .then((r) => r.json())
        .then((p) => subbed && setProjectData(p));
    } else {
      setProjectData(newProject());
    }
    return () => {
      subbed = false;
    };
  }, [slug]);
  const [isDark] = useTheme();
  const [renderedContent, setRenderedContent] = useState("");
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!!projectData?.content) {
        setRenderedContent(marked(projectData.content, { async: false }));
      }
    }, 10);
    return () => {
      clearTimeout(debounce);
    };
  }, [projectData?.content]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSave = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects`, {
        body: JSON.stringify(projectData),
        method: "POST",
      });
      const text = await res.text();
      if (res.ok) {
        dispatchToast(
          <Toast>
            <ToastTitle>Project saved</ToastTitle>
          </Toast>,
          { intent: "success" }
        );
        router.push(`/projects/${projectData?.slug}`);
      } else {
        dispatchToast(
          <Toast>
            <ToastTitle>Error: {text}</ToastTitle>
          </Toast>,
          { intent: "error" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatchToast, isLoading, projectData, router]);
  const onDelete = useCallback(async () => {
    if (isLoading) return;
  }, [isLoading]);
  return (
    <div className="flex">
      {projectData ? (
        <div className="p-4 flex flex-col gap-4 min-w-64">
          <Field label="Slug">
            <Input
              onChange={(e, d) =>
                setProjectData((c) => (c ? { ...c, slug: `${d.value}` } : c))
              }
              value={projectData.slug}
            />
          </Field>
          <Field label="Title">
            <Input
              onChange={(e, d) =>
                setProjectData((c) => (c ? { ...c, name: `${d.value}` } : c))
              }
              value={projectData.name}
            />
          </Field>
          <Field label="Image">
            <Input value={projectData.imageUrl} />
          </Field>
          <Switch
            onChange={(e, d) =>
              setProjectData((c) => (c ? { ...c, published: d.checked } : c))
            }
            label="Published"
            checked={projectData.published}
          ></Switch>
          <div className="flex gap-4">
            <Button onClick={onSave} appearance="primary">
              Save
            </Button>
            <Button onClick={onDelete} disabled={slug === "new"}>
              Delete
            </Button>
          </div>
        </div>
      ) : null}
      <div className="flex-1">
        <Editor
          value={projectData?.content}
          language="markdown"
          options={{
            wordWrap: "bounded",
          }}
          onChange={(nv) => {
            setProjectData((c) => (c ? { ...c, content: `${nv}` } : c));
          }}
          theme={isDark ? "vs-dark" : "light"}
        ></Editor>
      </div>
      <div
        className="flex-1 markdown-body"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      ></div>
      <Toaster id="toaster" />
    </div>
  );
}
