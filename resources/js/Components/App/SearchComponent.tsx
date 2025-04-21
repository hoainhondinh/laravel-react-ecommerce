import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { useSearch } from './SearchProvider';

interface SearchComponentProps {
  isMobile?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ isMobile = false }) => {
  const {
    query,
    setQuery,
    suggestions,
    isSearching,
    searchStatus,
    showSuggestions,
    setShowSuggestions,
    performSearch
  } = useSearch();

  const { get } = useForm();

  // Xử lý submit search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      get(route('search.index', { q: query }));
      setShowSuggestions(false);
    }
  };

  // Xử lý thay đổi input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-52'}`}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder={isMobile ? "Tìm sản phẩm bạn mong muốn..." : "Tìm sản phẩm..."}
            className={`w-full rounded-md bg-white border border-[#D8C8A4] py-${isMobile ? '2' : '1.5'} pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E7A47] focus:border-[#9E7A47]`}
            value={query}
            onChange={handleSearchChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#9E7A47] hover:text-[#4E3629]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-${isMobile ? '5' : '4'} w-${isMobile ? '5' : '4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute z-50 mt-1 ${isMobile ? 'left-0 right-0 mx-0' : 'w-full'} bg-white rounded-md shadow-lg border border-[#D8C8A4] max-h-96 overflow-y-auto`}>
          <div className="p-2">
            <h3 className="text-xs font-semibold text-[#4E3629] mb-1 pl-2">Sản phẩm gợi ý</h3>

            {isSearching ? (
              <div className="py-4 text-center text-gray-500">
                <svg className="animate-spin h-5 w-5 mx-auto mb-2 text-[#9E7A47]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tìm kiếm...
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.map(product => (
                  <Link
                    key={product.id}
                    href={route('product.show', { product: product.slug })}
                    className="flex items-center p-2 hover:bg-[#F9F7F1] rounded-md"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} rounded overflow-hidden bg-[#F9F7F1] flex-shrink-0`}>
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#D8C8A4] text-white text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className={`${isMobile ? 'ml-3' : 'ml-2'} flex-grow`}>
                      <div className="text-sm text-[#333333] line-clamp-1">{product.title}</div>
                      <div className="text-xs text-[#9E7A47] font-medium">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* View all results link */}
            {suggestions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#D8C8A4]">
                <Link
                  href={route('search.index', { q: query })}
                  className="block w-full text-center text-sm text-[#9E7A47] hover:text-[#4E3629] py-1"
                  onClick={() => setShowSuggestions(false)}
                >
                  Xem tất cả kết quả
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
