import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Plus,
  Search,
  Trash2,
  Pencil,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getMemoryItems,
  addMemoryItem,
  updateMemoryItem,
  deleteMemoryItem,
  clearAllMemories,
  type MemoryCategory,
  type MemoryItem,
} from "@/utils/memoryManager";

const categoryNames: Record<MemoryCategory, string> = {
  about_me: "About Me",
  preferences: "My Preferences",
  work_study: "Work & Study",
  other: "Other",
};

const categoryColors: Record<MemoryCategory, string> = {
  about_me: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  preferences: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  work_study: "text-green-400 bg-green-500/10 border-green-500/20",
  other: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const MemoryManager = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  const [search, setSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] =
    useState<MemoryCategory>("about_me");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] =
    useState<MemoryCategory>("other");

  const loadMemories = () => {
    setMemories(getMemoryItems());
  };

  useEffect(() => {
    loadMemories();

    const handleStorage = () => {
      loadMemories();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const filteredMemories = useMemo(() => {
    if (!search.trim()) {
      return memories;
    }

    const query = search.toLowerCase();

    return memories.filter(
      (memory) =>
        memory.title.toLowerCase().includes(query) ||
        memory.value.toLowerCase().includes(query) ||
        categoryNames[memory.category]
          .toLowerCase()
          .includes(query)
    );
  }, [memories, search]);

  const handleAdd = () => {
    if (!title.trim() || !value.trim()) {
      return;
    }

    addMemoryItem(title, value, category);

    setTitle("");
    setValue("");
    setCategory("about_me");
    setShowAdd(false);

    loadMemories();
  };

  const startEdit = (memory: MemoryItem) => {
    setEditingId(memory.id);
    setEditTitle(memory.title);
    setEditValue(memory.value);
    setEditCategory(memory.category);
  };

  const saveEdit = () => {
    if (!editingId || !editTitle.trim() || !editValue.trim()) {
      return;
    }

    updateMemoryItem(editingId, {
      title: editTitle,
      value: editValue,
      category: editCategory,
    });

    setEditingId(null);
    loadMemories();
  };

  const handleDelete = (id: string) => {
    deleteMemoryItem(id);
    loadMemories();
  };

  const handleClearAll = () => {
    if (memories.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all saved memories?"
    );

    if (!confirmed) {
      return;
    }

    clearAllMemories();
    loadMemories();
  };

  return (
    <Card className="bg-secondary/20 border-primary/20 backdrop-blur-md">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>

            <div>
              <CardTitle className="text-primary text-lg">
                My Memory
              </CardTitle>

              <p className="text-xs text-muted-foreground mt-1">
                Things you want ALSA AI to remember about you
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAdd((value) => !value)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your memories..."
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showAdd && (
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />

              <p className="text-sm font-medium">
                Add something for ALSA AI to remember
              </p>
            </div>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Name, Favorite language, Study..."
            />

            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="What should ALSA AI remember?"
              rows={3}
            />

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as MemoryCategory)
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="about_me">About Me</option>
              <option value="preferences">My Preferences</option>
              <option value="work_study">Work & Study</option>
              <option value="other">Other</option>
            </select>

            <div className="flex gap-2">
              <Button onClick={handleAdd}>
                <Check className="w-4 h-4 mr-2" />
                Save Memory
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />

              <p className="text-sm font-medium">
                {search
                  ? "No memories found"
                  : "You haven't saved anything yet"}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Try a different search."
                  : "Add something useful so ALSA AI can remember it for you."}
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                {editingId === memory.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(event.target.value)
                      }
                    />

                    <Textarea
                      value={editValue}
                      onChange={(event) =>
                        setEditValue(event.target.value)
                      }
                      rows={3}
                    />

                    <select
                      value={editCategory}
                      onChange={(event) =>
                        setEditCategory(
                          event.target.value as MemoryCategory
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="about_me">About Me</option>
                      <option value="preferences">
                        My Preferences
                      </option>
                      <option value="work_study">
                        Work & Study
                      </option>
                      <option value="other">Other</option>
                    </select>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-medium text-sm">
                          {memory.title}
                        </h3>

                        <span
                          className={`text-[10px] px-2 py-1 rounded-full border ${
                            categoryColors[memory.category]
                          }`}
                        >
                          {categoryNames[memory.category]}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground break-words">
                        {memory.value}
                      </p>
                    </div>

                    <div className="flex items-start gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(memory)}
                        title="Edit memory"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(memory.id)}
                        title="Delete memory"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {memories.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              {memories.length}{" "}
              {memories.length === 1 ? "memory" : "memories"} saved
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryManager;