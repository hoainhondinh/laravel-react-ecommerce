<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display a listing of the addresses.
     */
    public function index()
    {
        $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->get();

        return Inertia::render('Profile/Addresses', [
            'addresses' => $addresses
        ]);
    }

    /**
     * Store a newly created address.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address' => 'required|string|max:500',
            'province' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'ward' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ], [
            'name.required' => 'Vui lòng nhập tên người nhận',
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'phone.regex' => 'Số điện thoại không hợp lệ',
            'address.required' => 'Vui lòng nhập địa chỉ',
        ]);

        try {
            DB::beginTransaction();

            // Nếu đặt làm địa chỉ mặc định, bỏ mặc định các địa chỉ khác
            if ($validated['is_default'] ?? false) {
                Auth::user()->addresses()->update(['is_default' => false]);
            }

            // Tạo địa chỉ mới
            $address = Auth::user()->addresses()->create($validated);

            // Nếu không có địa chỉ mặc định và đây là địa chỉ đầu tiên, đặt làm mặc định
            if (Auth::user()->addresses()->count() === 1) {
                $address->update(['is_default' => true]);
            }

            DB::commit();

            return redirect()->route('profile.addresses')->with('success', 'Địa chỉ đã được thêm thành công');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Có lỗi xảy ra khi thêm địa chỉ: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified address.
     */
    public function update(Request $request, Address $address)
    {
        // Xác thực quyền sở hữu địa chỉ
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address' => 'required|string|max:500',
            'province' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'ward' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // Nếu đặt làm địa chỉ mặc định, bỏ mặc định các địa chỉ khác
            if ($validated['is_default'] ?? false) {
                Auth::user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            }

            // Cập nhật địa chỉ
            $address->update($validated);

            DB::commit();

            return redirect()->route('profile.addresses')->with('success', 'Địa chỉ đã được cập nhật thành công');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Có lỗi xảy ra khi cập nhật địa chỉ: ' . $e->getMessage());
        }
    }

    /**
     * Set address as default.
     */
    public function setDefault(Address $address)
    {
        // Xác thực quyền sở hữu địa chỉ
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            DB::beginTransaction();

            // Bỏ mặc định tất cả địa chỉ của người dùng
            Auth::user()->addresses()->update(['is_default' => false]);

            // Đặt mặc định cho địa chỉ hiện tại
            $address->update(['is_default' => true]);

            DB::commit();

            return redirect()->route('profile.addresses')->with('success', 'Đã đặt làm địa chỉ mặc định');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified address.
     */
    public function destroy(Address $address)
    {
        // Xác thực quyền sở hữu địa chỉ
        if ($address->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            // Kiểm tra xem có phải địa chỉ mặc định không
            $isDefault = $address->is_default;

            // Xóa địa chỉ
            $address->delete();

            // Nếu là địa chỉ mặc định, cần đặt một địa chỉ khác làm mặc định (nếu có)
            if ($isDefault) {
                $newDefaultAddress = Auth::user()->addresses()->first();
                if ($newDefaultAddress) {
                    $newDefaultAddress->update(['is_default' => true]);
                }
            }

            return redirect()->route('profile.addresses')->with('success', 'Địa chỉ đã được xóa thành công');
        } catch (\Exception $e) {
            return back()->with('error', 'Có lỗi xảy ra khi xóa địa chỉ: ' . $e->getMessage());
        }
    }
}
