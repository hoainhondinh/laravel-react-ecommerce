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
    price: null,// TODO polulate price on change
  })

  const {url} = usePage();

  // Khởi tạo state cho các tùy chọn được chọn - sử dụng object rỗng
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

  // const computedProduct = useMemo(() => {
  //   const selectedOptionIds = Object.values(selectedOptions)
  //     .map(op => op.id)
  //   .sort();
  //
  //   for (let variation of product.variations) {
  //     const optionIds = variation.variation_type_option_ids.sort();
  //     if (arraysAreEqual(selectedOptionIds, optionIds)) {
  //       return {
  //         price: variation.price,
  //         quantity: variation.quantity === null ? Number.MAX_VALUE : variation.quantity,
  //       }
  //     }
  //   }
  //   return {
  //     price: product.price,
  //     quantity: product.quantity
  //   };
  // }, [product, selectedOptions]);
// Trong computedProduct, thêm trường để tính giá khuyến mãi
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
          sold_count: variation.sold_count || 0, // Thêm trường này
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
    };
  }, [product, selectedOptions]);
  // Khởi tạo các tùy chọn mặc định

  // useEffect(() => {
  //   const initialOptions = {};
  //
  //   product.variationTypes.forEach((type, index) => {
  //     // Tìm option ID theo index của mảng
  //     // Chuyển đổi selectedOptionId từ string sang number
  //     const selectedOptionId = Number(variationOptions[type.id]);
  //     // Tìm option tương ứng
  //     const matchedOption = type.options.find(
  //       op => op.id === selectedOptionId
  //     );
  //
  //     if (matchedOption) {
  //       initialOptions[type.id] = matchedOption;
  //     }
  //   });
  //
  //   setSelectedOptions(initialOptions);
  // }, []);
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

  // Xử lý thay đổi số lượng
  const onQuantityChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    form.setData('quantity', parseInt(ev.target.value))
  }

  // Xử lý thêm vào giỏ hàng
  // const addToCart = () => {
  //   form.post(route('cart.store', product.id), {
  //     preserveScroll: true,
  //     preserveState: true,
  //     onError: (err) => {
  //       console.log(err)
  //     }
  //     // onSuccess: () => router.get(route('cart.index')),
  //   })
  // }
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

      // Highlight các biến thể chưa chọn bằng cách thêm class
      unselectedTypes.forEach(type => {
        const element = document.getElementById(`variation-type-${type.id}`);
        if (element) {
          element.classList.add('highlight-required');
        }
      });

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
        <div key={type.id}>
          <b>{type.name}</b>
          {type.type === 'Image' &&
          <div className="flex gap-2 mb-4">
            {type.options.map((option) => (
              <div onClick={()=>chooseOption(type.id,option)} key={option.id}>
                {option.images && <img src={option.images[0].thumb} alt="" className={'w-[50px] ' + (
                  selectedOptions[type.id]?.id === option.id ? 'outline outline-4 outline-primary' : ''
                )}/>}
              </div>
            ))}
          </div>
          }
          {type.type === 'Radio' &&
            <div className="flex join mb-4">
              {type.options.map((option) => (
                <input onChange={() => chooseOption(type.id, option)}
                  key={option.id}
                  className="join-item btn"
                  type="radio"
                  value={option.id}
                  checked={selectedOptions[type.id]?.id === option.id}
                  name={'variation_type_' + type.id}
                  aria-label={option.name}
                />
                ))}
            </div>
          }
        </div>
      ))
    )
  }

  // Render nút thêm vào giỏ hàng
  const renderAddToCartButton = () => {
    return(
      <div className="mb-8 flex gap-4">
        <select value={form.data.quantity} onChange={onQuantityChange} className="select select-bordered w-full">
          {Array.from({
            length: Math.min(10, computedProduct.quantity)
          }).map((el, i) => (
            <option value={i + 1} key={i + 1}>Quantity: {i + 1}</option>
          ))
          }
        </select>
        <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
      </div>

    )
  }

  // Cập nhật form khi thay đổi tùy chọn
  useEffect(() => {
    const idsMap = Object.fromEntries(
      Object.entries(selectedOptions).map(([typeId, option]:[string, VariationTypeOption]) => [typeId, option.id])
    )
    console.log(idsMap)
    form.setData('option_ids', idsMap)
  }, [selectedOptions]);
  return (
    <AuthenticatedLayout>
      <Head title={product.title}/>
        <div className="container mx-auto p-8">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
            <div className="col-span-7">
              <Carousel images={images}/>
            </div>
            <div className="col-span-5">
              <h1 className="text-2xl mb-8">{product.title}</h1>

              <div>
                {/*<div className="text-3xl font-semibold">*/}
                {/*  <CurrencyFormatter amount={computedProduct.price}/>*/}
                {/*</div>*/}
                <div>
                  {computedProduct.is_on_sale ? (
                    <div className="mb-4">
                      <div className="text-xl text-gray-500 line-through">
                        <CurrencyFormatter amount={computedProduct.original_price}/>
                      </div>
                      <div className="flex items-center">
                      <span className="text-3xl font-semibold text-red-600 mr-3">
                        <CurrencyFormatter amount={computedProduct.price}/>
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                        -{computedProduct.discount_percent}%
                      </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-semibold mb-4">
                      <CurrencyFormatter amount={computedProduct.price}/>
                    </div>
                  )}

                  {computedProduct.sold_count > 0 && (
                    <div className="text-sm text-gray-500 mb-4">
                      Đã bán: {computedProduct.sold_count}
                    </div>
                  )}
                  <SoldProgressBar
                    soldCount={computedProduct.sold_count || 0}
                    quantity={computedProduct.quantity}
                    className="my-4"
                  />
                </div>
              </div>

              {renderProductVariationTypes()}

              {computedProduct.quantity != undefined &&
                computedProduct.quantity < 10 &&
                <div className="text-error my-4">
                  <span>Only {computedProduct.quantity} left</span>
                </div>
              }
              {renderAddToCartButton()}

              <b className="text-xl">About the Item</b>
              <div className="wysiwyg-output"
                   dangerouslySetInnerHTML={{__html: product.description}}/>
            </div>
          </div>
        </div>
    </AuthenticatedLayout>
  );
}

export default Show;
