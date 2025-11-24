import { JournalEntry } from "@/features/journal/JournalEntry";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached entries
const STORAGE_KEY = "journalxp_entry_cache";

/**
 * Entry cache manager with LRU eviction and localStorage persistence
 */
class EntryCache {
  private cache: Map<string, CacheEntry<JournalEntry>>;
  private accessOrder: string[];

  constructor() {
    this.cache = new Map();
    this.accessOrder = [];
    this.loadFromStorage();
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = new Map(Object.entries(parsed.cache));
        this.accessOrder = parsed.accessOrder || [];

        // Clean expired entries
        this.cleanExpired();
      }
    } catch (error) {
      console.error("Failed to load cache from storage:", error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        cache: Object.fromEntries(this.cache),
        accessOrder: this.accessOrder,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save cache to storage:", error);
    }
  }

  /**
   * Get entry from cache
   */
  get(id: string): JournalEntry | null {
    const cacheEntry = this.cache.get(id);

    if (!cacheEntry) {
      return null;
    }

    // Check if expired
    if (Date.now() - cacheEntry.timestamp > CACHE_DURATION) {
      this.cache.delete(id);
      this.accessOrder = this.accessOrder.filter((entryId) => entryId !== id);
      this.saveToStorage();
      return null;
    }

    // Update access stats
    cacheEntry.accessCount++;
    cacheEntry.lastAccessed = Date.now();
    this.cache.set(id, cacheEntry);

    // Update access order (move to end = most recently used)
    this.accessOrder = this.accessOrder.filter((entryId) => entryId !== id);
    this.accessOrder.push(id);

    this.saveToStorage();
    return cacheEntry.data;
  }

  /**
   * Set entry in cache
   */
  set(id: string, entry: JournalEntry): void {
    // Evict least recently used if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE && !this.cache.has(id)) {
      const lruId = this.accessOrder[0];
      if (lruId) {
        this.cache.delete(lruId);
        this.accessOrder.shift();
      }
    }

    const cacheEntry: CacheEntry<JournalEntry> = {
      data: entry,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    this.cache.set(id, cacheEntry);

    // Update access order
    this.accessOrder = this.accessOrder.filter((entryId) => entryId !== id);
    this.accessOrder.push(id);

    this.saveToStorage();
  }

  /**
   * Set multiple entries
   */
  setMany(entries: JournalEntry[]): void {
    entries.forEach((entry) => {
      this.set(entry.id, entry);
    });
  }

  /**
   * Remove entry from cache
   */
  remove(id: string): void {
    this.cache.delete(id);
    this.accessOrder = this.accessOrder.filter((entryId) => entryId !== id);
    this.saveToStorage();
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    this.cache.forEach((cacheEntry, id) => {
      if (now - cacheEntry.timestamp > CACHE_DURATION) {
        expiredIds.push(id);
      }
    });

    expiredIds.forEach((id) => {
      this.cache.delete(id);
      this.accessOrder = this.accessOrder.filter((entryId) => entryId !== id);
    });

    if (expiredIds.length > 0) {
      this.saveToStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
      entries: Array.from(this.cache.entries()).map(([id, entry]) => ({
        id,
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp,
        lastAccessed: entry.lastAccessed,
      })),
    };
  }

  /**
   * Get most accessed entries
   */
  getMostAccessed(limit: number = 10): JournalEntry[] {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => b[1].accessCount - a[1].accessCount)
      .slice(0, limit)
      .map(([_, entry]) => entry.data);

    return entries;
  }

  /**
   * Check if entry exists in cache
   */
  has(id: string): boolean {
    return this.cache.has(id);
  }
}

// Singleton instance
export const entryCache = new EntryCache();
