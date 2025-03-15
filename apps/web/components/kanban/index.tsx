"use client";

import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Generic interfaces
interface KanbanItem {
  id: string;
  [key: string]: any; // Allow for any additional properties
}

interface BoardColumn {
  id: number;
  type: string;
  title: string;
  board_id: number;
  position: number;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  itemIds?: string[]; // For Kanban functionality
}


interface DeleteColumnDialog {
  isOpen: boolean;
  columnToDelete: string | null;
}

interface KanbanProps<T extends KanbanItem> {
  data: T[];
  columns: Record<string, BoardColumn>;
  renderItem: (item: T) => React.ReactNode;
  onColumnUpdate: (columns: Record<string, BoardColumn>) => void;
  onItemClick?: (item: T) => void;
}

interface EditableTitleProps {
  title: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (newTitle: string) => void;
  itemCount: number;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  isEditing,
  onStartEdit,
  onSave,
  itemCount,
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave(editedTitle);
    }
  };

  return isEditing ? (
    <Input
      ref={inputRef}
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      onBlur={() => onSave(editedTitle)}
      onKeyDown={handleKeyDown}
      className="h-7 px-2 py-1"
    />
  ) : (
    <h3
      className="flex items-center gap-2 font-medium cursor-pointer"
      onDoubleClick={onStartEdit}
    >
      {title}{" "}
      <span className="text-muted-foreground text-sm">({itemCount})</span>
    </h3>
  );
};

function Kanban<T extends KanbanItem>({
  data,
  columns,
  renderItem,
  onColumnUpdate,
  onItemClick,
}: KanbanProps<T>) {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [deleteColumnDialog, setDeleteColumnDialog] =
    useState<DeleteColumnDialog>({
      isOpen: false,
      columnToDelete: null,
    });

  const handleTitleSave = (columnId: string, newTitle: string) => {
    const updatedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        title: newTitle,
        updated_at: new Date().toISOString(),
      },
    };
    onColumnUpdate(updatedColumns);
    setEditingColumnId(null);
  };

  const addNewColumn = () => {
    const newColumnId = `column${Object.keys(columns).length + 1}`;
    // @ts-ignore
    const newColumn: BoardColumn = {
      id: Object.keys(columns).length + 1,
      type: newColumnId,
      title: `New Column ${Object.keys(columns).length + 1}`,
      position: Object.keys(columns).length,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      itemIds: [],
    };

    onColumnUpdate({
      ...columns,
      [newColumnId]: newColumn,
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    if (Object.keys(columns).length <= 1) return;
    setDeleteColumnDialog({
      isOpen: true,
      columnToDelete: columnId,
    });
  };

  const confirmDeleteColumn = () => {
    const { columnToDelete } = deleteColumnDialog;
    if (columnToDelete) {
      const newColumns = { ...columns };
      const firstColumnId = Object.keys(newColumns)[0];
      newColumns[firstColumnId].itemIds = [
        // @ts-ignore
        ...newColumns[firstColumnId].itemIds,
        // @ts-ignore
        ...newColumns[columnToDelete].itemIds,
      ];
      delete newColumns[columnToDelete];
      onColumnUpdate(newColumns);
    }
    setDeleteColumnDialog({ isOpen: false, columnToDelete: null });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Object.entries(columns);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);

      const newColumns = newColumnOrder.reduce<Record<string, BoardColumn>>(
        (acc, [id, column], index) => {
          acc[id] = { ...column, position: index };
          return acc;
        },
        {}
      );

      onColumnUpdate(newColumns);
      return;
    }

    // Handle item drag
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    // @ts-ignore
    const sourceItems = [...sourceColumn.itemIds];
    // @ts-ignore
    const destItems = [...destColumn.itemIds];

    const [movedItemId] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItemId);
      onColumnUpdate({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          itemIds: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItemId);
      onColumnUpdate({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          itemIds: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          itemIds: destItems,
        },
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div
                className="flex gap-4 overflow-x-auto pb-4 max-w-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Object.entries(columns)
                  .sort(([, a], [, b]) => a.position - b.position)
                  .map(([columnId, column], index) => (
                    <Draggable
                      key={columnId}
                      draggableId={`column-${columnId}`}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="w-80 shrink-0 bg-gray-100 dark:bg-[#18181c] border-none"
                        >
                          <CardContent className="p-4">
                            <div
                              className="flex justify-between items-center h-8 mb-4"
                              {...provided.dragHandleProps}
                            >
                              <EditableTitle
                                title={column.title}
                                isEditing={editingColumnId === columnId}
                                onStartEdit={() => setEditingColumnId(columnId)}
                                onSave={(newTitle) =>
                                  handleTitleSave(columnId, newTitle)
                                }
                                itemCount={column.itemIds?.length || 0}
                              />
                              {Object.keys(columns).length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteColumn(columnId)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <Droppable droppableId={columnId} type="card">
                              {(dropProvided) => (
                                <ScrollArea
                                  className="h-[calc(100vh-200px)]"
                                  ref={dropProvided.innerRef}
                                  {...dropProvided.droppableProps}
                                >
                                  {/* @ts-ignore */}
                                  {column.itemIds.map((itemId, index) => {
                                    const item = data.find(
                                      (i) => String(i.id) === String(itemId)
                                    );
                                    if (!item) return null;
                                    return (
                                      <Draggable
                                        key={itemId}
                                        draggableId={String(itemId)}
                                        index={index}
                                      >
                                        {(cardProvided, cardSnapshot) => (
                                          <div
                                            ref={cardProvided.innerRef}
                                            {...cardProvided.draggableProps}
                                            {...cardProvided.dragHandleProps}
                                            style={{
                                              ...cardProvided.draggableProps
                                                .style,
                                              opacity: cardSnapshot.isDragging
                                                ? 0.5
                                                : 1,
                                            }}
                                            onClick={() => {
                                              if (
                                                !cardSnapshot.isDragging &&
                                                onItemClick
                                              ) {
                                                onItemClick(item);
                                              }
                                            }}
                                          >
                                            {renderItem(item)}
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {dropProvided.placeholder}
                                </ScrollArea>
                              )}
                            </Droppable>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}

                {/* Add Column pseudo-column - Now outside of Draggable */}
                <div className="w-80 shrink-0">
                  <Card
                    className="bg-gray-100/50 dark:bg-[#18181c]/50 border-dashed cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                    onClick={addNewColumn}
                  >
                    <CardContent className="p-4 flex items-center justify-center h-[80px]">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Column
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Dialog
          open={deleteColumnDialog.isOpen}
          onOpenChange={(open) =>
            setDeleteColumnDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Column</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this column? All cards will be
                moved to the first column.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteColumnDialog({ isOpen: false, columnToDelete: null })
                }
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteColumn}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Kanban;
