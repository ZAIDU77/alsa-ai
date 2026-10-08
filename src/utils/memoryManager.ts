// ALSA AI - User Memory System

export type MemoryCategory =
  | "about_me"
  | "preferences"
  | "work_study"
  | "other";

export interface Memory {
  [key: string]: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  value: string;
  category: MemoryCategory;
  createdAt: string;
  updatedAt: string;
}

const MEMORY_KEY = "alsa_memory";

const safeRead = (): MemoryItem[] => {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    // New memory format
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // Convert old ALSA memory format to new format
    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed).map(([key, value]) => ({
        id: crypto.randomUUID(),
        title: key.replace(/_/g, " "),
        value: String(value),
        category: "other" as MemoryCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }

    return [];
  } catch (error) {
    console.error("Error reading memory:", error);
    return [];
  }
};

const save = (memories: MemoryItem[]) => {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memories));
};

export const getMemoryItems = (): MemoryItem[] => {
  return safeRead();
};

export const addMemoryItem = (
  title: string,
  value: string,
  category: MemoryCategory = "other"
): MemoryItem | null => {
  if (!title.trim() || !value.trim()) {
    return null;
  }

  const memories = safeRead();

  const now = new Date().toISOString();

  const newMemory: MemoryItem = {
    id: crypto.randomUUID(),
    title: title.trim(),
    value: value.trim(),
    category,
    createdAt: now,
    updatedAt: now,
  };

  memories.unshift(newMemory);
  save(memories);

  return newMemory;
};

export const updateMemoryItem = (
  id: string,
  updates: Partial<Pick<MemoryItem, "title" | "value" | "category">>
): void => {
  const memories = safeRead();

  const updated = memories.map((memory) =>
    memory.id === id
      ? {
          ...memory,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : memory
  );

  save(updated);
};

export const deleteMemoryItem = (id: string): void => {
  const memories = safeRead();
  save(memories.filter((memory) => memory.id !== id));
};

export const clearAllMemories = (): void => {
  localStorage.removeItem(MEMORY_KEY);
};

export const searchMemories = (query: string): MemoryItem[] => {
  const memories = safeRead();

  if (!query.trim()) {
    return memories;
  }

  const search = query.toLowerCase().trim();

  return memories.filter(
    (memory) =>
      memory.title.toLowerCase().includes(search) ||
      memory.value.toLowerCase().includes(search) ||
      memory.category.toLowerCase().includes(search)
  );
};

/*
 * Compatibility functions
 * These keep existing ALSA AI code working.
 */

export const getMemory = (): Memory => {
  const memories = safeRead();

  const result: Memory = {};

  memories.forEach((memory) => {
    result[memory.title.toLowerCase().replace(/\s+/g, "_")] = memory.value;
  });

  return result;
};

export const addMemory = (key: string, value: string): void => {
  addMemoryItem(key, value, "other");
};

export const updateMemory = (updates: Memory): void => {
  Object.entries(updates).forEach(([key, value]) => {
    const memories = safeRead();

    const existing = memories.find(
      (memory) =>
        memory.title.toLowerCase().replace(/\s+/g, "_") === key.toLowerCase()
    );

    if (existing) {
      updateMemoryItem(existing.id, {
        value: String(value),
      });
    } else {
      addMemoryItem(
        key.replace(/_/g, " "),
        String(value),
        "other"
      );
    }
  });
};

export const deleteMemory = (key: string): void => {
  const memories = safeRead();

  const found = memories.find(
    (memory) =>
      memory.title.toLowerCase().replace(/\s+/g, "_") === key.toLowerCase()
  );

  if (found) {
    deleteMemoryItem(found.id);
  }
};

/*
 * Detect simple memory commands from chat.
 *
 * Examples:
 * "remember my name is Zaid"
 * "remember that I prefer Hindi"
 * "remember I am a BCA student"
 */
export const parseMemoryCommand = (
  text: string
): {
  title: string;
  value: string;
  category: MemoryCategory;
} | null => {
  const cleanText = text.trim();

  const patterns = [
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*my name is (.+)/i,
      title: "Name",
      category: "about_me" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i am (.+)/i,
      title: "About me",
      category: "about_me" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i prefer (.+)/i,
      title: "Preference",
      category: "preferences" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i like (.+)/i,
      title: "Likes",
      category: "preferences" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i don't like (.+)/i,
      title: "Dislikes",
      category: "preferences" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i study (.+)/i,
      title: "Studies",
      category: "work_study" as MemoryCategory,
    },
    {
      regex: /(?:remember|remember that|save this)[,:]?\s*i work (?:as|at) (.+)/i,
      title: "Work",
      category: "work_study" as MemoryCategory,
    },
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern.regex);

    if (match) {
      return {
        title: pattern.title,
        value: match[1].trim(),
        category: pattern.category,
      };
    }
  }

  return null;
};

export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  const memories = getMemoryItems();

  const nameMemory = memories.find(
    (memory) =>
      memory.title.toLowerCase() === "name" ||
      memory.title.toLowerCase() === "user name"
  );

  const userName = nameMemory?.value || "there";

  if (hour >= 5 && hour < 12) {
    return `Good Morning ${userName}`;
  }

  if (hour >= 12 && hour < 17) {
    return `Good Afternoon ${userName}`;
  }

  if (hour >= 17 && hour < 21) {
    return `Good Evening ${userName}`;
  }

  return `Good Night ${userName}`;
};