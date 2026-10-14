export interface SupportedLanguage {
  id: string;
  name: string;
  displayName: string;
  version: string;
  runtimeBadge: string;
  shortTag: string;
  category: "Web & Fullstack" | "Systems & Native" | "Backend & Enterprise";
  brandColor: string; // Hex for indicator
  badgeClass: string; // Tailwind styling for badge
  runnerCommand: string;
  testFramework: string;
  defaultLatencyMs: number;
  initialCode: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    id: "typescript",
    name: "TypeScript",
    displayName: "TypeScript",
    version: "v5.4.5",
    runtimeBadge: "Node.js 20 LTS",
    shortTag: "TS",
    category: "Web & Fullstack",
    brandColor: "#3178c6",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    runnerCommand: "npx vitest run --silent",
    testFramework: "Vitest v1.5 (V8 Isolate)",
    defaultLatencyMs: 19,
    initialCode: `// TypeScript (Node.js 20 LTS)
// Problem: In-Memory TTL Cache Helper
interface CacheItem<T> {
  val: T;
  expiry: number;
}

export function createCache<T = any>(ttlMs: number) {
  const store = new Map<string, CacheItem<T>>();

  return {
    set(key: string, val: T): void {
      store.set(key, { val, expiry: Date.now() + ttlMs });
    },
    get(key: string): T | null {
      const item = store.get(key);
      if (!item) return null;
      if (Date.now() > item.expiry) {
        store.delete(key);
        return null;
      }
      return item.val;
    }
  };
}`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    displayName: "JavaScript",
    version: "ES2024",
    runtimeBadge: "Node.js 20 LTS",
    shortTag: "JS",
    category: "Web & Fullstack",
    brandColor: "#f7df1e",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    runnerCommand: "node --test",
    testFramework: "Node.js Native Test Runner",
    defaultLatencyMs: 16,
    initialCode: `// JavaScript (ES2024 / Node.js 20)
// Problem: In-Memory TTL Cache Helper
export function createCache(ttlMs) {
  const store = new Map();

  return {
    set(key, val) {
      store.set(key, { val, expiry: Date.now() + ttlMs });
    },
    get(key) {
      const item = store.get(key);
      if (!item) return null;
      if (Date.now() > item.expiry) {
        store.delete(key);
        return null;
      }
      return item.val;
    }
  };
}`,
  },
  {
    id: "python",
    name: "Python",
    displayName: "Python 3",
    version: "v3.12.3",
    runtimeBadge: "CPython 3.12",
    shortTag: "PY",
    category: "Backend & Enterprise",
    brandColor: "#38bdf8",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    runnerCommand: "python3 -m pytest -q",
    testFramework: "pytest v8.2.1",
    defaultLatencyMs: 24,
    initialCode: `# Python 3.12 (Isolated Cloud Runtime)
# Problem: In-Memory TTL Cache Helper
import time
from typing import Any, Optional

class TimeCache:
    def __init__(self, ttl_ms: int):
        self.ttl_seconds = ttl_ms / 1000.0
        self._store: dict[str, tuple[Any, float]] = {}

    def set(self, key: str, val: Any) -> None:
        self._store[key] = (val, time.time() + self.ttl_seconds)

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        val, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        return val

def create_cache(ttl_ms: int):
    return TimeCache(ttl_ms)`,
  },
  {
    id: "go",
    name: "Go",
    displayName: "Go",
    version: "v1.22.4",
    runtimeBadge: "gc / Linux ELF",
    shortTag: "GO",
    category: "Systems & Native",
    brandColor: "#00add8",
    badgeClass: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    runnerCommand: "go test -v -race .",
    testFramework: "Go Test Runner (Race Detector)",
    defaultLatencyMs: 12,
    initialCode: `// Go 1.22 (Linux Container Isolate)
// Problem: In-Memory TTL Cache Helper
package solution

import (
	"sync"
	"time"
)

type CacheItem struct {
	val    interface{}
	expiry time.Time
}

type Cache struct {
	mu    sync.RWMutex
	ttl   time.Duration
	store map[string]CacheItem
}

func NewCache(ttlMs int64) *Cache {
	return &Cache{
		ttl:   time.Duration(ttlMs) * time.Millisecond,
		store: make(map[string]CacheItem),
	}
}

func (c *Cache) Set(key string, val interface{}) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.store[key] = CacheItem{val: val, expiry: time.Now().Add(c.ttl)}
}

func (c *Cache) Get(key string) interface{} {
	c.mu.Lock()
	defer c.mu.Unlock()
	item, exists := c.store[key]
	if !exists || time.Now().After(item.expiry) {
		delete(c.store, key)
		return nil
	}
	return item.val
}`,
  },
  {
    id: "java",
    name: "Java",
    displayName: "Java",
    version: "v21.0.3",
    runtimeBadge: "OpenJDK 21 LTS",
    shortTag: "JV",
    category: "Backend & Enterprise",
    brandColor: "#f97316",
    badgeClass: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    runnerCommand: "mvn test -B",
    testFramework: "JUnit 5.10 / Surefire",
    defaultLatencyMs: 28,
    initialCode: `// Java 21 LTS (OpenJDK HotSpot 64-Bit Server VM)
// Problem: In-Memory TTL Cache Helper
package com.assessmentforces.solution;

import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;

public class CacheService<T> {
    private final long ttlMs;
    private final ConcurrentHashMap<String, CacheEntry<T>> store = new ConcurrentHashMap<>();

    record CacheEntry<T>(T value, Instant expiry) {}

    public CacheService(long ttlMs) {
        this.ttlMs = ttlMs;
    }

    public void set(String key, T val) {
        store.put(key, new CacheEntry<>(val, Instant.now().plusMillis(ttlMs)));
    }

    public T get(String key) {
        CacheEntry<T> entry = store.get(key);
        if (entry == null) return null;
        if (Instant.now().isAfter(entry.expiry())) {
            store.remove(key);
            return null;
        }
        return entry.value();
    }
}`,
  },
  {
    id: "cpp",
    name: "C++",
    displayName: "C++23",
    version: "GCC 14.1",
    runtimeBadge: "std=c++23 (-O3)",
    shortTag: "C++",
    category: "Systems & Native",
    brandColor: "#3b82f6",
    badgeClass: "bg-blue-600/15 text-blue-300 border-blue-600/30",
    runnerCommand: "g++ -O3 -std=c++23 test.cpp && ./a.out",
    testFramework: "GoogleTest (gtest v1.14)",
    defaultLatencyMs: 8,
    initialCode: `// C++23 (GCC 14.1 with -O3 Optimization)
// Problem: In-Memory TTL Cache Helper
#include <iostream>
#include <string>
#include <unordered_map>
#include <chrono>
#include <optional>

template<typename T>
class TimeCache {
private:
    int64_t ttl_ms;
    struct Entry {
        T value;
        std::chrono::steady_clock::time_point expiry;
    };
    std::unordered_map<std::string, Entry> store;

public:
    explicit TimeCache(int64_t ttl) : ttl_ms(ttl) {}

    void set(const std::string& key, const T& val) {
        auto exp = std::chrono::steady_clock::now() + std::chrono::milliseconds(ttl_ms);
        store[key] = {val, exp};
    }

    std::optional<T> get(const std::string& key) {
        auto it = store.find(key);
        if (it == store.end()) return std::nullopt;
        if (std::chrono::steady_clock::now() > it->second.expiry) {
            store.erase(it);
            return std::nullopt;
        }
        return it->second.value;
    }
};`,
  },
  {
    id: "rust",
    name: "Rust",
    displayName: "Rust",
    version: "v1.78.0",
    runtimeBadge: "LLVM 18 / Edition 2021",
    shortTag: "RS",
    category: "Systems & Native",
    brandColor: "#fb923c",
    badgeClass: "bg-orange-600/15 text-orange-300 border-orange-600/30",
    runnerCommand: "cargo test --release --quiet",
    testFramework: "Cargo Test Runner",
    defaultLatencyMs: 9,
    initialCode: `// Rust 1.78.0 (2021 Edition, LLVM Backend)
// Problem: In-Memory TTL Cache Helper
use std::collections::HashMap;
use std::time::{Duration, Instant};

pub struct Cache<T> {
    ttl: Duration,
    store: HashMap<String, (T, Instant)>,
}

impl<T: Clone> Cache<T> {
    pub fn new(ttl_ms: u64) -> Self {
        Self {
            ttl: Duration::from_millis(ttl_ms),
            store: HashMap::new(),
        }
    }

    pub fn set(&mut self, key: &str, val: T) {
        let expiry = Instant::now() + self.ttl;
        self.store.insert(key.to_string(), (val, expiry));
    }

    pub fn get(&mut self, key: &str) -> Option<T> {
        if let Some((_, expiry)) = self.store.get(key) {
            if Instant::now() > *expiry {
                self.store.remove(key);
                return None;
            }
        }
        self.store.get(key).map(|(val, _)| val.clone())
    }
}`,
  },
  {
    id: "csharp",
    name: "C#",
    displayName: "C# (.NET)",
    version: "v8.0.204",
    runtimeBadge: ".NET 8.0 LTS",
    shortTag: "C#",
    category: "Backend & Enterprise",
    brandColor: "#a855f7",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    runnerCommand: "dotnet test --no-build -v q",
    testFramework: "xUnit 2.7 / Microsoft.NET.Test.Sdk",
    defaultLatencyMs: 22,
    initialCode: `// C# 12 (.NET 8.0 LTS CoreCLR)
// Problem: In-Memory TTL Cache Helper
using System;
using System.Collections.Concurrent;

namespace AssessmentForces.Solutions;

public class MemoryCache<T>
{
    private readonly TimeSpan _ttl;
    private readonly ConcurrentDictionary<string, (T Value, DateTime Expiry)> _store = new();

    public MemoryCache(int ttlMs) => _ttl = TimeSpan.FromMilliseconds(ttlMs);

    public void Set(string key, T val) =>
        _store[key] = (val, DateTime.UtcNow.Add(_ttl));

    public T? Get(string key)
    {
        if (!_store.TryGetValue(key, out var entry)) return default;
        if (DateTime.UtcNow > entry.Expiry)
        {
            _store.TryRemove(key, out _);
            return default;
        }
        return entry.Value;
    }
}`,
  },
  {
    id: "php",
    name: "PHP",
    displayName: "PHP",
    version: "v8.3.7",
    runtimeBadge: "Zend Engine 4.3",
    shortTag: "PHP",
    category: "Web & Fullstack",
    brandColor: "#818cf8",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    runnerCommand: "./vendor/bin/phpunit --colors=never",
    testFramework: "PHPUnit 11.1",
    defaultLatencyMs: 26,
    initialCode: `<?php
// PHP 8.3 (Zend Engine 4.3)
// Problem: In-Memory TTL Cache Helper
namespace AssessmentForces\\Solutions;

class CacheStore {
    private int $ttlMs;
    private array $store = [];

    public function __construct(int $ttlMs) {
        $this->ttlMs = $ttlMs;
    }

    public function set(string $key, mixed $val): void {
        $this->store[$key] = [
            'val' => $val,
            'expiry' => (microtime(true) * 1000) + $this->ttlMs
        ];
    }

    public function get(string $key): mixed {
        if (!isset($this->store[$key])) return null;
        if ((microtime(true) * 1000) > $this->store[$key]['expiry']) {
            unset($this->store[$key]);
            return null;
        }
        return $this->store[$key]['val'];
    }
}`,
  },
  {
    id: "ruby",
    name: "Ruby",
    displayName: "Ruby",
    version: "v3.3.1",
    runtimeBadge: "Ruby YJIT JIT",
    shortTag: "RB",
    category: "Web & Fullstack",
    brandColor: "#f43f5e",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    runnerCommand: "bundle exec rspec --format progress",
    testFramework: "RSpec 3.13",
    defaultLatencyMs: 29,
    initialCode: `# Ruby 3.3.1 (YJIT Enabled)
# Problem: In-Memory TTL Cache Helper
class TimedCache
  def initialize(ttl_ms)
    @ttl_seconds = ttl_ms / 1000.0
    @store = {}
  end

  def set(key, val)
    @store[key] = { val: val, expiry: Time.now + @ttl_seconds }
  end

  def get(key)
    item = @store[key]
    return nil unless item
    if Time.now > item[:expiry]
      @store.delete(key)
      return nil
    end
    item[:val]
  end
end`,
  },
];
