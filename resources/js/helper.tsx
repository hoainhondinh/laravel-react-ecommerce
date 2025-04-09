import {CartItem} from "@/types";

export const arraysAreEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) return false;//Check if lengths are the same

  return arr1.every((value,index) => value === arr2[index]);
}

export const productRoute = (item: CartItem) => {
  // Tạo một đối tượng URLSearchParams để xây dựng query string
  const params = new URLSearchParams();

  // Chuyển đổi object option_ids thành các tham số URL
  Object.entries(item.option_ids)
    .forEach(([typeId, optionId]) => {
      // Tạo query string với định dạng options[typeId]=optionId
      // Chuyển optionId sang string bằng cách thêm ''
      params.append(`options[${typeId}]`, optionId + '')
    })

  // Kết hợp đường dẫn gốc sản phẩm với các tham số
  return route('product.show', item.slug) + '?' + params.toString();
}
/**
 * Trích xuất mảng dữ liệu từ Resource Response
 * Hỗ trợ cả dạng ResourceResponse<T> và mảng T[]
 * @param resource - Dữ liệu từ Resource API hoặc mảng trực tiếp
 * @returns Mảng dữ liệu đã trích xuất
 */
export function getResourceData<T>(resource: any): T[] {
  if (!resource) return [];

  if (Array.isArray(resource)) {
    return resource;
  }

  if (resource && typeof resource === 'object' && Array.isArray(resource.data)) {
    return resource.data;
  }

  return [];
}
