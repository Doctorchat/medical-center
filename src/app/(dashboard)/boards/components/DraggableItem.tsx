"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { IConsultation } from "@/types";
import { Drawer } from "antd";
import { useToggle } from "react-use";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface IProps {
  data: IConsultation;
  columnId: string;
}

export const DraggableItem: React.FC<IProps> = ({ data, columnId }) => {
  const t = useTranslations();
  const [openDrawer, setOpenDrawer] = useToggle(false);

  const { attributes, listeners, isDragging, setNodeRef, transform } =
    useDraggable({
      id: data?.id + columnId,
      data: {
        ...data,
        columnId,
      },
    });

  const style = {
    transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px) ${isDragging ? "rotate(-2deg)" : ""}`,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          e.stopPropagation();
          setOpenDrawer();
        }}
        style={style}
        className={cn(
          "bg-white shadow p-2 rounded-md mb-2 cursor-pointer",
          "hover:ring-2 ring-primary",
          isDragging && "shadow-xl cursor-grabbing",
        )}
      >
        <div>{data?.user?.name}</div>
        <div>{data?.doctor?.name}</div>
        <div>
          {DateTime.fromFormat(
            data?.start_time,
            "yyyy-MM-dd HH:mm:ss",
          ).toFormat("d LLLL yyyy, HH:mm", {
            locale: "ro",
          })}
        </div>
      </div>

      <Drawer
        width={320}
        placement="right"
        onClose={setOpenDrawer}
        open={openDrawer}
        title={data?.user?.name}
      >
        <div className="space-y-5">
          <DrawerItem label={t("name")} value={data?.user?.name} />
          <DrawerItem label={t("doctor")} value={data?.doctor?.name} />
          <DrawerItem label={t("name")} value={data?.user?.name} />
          <DrawerItem
            label={t("start_time")}
            value={DateTime.fromFormat(
              data?.start_time,
              "yyyy-MM-dd HH:mm:ss",
            ).toFormat("d LLLL yyyy, HH:mm", {
              locale: "ro",
            })}
          />
        </div>
      </Drawer>
    </>
  );
};

const DrawerItem = ({ label, value }: { label: string; value: string }) => {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-gray-400">{t(`${label}`)}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};
