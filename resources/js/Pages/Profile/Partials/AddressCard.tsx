import { Link } from '@inertiajs/react';

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

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  return (
    <div className={`border rounded-lg p-4 relative ${address.is_default ? 'border-primary' : 'border-gray-200'}`}>
      {address.is_default && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
          Mặc định
        </div>
      )}

      <div className="mb-2">
        <h3 className="font-medium text-neutral">{address.name}</h3>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>{address.phone}</p>
        <p className="break-words">{address.full_address}</p>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm text-primary hover:bg-primary hover:text-white border border-primary rounded transition-colors"
        >
          Sửa
        </button>

        {!address.is_default && (
          <Link
            href={route('profile.addresses.set-default', address.id)}
            method="put"
            as="button"
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
          >
            Đặt mặc định
          </Link>
        )}

        <Link
          href={route('profile.addresses.destroy', address.id)}
          method="delete"
          as="button"
          className="px-3 py-1 text-sm text-red-600 hover:bg-red-600 hover:text-white border border-red-600 rounded transition-colors"
          onBefore={() => confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')}
        >
          Xóa
        </Link>
      </div>
    </div>
  );
}
