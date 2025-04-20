import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AddressCard from './Partials/AddressCard';
import AddressForm from './Partials/AddressForm';
import AccountLayout from '@/Layouts/AccountLayout';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  is_default: boolean;
  full_address: string; // Accessor
}

export default function Addresses({ addresses }: PageProps<{ addresses: Address[] }>) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    is_default: false,
  });

  const closeModal = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    reset();
    clearErrors();
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      province: address.province || '',
      district: address.district || '',
      ward: address.ward || '',
      is_default: address.is_default,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      // Update existing address
      post(route('profile.addresses.update', editingAddress.id), {
        onSuccess: () => closeModal(),
        preserveScroll: true,
      });
    } else {
      // Create new address
      post(route('profile.addresses.store'), {
        onSuccess: () => closeModal(),
        preserveScroll: true,
      });
    }
  };

  return (
    <AccountLayout title="Địa chỉ của tôi">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Quản lý địa chỉ giao hàng của bạn
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 mb-2">Bạn chưa có địa chỉ giao hàng nào</p>
          <p className="text-sm text-gray-500 mb-4">Thêm địa chỉ giao hàng để dễ dàng đặt hàng</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary text-white"
          >
            Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => openEditModal(address)}
            />
          ))}
        </div>
      )}

      {/* Modal for adding/editing address */}
      {(showAddForm || editingAddress) && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-neutral">
                  {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AddressForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
