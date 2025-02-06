"use client";
import React from "react";
import { useLocale } from "next-intl";
import { useDraggable } from "@dnd-kit/core";
import { MoveRight } from "lucide-react";
import { DateTime } from "luxon";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/date";
import { EditConsultationModal } from "@/components/features/EditConsultationModal";

import type { IConsultation, IConsultationDraggable } from "@/types";

interface IProps {
  data: IConsultation;
  columnId: IConsultationDraggable["columnId"];
}

export const DraggableItem: React.FC<IProps> = ({ data, columnId }) => {
  const locale = useLocale();

  const { attributes, listeners, isDragging, setNodeRef } = useDraggable({
    id: data?.id + columnId,
    data: {
      ...data,
      columnId,
    },
  });

  return (
    <EditConsultationModal data={data}>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "relative bg-white shadow p-2 rounded-md mb-2 cursor-pointer z-10",
          "hover:ring-2 ring-primary ring-inset",
          isDragging && "shadow-xl cursor-grabbing z-50 opacity-40",
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
    </EditConsultationModal>
  );
};
