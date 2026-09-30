"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useDemoMode } from "./DemoModeProvider";

type DemoLinkProps = ComponentProps<typeof Link>;

export default function DemoLink({ href, ...props }: Readonly<DemoLinkProps>) {
  const isDemoMode = useDemoMode();

  const demoHref =
    isDemoMode && typeof href === "string" && href.startsWith("/")
      ? `/demo${href}`
      : href;

  return <Link href={demoHref} {...props} />;
}
