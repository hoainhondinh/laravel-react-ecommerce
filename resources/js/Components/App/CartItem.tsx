import React, {useState} from 'react';
import {Link, router, useForm} from "@inertiajs/react";
import {CartItem as CartItemType} from "@/types";
import TextInput from "@/Components/Core/TextInput";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import {productRoute} from "@/helper";
import toast from "react-hot-toast";

function CartItem({item}: {item: CartItemType}) {
  const deleteForm = useForm({
    option_ids: item.option_ids
  })

  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(item.quantity)

  // Tính toán số lượng tối đa có thể đặt (lấy giá trị nhỏ hơn giữa 10 và số lượng tồn kho)
  const maxQuantity = Math.min(10, item.available_quantity || Infinity)

  // Kiểm tra xem đã đạt giới hạn tối đa chưa
  const hasReachedMaxQuantity = quantity >= maxQuantity

  // Kiểm tra xem giới hạn do tồn kho hay do quy định (10)
  const isLimitedByStock = item.available_quantity && item.available_quantity < 10

  const onDeleteClick = () => {
    deleteForm.delete(route('cart.destroy', item.product_id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      }
    })
  }

  // Kiểm tra giá trị và cập nhật số lượng
  const validateAndUpdateQuantity = (value: number) => {
    setError('');

    if (isNaN(value) || value <= 0) {
      setError('Số lượng phải lớn hơn 0');
      return false;
    }

    // Kiểm tra giới hạn tối đa 10 sản phẩm
    if (value > 10) {
      setError('Chỉ được đặt tối đa 10 sản phẩm');
      return false;
    }

    // Kiểm tra số lượng tồn kho
    if (item.available_quantity && value > item.available_quantity) {
      setError(`Chỉ còn ${item.available_quantity} sản phẩm trong kho`);
      return false;
    }

    return true;
  }

  // Handle quantity input change
  const handleQuantityInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(ev.target.value);
    setQuantity(newQuantity);
  }

  // Handle quantity update when blur
  const handleQuantityBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(ev.target.value);

    if (!validateAndUpdateQuantity(newQuantity)) {
      return;
    }

    updateQuantity(newQuantity);
  }

  // Handle quantity update
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity === item.quantity) return;

    router.put(route('cart.update', item.product_id), {
      quantity: newQuantity,
      option_ids: item.option_ids
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Đã cập nhật số lượng');
      },
      onError: (errors: Record<string, string>) => {
        setError(Object.values(errors)[0] as string);
        setQuantity(item.quantity); // Revert to original quantity on error
      }
    })
  }

  return (
    <>
      <div key={item.id} className="flex gap-6 p-3" >
        <Link href={productRoute(item)} className="w-32 min-w-32 min-h-32 flex justify-center self-start">
          <img src={item.image} alt="" className="max-w-full max-h-full"/>
        </Link>
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="mb-3 text-sm font-semibold">
              <Link href={productRoute(item)}>
                {item.title}
              </Link>
            </h3>
            <div className="text-xs">
              {item.options.map(option => (
                <div key={option.id}>
                  <strong className="text-bold">{option.type.name}:</strong>
                  {option.name}
                </div>
              ))}
            </div>

            {/* Hiển thị thông tin tồn kho nếu dưới 10 */}
            {isLimitedByStock && (
              <div className="mt-2 text-xs text-amber-600">
                Còn {item.available_quantity} sản phẩm trong kho
              </div>
            )}

            {/* Hiển thị thông báo đạt giới hạn số lượng */}
            {hasReachedMaxQuantity && !isLimitedByStock && (
              <div className="mt-2 text-xs text-amber-600">
                Đã đạt số lượng tối đa (10) cho mỗi sản phẩm
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 items-center">
              <div className="text-sm">Số lượng:</div>
              <div className={error ? 'tooltip tooltip-open tooltip-error' : ''} data-tip={error}>
                <TextInput
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  onBlur={handleQuantityBlur}
                  max={maxQuantity}
                  min={1}
                  className="input-sm w-16"
                />
              </div>
              <button onClick={onDeleteClick} className="btn btn-sm btn-ghost">Xóa</button>
            </div>
            <div className="font-bold text-lg">
              <CurrencyFormatter amount={item.price * quantity}/>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
}

export default CartItem;
