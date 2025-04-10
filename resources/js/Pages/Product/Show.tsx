import React, {useEffect, useMemo, useState} from 'react';
import {Product, VariationTypeOption} from "@/types";
import {Head, router, useForm, usePage} from "@inertiajs/react";
import Carousel from "@/Components/Core/Carousel";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import {arraysAreEqual} from "@/helper";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import toast from "react-hot-toast";
import SoldProgressBar from "@/Components/App/SoldProgressBar";

function Show({product, variationOptions}: {
  product: Product, variationOptions: number[]
}) {

  // Form để xử lý thêm vào giỏ hàng
  const form = useForm<{
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
  }>({
    option_ids: {},
    quantity: 1,
    price: null,
  })

  const {url} = usePage();

  // Khởi tạo state cho các tùy chọn được chọn
  const [selectedOptions, setSelectedOptions] =
    useState<Record<number, VariationTypeOption>>([]);

  // Tính toán hình ảnh dựa trên tùy chọn được chọn
  const images = useMemo(() => {
    for (let typeId in selectedOptions) {
      const option = selectedOptions[typeId];
      if(option.images.length >0) return option.images;
    }
    return product.images;
  }, [product, selectedOptions]);

  // Tính toán thông tin sản phẩm dựa trên biến thể được chọn
  const computedProduct = useMemo(() => {
    const selectedOptionIds = Object.values(selectedOptions)
      .map(op => op.id)
      .sort();

    for (let variation of product.variations) {
      const optionIds = variation.variation_type_option_ids.sort();
      if (arraysAreEqual(selectedOptionIds, optionIds)) {
        return {
          price: variation.price,
          original_price: variation.original_price,
          is_on_sale: variation.is_on_sale,
          discount_percent: variation.discount_percent,
          quantity: variation.quantity === null ? Number.MAX_VALUE : variation.quantity,
          sold_count: variation.sold_count || 0,
          variation_id: variation.id,
        }
      }
    }
    return {
      price: product.price,
      original_price: product.original_price,
      is_on_sale: product.is_on_sale,
      discount_percent: product.discount_percent,
      quantity: product.quantity,
      sold_count: product.sold_count || 0,
      variation_id: null,
    };
  }, [product, selectedOptions]);

  // Khởi tạo các tùy chọn mặc định
  useEffect(() => {
    const initialOptions = {};

    product.variationTypes.forEach((type) => {
      // Nếu có variation options từ URL, sử dụng chúng
      const selectedOptionId = Number(variationOptions[type.id]);
      let matchedOption;

      if (selectedOptionId) {
        matchedOption = type.options.find(op => op.id === selectedOptionId);
      }

      // Nếu không tìm thấy option từ URL, sử dụng option đầu tiên
      if (!matchedOption && type.options.length > 0) {
        matchedOption = type.options[0];
      }

      if (matchedOption) {
        initialOptions[type.id] = matchedOption;
      }
    });

    setSelectedOptions(initialOptions);
  }, []);

  // Chuyển đổi tùy chọn thành dạng map
  const getOptionIdsMap = (newOptions:object) => {
    return Object.fromEntries(
      Object.entries(newOptions).map(([a, b]) => [a, b.id])
    )
  }

  // Xử lý khi chọn một tùy chọn
  const chooseOption = (
    typeId: number,
    option: VariationTypeOption,
    updateRouter: boolean = true
  )=> {
    setSelectedOptions((prevSelectedOptions) => {
      const newOptions = {
        ...prevSelectedOptions,
        [typeId]: option
      }

      if (updateRouter){
        router.get(url, {
          options: getOptionIdsMap(newOptions)
        }, {
          preserveScroll: true,
          preserveState: true
        })
      }
      return newOptions
    })
  }

  // Xử lý thêm vào giỏ hàng
  const addToCart = () => {
    // Kiểm tra xem đã chọn đủ biến thể chưa
    const requiredVariationTypes = product.variationTypes;
    const selectedVariationCount = Object.keys(selectedOptions).length;

    if (selectedVariationCount < requiredVariationTypes.length) {
      // Tìm các biến thể chưa được chọn
      const unselectedTypes = requiredVariationTypes.filter(type =>
        !Object.keys(selectedOptions).includes(type.id.toString())
      );

      // Hiển thị thông báo lỗi
      const typeNames = unselectedTypes.map(type => type.name).join(', ');
      toast.error(`Vui lòng chọn ${typeNames} trước khi thêm vào giỏ hàng`);

      // Highlight các biến thể chưa chọn
      unselectedTypes.forEach(type => {
        const element = document.getElementById(`variation-type-${type.id}`);
        if (element) {
          element.classList.add('highlight-required');
        }
      });

      return;
    }

    // Kiểm tra số lượng tồn kho
    if (form.data.quantity > computedProduct.quantity) {
      toast.error(`Chỉ còn ${computedProduct.quantity} sản phẩm trong kho`);
      return;
    }

    // Nếu đã chọn đủ biến thể, tiến hành thêm vào giỏ hàng
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
      },
      onError: (err) => {
        console.log(err);
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
      }
    });
  }

  // Render các loại biến thể sản phẩm
  const renderProductVariationTypes = () => {
    return (
      product.variationTypes.map((type) => (
        <div key={type.id} id={`variation-type-${type.id}`} className="mb-6">
          <p className="text-[#4E3629] font-medium mb-2">{type.name}</p>
          {type.type === 'Image' &&
            <div className="flex gap-2 mb-4">
              {type.options.map((option) => (
                <div
                  onClick={() => chooseOption(type.id, option)}
                  key={option.id}
                  className="cursor-pointer transition-all duration-200"
                >
                  {option.images &&
                    <img
                      src={option.images[0].thumb}
                      alt={option.name}
                      className={`w-[50px] border-2 ${
                        selectedOptions[type.id]?.id === option.id
                          ? 'border-[#9E7A47]'
                          : 'border-transparent hover:border-[#D8C8A4]'
                      }`}
                    />
                  }
                </div>
              ))}
            </div>
          }
          {type.type === 'Radio' &&
            <div className="flex flex-wrap gap-2 mb-4">
              {type.options.map((option) => (
                <button
                  onClick={() => chooseOption(type.id, option)}
                  key={option.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedOptions[type.id]?.id === option.id
                      ? 'bg-[#9E7A47] text-white'
                      : 'bg-white border border-[#D8C8A4] text-[#333333] hover:bg-[#D8C8A4]/10'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          }
        </div>
      ))
    )
  }

  // Render nút thêm vào giỏ hàng với plus/minus quantity input
  const renderAddToCartButton = () => {
    const decreaseQuantity = () => {
      if (form.data.quantity > 1) {
        form.setData('quantity', form.data.quantity - 1);
      }
    };

    const increaseQuantity = () => {
      if (form.data.quantity < Math.min(10, computedProduct.quantity)) {
        form.setData('quantity', form.data.quantity + 1);
      }
    };

    // Kiểm tra nếu sản phẩm hết hàng
    const isOutOfStock = computedProduct.quantity <= 0;

    return (
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Quantity input with plus/minus buttons */}
        <div className={`flex items-center border border-[#D8C8A4] rounded-md overflow-hidden w-full sm:w-40 ${isOutOfStock ? 'opacity-50' : ''}`}>
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={form.data.quantity <= 1 || isOutOfStock}
            className="px-3 py-2 bg-white text-[#4E3629] hover:bg-[#D8C8A4]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          <input
            type="text"
            value={form.data.quantity}
            readOnly
            className="w-full px-2 py-2 text-center bg-white text-[#333333] focus:outline-none"
          />

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={form.data.quantity >= Math.min(10, computedProduct.quantity) || isOutOfStock}
            className="px-3 py-2 bg-white text-[#4E3629] hover:bg-[#D8C8A4]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <button
          onClick={addToCart}
          disabled={isOutOfStock}
          className={`px-4 py-2 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9E7A47] hover:bg-[#4E3629]'} text-white rounded-md transition-colors flex-1`}
        >
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
    );
  };

  // Cập nhật form khi thay đổi tùy chọn
  useEffect(() => {
    const idsMap = Object.fromEntries(
      Object.entries(selectedOptions).map(([typeId, option]:[string, VariationTypeOption]) => [typeId, option.id])
    )
    form.setData('option_ids', idsMap)
  }, [selectedOptions]);

  return (
    <AuthenticatedLayout>
      <Head title={product.title}/>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
            <div className="col-span-7">
              <Carousel images={images}/>
            </div>
            <div className="col-span-5">
              <h1 className="text-2xl font-medium text-[#4E3629] mb-6">{product.title}</h1>
              <div className="mb-6">
                {computedProduct.is_on_sale ? (
                  <div className="mb-4">
                    <div className="text-xl text-gray-500 line-through">
                      <CurrencyFormatter amount={computedProduct.original_price}/>
                    </div>
                    <div className="flex items-center">
                      <span className="text-3xl font-semibold text-[#9E7A47] mr-3">
                        <CurrencyFormatter amount={computedProduct.price}/>
                      </span>
                      <span className="bg-[#FFBF49] text-[#4E3629] px-2 py-1 rounded-md text-sm font-medium">
                        -{computedProduct.discount_percent}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-semibold text-[#9E7A47] mb-4">
                    <CurrencyFormatter amount={computedProduct.price}/>
                  </div>
                )}

                <SoldProgressBar
                  soldCount={computedProduct.sold_count || 0}
                  quantity={computedProduct.quantity}
                  className="my-4"
                />
              </div>

              {renderProductVariationTypes()}

              {/* Hiển thị thông tin tồn kho */}
              {computedProduct.quantity === 0 ? (
                <div className="text-[#F87272] mb-4 text-sm font-medium bg-[#F87272]/10 px-3 py-2 rounded-md inline-block">
                  Hết hàng
                </div>
              ) : computedProduct.quantity < 10 && (
                <div className="text-[#F87272] mb-4 text-sm font-medium bg-[#F87272]/10 px-3 py-2 rounded-md inline-block">
                  Chỉ còn {computedProduct.quantity} sản phẩm
                </div>
              )}

              {renderAddToCartButton()}

              <div className="border-t border-[#D8C8A4] pt-6">
                <h2 className="text-xl font-medium text-[#4E3629] mb-4">Thông tin sản phẩm</h2>
                <div className="wysiwyg-output text-[#333333]"
                     dangerouslySetInnerHTML={{__html: product.description}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Show;
