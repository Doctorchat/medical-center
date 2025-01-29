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

const data = {
  navMain: [
    {
      title: "Tabloul de Bords",
      url: "/123",
      icon: GalleryVerticalEnd,
      isActive: true,
      items: [
        {
          title: "Programări",
          url: "/",
        },
        {
          title: "Profil",
          url: "/profile",
        },
        /*{
          title: 'Pacienți',
          url: '#',
        },
        {
          title: 'Gestionarea Personalului',
          url: '#',
        },
        {
          title: 'Facturare',
          url: '#',
        },
        {
          title: 'Rapoarte',
          url: '#',
        },*/
      ],
    },
    /*{
      title: 'Setări',
      url: '#',
      icon: SettingsIcon,
      isActive: false,
      items: [
        {
          title: 'Setări Profil',
          url: '#',
        },
        {
          title: 'Setări Notificări',
          url: '#',
        },
        {
          title: 'Setări Sistem',
          url: '#',
        },
      ],
    },
    {
      title: 'Ajutor',
      url: '#',
      icon: HelpCircle,
      isActive: false,
      items: [
        {
          title: 'Întrebări Frecvente',
          url: '#',
        },
        {
          title: 'Contactează Suportul',
          url: '#',
        },
        {
          title: 'Ghiduri pentru Utilizatori',
          url: '#',
        },
      ],
    },*/
  ],

  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
