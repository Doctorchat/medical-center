"use client";
import React from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DroppableColumn } from "./DroppableColumn";

import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import type { IKanban } from "@/types";

interface IProps {
  initialData?: IKanban;
}

const columnOrder: (keyof IKanban)[] = [
  "booked",
  "today",
  "confirmed",
  "last10completed",
];
const droppableColumns = ["confirmed", "last10completed"];

export const DndColumns: React.FC<IProps> = ({ initialData }) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log(active);
    console.log(over);

    if (!over) return;

    const fromColumn = active?.data?.current?.columnId;
    const toColumn = over?.id;

    if (
      fromColumn === toColumn ||
      !droppableColumns?.includes(String(toColumn))
    )
      return;

    // setColumns((prevColumns) => {
    //   const fromItems = [...prevColumns[fromColumn]];
    //   const toItems = [...prevColumns[toColumn]];
    //
    //   const draggedItem = fromItems.splice(fromItems.indexOf(active.id), 1)[0];
    //   toItems.push(draggedItem);
    //
    //   return {
    //     ...prevColumns,
    //     [fromColumn]: fromItems,
    //     [toColumn]: toItems,
    //   };
    // });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <ScrollArea className="max-h-screen w-full">
        <div className="flex gap-4 py-4">
          {initialData &&
            columnOrder.map((columnId) => {
              const items = initialData[columnId];
              return (
                <DroppableColumn
                  key={columnId}
                  id={columnId}
                  items={items}
                  isDroppable={droppableColumns?.includes(columnId)}
                />
              );
            })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DndContext>
  );
};
