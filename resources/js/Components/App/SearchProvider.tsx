import React, { createContext, useState, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import debounce from 'lodash.debounce';

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  suggestions: SearchResult[];
  isSearching: boolean;
  searchStatus: 'idle' | 'searching' | 'success' | 'fallback' | 'error';
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  performSearch: (query: string) => void;
  resetSearch: () => void;
}

// Cache quản lý thông minh
class SmartSearchCache {
  private cache: Map<string, {
    data: SearchResult[];
    timestamp: number;
    frequency: number;
  }>;
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize = 50, maxAge = 10 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  get(key: string): SearchResult[] | undefined {
    const normalizedKey = this.normalizeKey(key);
    const entry = this.cache.get(normalizedKey);

    if (!entry) return undefined;

    // Kiểm tra cache còn hiệu lực
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(normalizedKey);
      return undefined;
    }

    // Tăng tần suất truy cập
    entry.frequency++;
    entry.timestamp = Date.now();

    return entry.data;
  }

  set(key: string, value: SearchResult[]): void {
    const normalizedKey = this.normalizeKey(key);

    // Nếu cache đầy, loại bỏ mục ít được sử dụng nhất
    if (this.cache.size >= this.maxSize) {
      let leastUsedKey = null;
      let minFrequency = Infinity;

      for (const [k, entry] of this.cache.entries()) {
        if (entry.frequency < minFrequency) {
          minFrequency = entry.frequency;
          leastUsedKey = k;
        }
      }

      if (leastUsedKey) {
        this.cache.delete(leastUsedKey);
      }
    }

    this.cache.set(normalizedKey, {
      data: value,
      timestamp: Date.now(),
      frequency: 1
    });
  }

  private normalizeKey(key: string): string {
    return key.trim().toLowerCase();
  }

  clear(): void {
    this.cache.clear();
  }
}

// Tạo context với giá trị mặc định
const SearchContext = createContext<SearchContextType>({
  query: '',
  setQuery: () => {},
  suggestions: [],
  isSearching: false,
  searchStatus: 'idle',
  showSuggestions: false,
  setShowSuggestions: () => {},
  performSearch: () => {},
  resetSearch: () => {},
});

// Hook để sử dụng search context
export const useSearch = () => useContext(SearchContext);

// Các tham số cho SearchProvider
interface SearchProviderProps {
  children: ReactNode;
  debounceTime?: number;
  minQueryLength?: number;
  maxCacheSize?: number;
  cacheMaxAge?: number;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({
                                                                children,
                                                                debounceTime = 250,
                                                                minQueryLength = 2,
                                                                maxCacheSize = 50,
                                                                cacheMaxAge = 10 * 60 * 1000 // 10 phút
                                                              }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'fallback' | 'error'>('idle');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Ref để theo dõi request hiện tại
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');
  const requestCountRef = useRef(0);

  // Khởi tạo cache thông minh
  const searchCache = useRef(new SmartSearchCache(maxCacheSize, cacheMaxAge)).current;

  // Hàm thực hiện search với quản lý request thông minh
  const performSearchRequest = useCallback(async (searchQuery: string) => {
    // Hủy request cũ nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Tạo abort controller mới
    abortControllerRef.current = new AbortController();

    // Tăng số lượng request
    requestCountRef.current++;

    try {
      setIsSearching(true);
      setSearchStatus('searching');

      // Kiểm tra cache trước
      const cachedResults = searchCache.get(searchQuery);
      if (cachedResults) {
        setSuggestions(cachedResults);
        setIsSearching(false);
        setSearchStatus('success');
        setShowSuggestions(true);
        return;
      }

      // Sử dụng router.visit với signal để có thể hủy request
      const requestId = requestCountRef.current;

      // Sử dụng fetch API với signal từ AbortController
      const response = await fetch(route('api.search.suggestions', {
        q: searchQuery,
        request_count: requestId
      }), {
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // Kiểm tra response
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const results = data.products || [];
      const status = data.searchStatus || 'success';

      // Chỉ cập nhật nếu query không thay đổi
      if (searchQuery === lastQueryRef.current) {
        // Lưu vào cache
        searchCache.set(searchQuery, results);

        setSuggestions(results);
        setSearchStatus(status);
        setShowSuggestions(results.length > 0);
      }
    } catch (error: unknown) {
      // Kiểm tra xem lỗi có phải do hủy request không
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request canceled');
      } else {
        console.error('Lỗi tìm kiếm:', error);
        setSuggestions([]);
        setSearchStatus('error');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search với lodash
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      // Bỏ qua nếu query quá ngắn
      if (searchQuery.length < minQueryLength) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchStatus('idle');
        return;
      }

      // Cập nhật query cuối cùng
      lastQueryRef.current = searchQuery;

      // Thực hiện search
      performSearchRequest(searchQuery);
    }, debounceTime),
    [performSearchRequest, minQueryLength, debounceTime]
  );

  // Hàm chính để thực hiện search
  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);

    // Bỏ qua nếu query quá ngắn
    if (searchQuery.length < minQueryLength) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchStatus('idle');
      return;
    }

    // Luôn hiển thị suggestions khi có đủ ký tự
    setShowSuggestions(true);
    debouncedSearch(searchQuery);
  }, [debouncedSearch, minQueryLength]);

  // Reset trạng thái search
  const resetSearch = useCallback(() => {
    // Hủy request đang chờ
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    setSearchStatus('idle');
    lastQueryRef.current = '';
    requestCountRef.current = 0;
  }, []);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const value = {
    query,
    setQuery,
    suggestions,
    isSearching,
    searchStatus,
    showSuggestions,
    setShowSuggestions,
    performSearch,
    resetSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
