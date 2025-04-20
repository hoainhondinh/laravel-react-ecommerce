import { useState } from 'react';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  is_default: boolean;
  full_address: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  onSelect: (address: Address) => void;
  selectedAddressId: number | null;
  showAddNewOption?: boolean;
  onAddNew?: () => void;
}

export default function AddressSelector({
                                          addresses,
                                          onSelect,
                                          selectedAddressId,
                                          showAddNewOption = true,
                                          onAddNew,
                                        }: AddressSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Tìm địa chỉ đang được chọn
  const selectedAddress = selectedAddressId
    ? addresses.find(addr => addr.id === selectedAddressId)
    : addresses.find(addr => addr.is_default) || addresses[0];

  // Function để chọn địa chỉ
  const handleSelectAddress = (address: Address) => {
    onSelect(address);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="mb-2 font-medium text-neutral">Chọn địa chỉ giao hàng</div>

      {/* Selected address display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          border rounded-lg p-3 cursor-pointer
          ${isOpen ? 'ring-2 ring-primary border-primary' : 'hover:border-primary'}
          transition-all
        `}
      >
        {selectedAddress ? (
          <div>
            <div className="flex justify-between">
              <span className="font-medium">{selectedAddress.name}</span>
              <span>{selectedAddress.phone}</span>
            </div>
            <div className="text-gray-600 mt-1 text-sm">{selectedAddress.full_address}</div>
            <div className="flex justify-between items-center mt-2">
              {selectedAddress.is_default && (
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Mặc định</span>
              )}
              <div className="text-primary text-sm flex items-center ml-auto">
                Thay đổi
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 flex justify-between items-center">
            <span>Chọn địa chỉ giao hàng</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {addresses.length > 0 ? (
            <div>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`
                    p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50
                    ${selectedAddressId === address.id ? 'bg-gray-50' : ''}
                  `}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{address.name}</span>
                    <span>{address.phone}</span>
                  </div>
                  <div className="text-gray-600 mt-1 text-sm">{address.full_address}</div>
                  {address.is_default && (
                    <div className="mt-1">
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Mặc định</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Bạn chưa có địa chỉ giao hàng nào.
            </div>
          )}

          {showAddNewOption && onAddNew && (
            <div
              onClick={onAddNew}
              className="p-3 text-primary font-medium cursor-pointer hover:bg-gray-50 flex items-center justify-center border-t"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Thêm địa chỉ mới
            </div>
          )}
        </div>
      )}
    </div>
  );
}
