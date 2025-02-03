"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { DraggableItem } from "@/app/(dashboard)/boards/components/DraggableItem";
import { IConsultation } from "@/types";
import { cn } from "@/lib/utils";

interface IProps {
  id: string;
  items: IConsultation[];
  isDroppable: boolean;
}

export const DroppableColumn: React.FC<IProps> = ({
  id,
  isDroppable,
  items,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 border-2 rounded bg-gray-200 w-full",
        isOver && isDroppable && "ring",
        isDroppable && "bg-green-100",
      )}
    >
      <h3 className="text-xl mb-2">{id}</h3>
      {items.map((item) => (
        <DraggableItem key={item?.id} id={item?.id} columnId={id} />
      ))}
    </div>
  );
};
