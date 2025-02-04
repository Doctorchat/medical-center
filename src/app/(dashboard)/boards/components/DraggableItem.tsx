"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { IConsultation } from "@/types";
import { Drawer } from "antd";
import { useToggle } from "react-use";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { formatDateTime } from "@/utils/date";
import { StatusConsultationButton } from "@/components/features/StatusConsultationButton";
import { MoveRight } from "lucide-react";

interface IProps {
  data: IConsultation;
  columnId: string;
}

export const DraggableItem: React.FC<IProps> = ({ data, columnId }) => {
  const t = useTranslations();
  const locale = useLocale();
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
          "relative bg-white shadow p-2 rounded-md mb-2 cursor-pointer z-10",
          "hover:ring-2 ring-primary",
          isDragging && "shadow-xl cursor-grabbing z-50",
        )}
      >
        <div className="font-medium">{data?.user?.name}</div>
        <div className="text-gray-400 text-sm">{data?.doctor?.name}</div>
        <div className="flex items-center gap-2 font-medium text-sm">
          <div className="text-primary">
            {formatDateTime(data?.start_time, locale)}
          </div>
          <MoveRight className="size-6 text-gray-200" />
          <div className="text-gray-400">
            {DateTime.fromFormat(
              data?.end_time,
              "yyyy-MM-dd HH:mm:ss",
            ).toFormat("HH:mm")}
          </div>
        </div>
      </div>

      <Drawer
        width={320}
        placement="right"
        onClose={setOpenDrawer}
        open={openDrawer}
        extra={
          <StatusConsultationButton
            statusId={data?.status}
            consultationId={data?.id}
          />
        }
      >
        <div className="divide-y divide-gray-200">
          <div className="text-lg font-medium pb-3">{data?.user?.name}</div>
          <DrawerItem label={t("email")} value={data?.user?.email} />
          <DrawerItem label={t("phone")} value={data?.user?.phone} />

          <DrawerItem label={t("doctor")} value={data?.doctor?.name} />
          <DrawerItem
            label={t("start_time")}
            value={formatDateTime(data?.start_time, locale)}
          />
          <DrawerItem
            label={t("end_time")}
            value={DateTime.fromFormat(
              data?.end_time,
              "yyyy-MM-dd HH:mm:ss",
            ).toFormat("HH:mm")}
          />
        </div>
      </Drawer>
    </>
  );
};

const DrawerItem = ({ label, value }: { label: string; value: string }) => {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-6 py-3">
      <div className="text-gray-400">{t(`${label}`)}:</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};
