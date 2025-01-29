"use client";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Modal } from "antd";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authService } from "@/services/auth.service";
import LocaleSwitcher from "@/components/locale-switcher";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useCallback } from "react";

const { confirm } = Modal;

export function NavUser() {
  const { isMobile } = useSidebar();
  const t = useTranslations();

  const { data: profile } = useQuery({
    queryFn: async () => await profileService.get(),
    queryKey: ["profile"],
  });

  const logoutConfirm = useCallback(() => {
    confirm({
      title: t("logout_confirmation"),
      content: t("logout_warning"),
      okText: t("confirm_logout"),
      cancelText: t("cancel"),
      onOk: authService.logout,
      type: "warning",
      okType: "danger",
    });
  }, [t]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profile?.logo?.url} alt={profile?.name} />
                <AvatarFallback className="rounded-lg">
                  {profile?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{profile?.name}</span>
                <span className="truncate text-xs">{profile?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <LocaleSwitcher />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutConfirm}>
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
