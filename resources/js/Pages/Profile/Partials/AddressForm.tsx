import { Dispatch, SetStateAction } from 'react';
import InputError from '@/Components/Core/InputError';

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}

interface AddressFormProps {
  data: AddressFormData;
  setData: Dispatch<SetStateAction<any>>;
  errors: Record<string, string>;
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AddressForm({
                                      data,
                                      setData,
                                      errors,
                                      processing,
                                      handleSubmit
                                    }: AddressFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setData(prevData => ({...prevData, [name]: value}));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    setData(prevData => ({...prevData, [name]: checked}));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Họ tên người nhận <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.name}
          onChange={handleChange}
          className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          required
        />
        {errors.name && <InputError message={errors.name} className="mt-1"/>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={data.phone}
          onChange={handleChange}
          className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          required
          placeholder="VD: 0912345678"
        />
        {errors.phone && <InputError message={errors.phone} className="mt-1"/>}
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={data.address}
          onChange={handleChange}
          rows={3}
          className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          required
          placeholder="Số nhà, tên đường, tòa nhà, v.v."
        />
        {errors.address && <InputError message={errors.address} className="mt-1"/>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="province" className="block text-gray-700 font-medium mb-2">
            Tỉnh/Thành phố
          </label>
          <input
            id="province"
            name="province"
            type="text"
            value={data.province}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          />
          {errors.province && <InputError message={errors.province} className="mt-1"/>}
        </div>

        <div>
          <label htmlFor="district" className="block text-gray-700 font-medium mb-2">
            Quận/Huyện
          </label>
          <input
            id="district"
            name="district"
            type="text"
            value={data.district}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          />
          {errors.district && <InputError message={errors.district} className="mt-1"/>}
        </div>

        <div>
          <label htmlFor="ward" className="block text-gray-700 font-medium mb-2">
            Phường/Xã
          </label>
          <input
            id="ward"
            name="ward"
            type="text"
            value={data.ward}
            onChange={handleChange}
            className="w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
          />
          {errors.ward && <InputError message={errors.ward} className="mt-1"/>}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_default"
            checked={data.is_default}
            onChange={handleCheckboxChange}
            className="border-gray-300 text-primary focus:border-primary focus:ring-primary rounded"
          />
          <span className="ml-2 text-gray-700">Đặt làm địa chỉ mặc định</span>
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={processing}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {processing ? 'Đang xử lý...' : 'Lưu địa chỉ'}
        </button>
      </div>
    </form>
  );
}
