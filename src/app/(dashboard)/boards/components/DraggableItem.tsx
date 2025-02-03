"use client";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { UseDraggableArguments } from "@dnd-kit/core/dist/hooks/useDraggable";

interface IProps {
  id: UseDraggableArguments["id"];
  columnId: string;
}

export const DraggableItem: React.FC<IProps> = ({ id, columnId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { columnId },
  });

  const style = {
    transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px)`,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-blue-500 text-white p-2 rounded mb-2 cursor-pointer w-full min-w-80"
    >
      {id}
    </div>
  );
};
