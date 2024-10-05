"use client";

import { Button } from "@fluentui/react-components";

export default function NewProject() {
  return (
    <>
      <Button as="a" href="/projects/new">
        New project
      </Button>
      <Button
        href="https://console.firebase.google.com/u/0/project/als-site-test/storage/als-site-test.appspot.com"
        target="_blank"
        as="a"
      >
        Upload image
      </Button>
    </>
  );
}
