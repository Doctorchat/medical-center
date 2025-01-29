"use client";

import * as React from "react";
import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/images/logo.svg";
import logoWithoutText from "@/assets/images/logo-without-text.svg";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const { open } = useSidebar();

  const data = useMemo(
    () => ({
      navMain: [
        {
          title: t("dashboard"),
          url: "/123",
          icon: GalleryVerticalEnd,
          isActive: true,
          items: [
            {
              title: t("appointments"),
              url: "/",
            },
            {
              title: t("profile"),
              url: "/profile",
            },
          ],
        },
      ],
    }),
    [t],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {open ? (
          <Image
            src={logo.src}
            height={logo.height}
            width={logo.width}
            alt="Centrul medical"
            className="h-9 transition"
          />
        ) : (
          <Image
            src={logoWithoutText.src}
            height={logoWithoutText.height}
            width={logoWithoutText.width}
            alt="Centrul medical"
            className="h-7 transition"
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
