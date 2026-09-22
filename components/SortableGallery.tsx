"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

type GalleryItem = {
  id: string;
  url: string;
  isNew: boolean;
};

function SortableItem({
  item,
  onRemove,
}: {
  item: GalleryItem;
  onRemove?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-md border ${
        item.isNew ? "ring-2 ring-primary/40" : ""
      } ${isDragging ? "shadow-lg scale-105" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt="Galeri fotoğrafı"
        className="h-full w-full object-cover"
        draggable={false}
      />
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </button>
      {/* Delete button — only for existing images */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      )}
      {/* Order indicator */}
      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        {/* Will be overridden by the index from parent, but we show nothing by default */}
      </span>
    </div>
  );
}

export default function SortableGallery({
  existingUrls,
  newPreviewUrls,
  onReorderExisting,
  onRemoveExisting,
}: {
  existingUrls: string[];
  newPreviewUrls: string[];
  onReorderExisting: (reordered: string[]) => void;
  onRemoveExisting: (url: string) => void;
}) {
  // Merge existing + new into a single visual list.
  // Only existing items are reorderable; new items always appear at the end.
  const [items] = useState(() => {
    // We need to rebuild on every render based on props — useState is wrong here.
    // We'll compute inline instead.
    return [];
  });
  void items; // unused — we compute inline below

  const existingItems: GalleryItem[] = existingUrls.map((url) => ({
    id: `existing-${url}`,
    url,
    isNew: false,
  }));

  const newItems: GalleryItem[] = newPreviewUrls.map((url, i) => ({
    id: `new-${i}-${url}`,
    url,
    isNew: true,
  }));

  const allItems = [...existingItems, ...newItems];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdx = existingItems.findIndex((item) => item.id === active.id);
    const overIdx = existingItems.findIndex((item) => item.id === over.id);

    // Only reorder among existing items
    if (activeIdx === -1 || overIdx === -1) return;

    const reordered = arrayMove(existingUrls, activeIdx, overIdx);
    onReorderExisting(reordered);
  }

  if (allItems.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allItems.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {allItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onRemove={
                !item.isNew
                  ? () => onRemoveExisting(item.url)
                  : undefined
              }
            />
          ))}
        </div>
      </SortableContext>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Sıralamayı değiştirmek için fotoğrafları sürükleyip bırakın
      </p>
    </DndContext>
  );
}
