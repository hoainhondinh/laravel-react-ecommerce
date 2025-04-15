<?php

namespace Database\Seeders;

use App\Models\SupportPage;
use Illuminate\Database\Seeder;

class SupportPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Chính sách vận chuyển và giao nhận',
                'slug' => 'chinh-sach-van-chuyen-va-giao-nhan',
                'content' => $this->getShippingPolicyContent(),
                'meta_description' => 'Thông tin chi tiết về chính sách vận chuyển, phí giao hàng và thời gian giao hàng tại cửa hàng chúng tôi.',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Chính sách đổi trả',
                'slug' => 'chinh-sach-doi-tra',
                'content' => $this->getReturnPolicyContent(),
                'meta_description' => 'Quy định về đổi trả sản phẩm, hoàn tiền và các điều kiện áp dụng khi mua hàng tại cửa hàng.',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Phương thức thanh toán',
                'slug' => 'phuong-thuc-thanh-toan',
                'content' => $this->getPaymentMethodsContent(),
                'meta_description' => 'Các hình thức thanh toán được chấp nhận khi mua hàng tại cửa hàng chúng tôi.',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Hướng dẫn mua hàng',
                'slug' => 'huong-dan-mua-hang',
                'content' => $this->getShoppingGuideContent(),
                'meta_description' => 'Hướng dẫn chi tiết cách thức đặt hàng, thanh toán và nhận hàng tại cửa hàng chúng tôi.',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => 'Chính sách kiểm hàng',
                'slug' => 'chinh-sach-kiem-hang',
                'content' => $this->getInspectionPolicyContent(),
                'meta_description' => 'Quy định về quy trình kiểm tra hàng hóa trước khi giao và quyền lợi của khách hàng.',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Chính sách bảo mật',
                'slug' => 'chinh-sach-bao-mat',
                'content' => $this->getPrivacyPolicyContent(),
                'meta_description' => 'Cam kết của chúng tôi về việc bảo vệ thông tin cá nhân và dữ liệu khách hàng.',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'title' => 'Chính sách và quy định chung',
                'slug' => 'chinh-sach-va-quy-dinh-chung',
                'content' => $this->getGeneralPolicyContent(),
                'meta_description' => 'Các điều khoản và điều kiện chung khi sử dụng dịch vụ mua hàng tại cửa hàng.',
                'is_active' => true,
                'order' => 7,
            ],
        ];

        foreach ($pages as $page) {
            SupportPage::create($page);
        }
    }

    private function getShippingPolicyContent(): string
    {
        return '<h2>Chính sách vận chuyển và giao nhận</h2>
        <p>Chúng tôi cam kết giao hàng nhanh chóng và đáng tin cậy đến tận tay khách hàng. Dưới đây là thông tin chi tiết về chính sách vận chuyển của chúng tôi:</p>

        <h3>Phạm vi giao hàng</h3>
        <p>Chúng tôi giao hàng đến tất cả các tỉnh thành trên toàn quốc.</p>

        <h3>Thời gian giao hàng</h3>
        <ul>
            <li>Nội thành Hà Nội, TP.HCM: 1-2 ngày làm việc</li>
            <li>Các tỉnh thành khác: 2-5 ngày làm việc</li>
            <li>Vùng sâu, vùng xa: 5-7 ngày làm việc</li>
        </ul>

        <h3>Phí vận chuyển</h3>
        <ul>
            <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên</li>
            <li>Nội thành Hà Nội, TP.HCM: 30.000đ</li>
            <li>Các tỉnh thành khác: 40.000đ - 60.000đ (tùy khu vực)</li>
        </ul>

        <h3>Đơn vị vận chuyển</h3>
        <p>Chúng tôi hợp tác với các đơn vị vận chuyển uy tín như Giao Hàng Nhanh, Giao Hàng Tiết Kiệm, Viettel Post để đảm bảo hàng hóa được giao đến tay khách hàng một cách an toàn và đúng hẹn.</p>

        <h3>Theo dõi đơn hàng</h3>
        <p>Sau khi đặt hàng thành công, khách hàng sẽ nhận được mã vận đơn qua email hoặc SMS để theo dõi tình trạng giao hàng.</p>

        <h3>Chính sách kiểm tra hàng</h3>
        <p>Khách hàng có quyền kiểm tra hàng hóa trước khi thanh toán (đối với hình thức thanh toán khi nhận hàng). Vui lòng kiểm tra kỹ hàng hóa trước khi ký nhận.</p>

        <h3>Lưu ý</h3>
        <p>Thời gian giao hàng có thể bị ảnh hưởng bởi các yếu tố khách quan như thời tiết, thiên tai, dịch bệnh hoặc các sự kiện bất khả kháng khác. Chúng tôi sẽ thông báo cho khách hàng nếu có bất kỳ sự chậm trễ nào.</p>';
    }

    private function getReturnPolicyContent(): string
    {
        return '<h2>Chính sách đổi trả sản phẩm</h2>
        <p>Chúng tôi cam kết đảm bảo sự hài lòng của khách hàng với mọi sản phẩm mua từ cửa hàng. Dưới đây là các quy định về việc đổi trả sản phẩm:</p>

        <h3>Điều kiện đổi trả</h3>
        <ul>
            <li>Thời gian đổi trả: trong vòng 7 ngày kể từ ngày nhận hàng</li>
            <li>Sản phẩm phải còn nguyên tem, nhãn, bao bì</li>
            <li>Sản phẩm không có dấu hiệu đã qua sử dụng, không bị hư hỏng do lỗi của người sử dụng</li>
            <li>Phải có hóa đơn mua hàng hoặc các chứng từ liên quan</li>
        </ul>

        <h3>Các trường hợp được đổi trả</h3>
        <ul>
            <li>Sản phẩm bị lỗi sản xuất</li>
            <li>Sản phẩm không đúng kích thước, màu sắc như đã đặt</li>
            <li>Sản phẩm bị hư hại trong quá trình vận chuyển</li>
            <li>Sản phẩm không đúng với mô tả trên website</li>
        </ul>

        <h3>Quy trình đổi trả</h3>
        <ol>
            <li>Liên hệ với bộ phận Chăm sóc Khách hàng qua số điện thoại 0123.456.789 hoặc email support@example.com</li>
            <li>Cung cấp thông tin đơn hàng và lý do đổi trả</li>
            <li>Nhận hướng dẫn về cách thức gửi trả sản phẩm</li>
            <li>Gửi sản phẩm về địa chỉ được chỉ định</li>
            <li>Nhận sản phẩm mới hoặc hoàn tiền sau khi chúng tôi kiểm tra sản phẩm trả lại</li>
        </ol>

        <h3>Hình thức hoàn tiền</h3>
        <ul>
            <li>Hoàn tiền vào tài khoản ngân hàng: 3-5 ngày làm việc</li>
            <li>Hoàn tiền vào ví điện tử: 1-2 ngày làm việc</li>
            <li>Đổi sản phẩm khác có giá trị tương đương hoặc cao hơn (khách hàng thanh toán phần chênh lệch nếu có)</li>
        </ul>

        <h3>Các sản phẩm không áp dụng đổi trả</h3>
        <ul>
            <li>Sản phẩm đã qua sử dụng</li>
            <li>Sản phẩm giảm giá trên 50%</li>
            <li>Sản phẩm trong chương trình khuyến mãi đặc biệt có ghi rõ "không áp dụng đổi trả"</li>
        </ul>

        <p>Mọi thắc mắc về chính sách đổi trả, vui lòng liên hệ với chúng tôi qua số điện thoại 0123.456.789 hoặc email support@example.com.</p>';
    }

    private function getPaymentMethodsContent(): string
    {
        return '<h2>Phương thức thanh toán</h2>
        <p>Chúng tôi cung cấp nhiều phương thức thanh toán khác nhau để mang đến sự thuận tiện cho khách hàng khi mua sắm tại cửa hàng. Dưới đây là các hình thức thanh toán được chấp nhận:</p>

        <h3>Thanh toán khi nhận hàng (COD)</h3>
        <p>Khách hàng có thể thanh toán bằng tiền mặt khi nhận hàng. Vui lòng chuẩn bị đúng số tiền để thuận tiện cho việc giao dịch.</p>

        <h3>Chuyển khoản ngân hàng</h3>
        <p>Khách hàng có thể chuyển khoản vào tài khoản của chúng tôi:</p>
        <ul>
            <li>Ngân hàng: Vietcombank</li>
            <li>Số tài khoản: 1234567890</li>
            <li>Chủ tài khoản: Công ty TNHH Thương mại</li>
            <li>Nội dung chuyển khoản: [Mã đơn hàng] - [Tên khách hàng]</li>
        </ul>

        <h3>Thanh toán qua cổng thanh toán trực tuyến</h3>
        <p>Chúng tôi hỗ trợ thanh toán qua các cổng thanh toán trực tuyến:</p>
        <ul>
            <li>VNPay</li>
            <li>Momo</li>
            <li>ZaloPay</li>
        </ul>

        <h3>Thẻ tín dụng/ghi nợ</h3>
        <p>Chấp nhận các loại thẻ quốc tế và nội địa:</p>
        <ul>
            <li>Visa</li>
            <li>MasterCard</li>
            <li>JCB</li>
            <li>Napas</li>
        </ul>

        <h3>Trả góp</h3>
        <p>Hỗ trợ mua hàng trả góp qua thẻ tín dụng hoặc công ty tài chính với đơn hàng có giá trị từ 3 triệu đồng trở lên. Các đối tác trả góp:</p>
        <ul>
            <li>Công ty tài chính HD Saison</li>
            <li>Công ty tài chính Home Credit</li>
            <li>Trả góp qua thẻ tín dụng: 0% lãi suất từ 3-12 tháng</li>
        </ul>

        <h3>Lưu ý</h3>
        <ul>
            <li>Đối với đơn hàng trả góp, vui lòng chuẩn bị đầy đủ giấy tờ theo yêu cầu của công ty tài chính</li>
            <li>Thời gian xử lý thanh toán có thể khác nhau tùy thuộc vào phương thức thanh toán</li>
            <li>Chúng tôi sẽ thông báo trạng thái thanh toán qua email hoặc SMS</li>
        </ul>

        <p>Nếu có bất kỳ thắc mắc nào về phương thức thanh toán, vui lòng liên hệ với chúng tôi qua số điện thoại 0123.456.789 hoặc email support@example.com.</p>';
    }

    private function getShoppingGuideContent(): string
    {
        return '<h2>Hướng dẫn mua hàng</h2>
        <p>Để giúp quý khách có trải nghiệm mua sắm thuận lợi, chúng tôi xin hướng dẫn chi tiết các bước mua hàng trên website của chúng tôi:</p>

        <h3>Bước 1: Tìm kiếm sản phẩm</h3>
        <ul>
            <li>Sử dụng thanh tìm kiếm ở đầu trang để tìm sản phẩm bạn cần</li>
            <li>Hoặc duyệt qua danh mục sản phẩm từ menu chính</li>
            <li>Lọc sản phẩm theo giá, thương hiệu, đặc tính... để tìm đúng sản phẩm bạn cần</li>
        </ul>

        <h3>Bước 2: Xem thông tin sản phẩm</h3>
        <ul>
            <li>Nhấp vào sản phẩm để xem thông tin chi tiết</li>
            <li>Đọc mô tả, thông số kỹ thuật và đánh giá từ khách hàng khác</li>
            <li>Xem các hình ảnh sản phẩm để có cái nhìn tổng quan</li>
        </ul>

        <h3>Bước 3: Thêm sản phẩm vào giỏ hàng</h3>
        <ul>
            <li>Chọn số lượng sản phẩm cần mua</li>
            <li>Chọn các tùy chọn nếu có (màu sắc, kích thước...)</li>
            <li>Nhấn nút "Thêm vào giỏ hàng"</li>
        </ul>

        <h3>Bước 4: Kiểm tra giỏ hàng</h3>
        <ul>
            <li>Xem lại sản phẩm trong giỏ hàng để đảm bảo đúng sản phẩm, số lượng</li>
            <li>Điều chỉnh số lượng hoặc xóa sản phẩm nếu cần</li>
            <li>Nhập mã giảm giá nếu có</li>
            <li>Nhấn nút "Thanh toán" để tiến hành đặt hàng</li>
        </ul>

        <h3>Bước 5: Nhập thông tin giao hàng</h3>
        <ul>
            <li>Đăng nhập tài khoản nếu đã có, hoặc mua hàng không cần đăng ký</li>
            <li>Điền đầy đủ thông tin giao hàng: họ tên, số điện thoại, địa chỉ</li>
            <li>Chọn phương thức vận chuyển phù hợp</li>
        </ul>

        <h3>Bước 6: Chọn phương thức thanh toán</h3>
        <ul>
            <li>Chọn một trong các phương thức thanh toán có sẵn</li>
            <li>Đối với thanh toán trực tuyến, bạn sẽ được chuyển đến cổng thanh toán</li>
            <li>Đối với COD, bạn sẽ thanh toán khi nhận hàng</li>
        </ul>

        <h3>Bước 7: Hoàn tất đơn hàng</h3>
        <ul>
            <li>Xem lại toàn bộ thông tin đơn hàng</li>
            <li>Nhấn nút "Đặt hàng" để hoàn tất</li>
            <li>Bạn sẽ nhận được email xác nhận đơn hàng</li>
        </ul>

        <h3>Bước 8: Theo dõi đơn hàng</h3>
        <ul>
            <li>Kiểm tra trạng thái đơn hàng trong tài khoản của bạn</li>
            <li>Hoặc sử dụng mã đơn hàng và email để tra cứu</li>
            <li>Bạn sẽ nhận được thông báo khi đơn hàng được xử lý, giao hàng và hoàn tất</li>
        </ul>

        <h3>Lưu ý khi mua hàng</h3>
        <ul>
            <li>Kiểm tra kỹ thông tin sản phẩm trước khi đặt hàng</li>
            <li>Đảm bảo thông tin liên hệ và địa chỉ giao hàng chính xác</li>
            <li>Lưu lại mã đơn hàng để tiện theo dõi</li>
            <li>Kiểm tra email thường xuyên để nhận thông báo về đơn hàng</li>
        </ul>

        <p>Nếu cần hỗ trợ thêm về quy trình mua hàng, vui lòng liên hệ với chúng tôi qua số điện thoại 0123.456.789 hoặc email support@example.com.</p>';
    }

    private function getInspectionPolicyContent(): string
    {
        return '<h2>Chính sách kiểm hàng</h2>
        <p>Để đảm bảo quyền lợi của khách hàng và cung cấp dịch vụ chất lượng cao, chúng tôi có chính sách kiểm hàng cụ thể như sau:</p>

        <h3>Quy trình kiểm hàng trước khi giao</h3>
        <ul>
            <li>Tất cả sản phẩm đều được kiểm tra kỹ lưỡng về chất lượng trước khi đóng gói</li>
            <li>Chúng tôi thực hiện quy trình kiểm hàng 3 bước: kiểm tra xuất kho, kiểm tra đóng gói, kiểm tra trước khi giao</li>
            <li>Mỗi đơn hàng đều có phiếu kiểm hàng kèm theo để xác nhận tình trạng sản phẩm</li>
            <li>Hàng hóa được đóng gói cẩn thận để tránh hư hỏng trong quá trình vận chuyển</li>
        </ul>

        <h3>Quyền kiểm tra hàng của khách hàng</h3>
        <ul>
            <li>Khách hàng có quyền kiểm tra hàng hóa trước khi nhận và thanh toán</li>
            <li>Kiểm tra bên ngoài: Khách hàng được kiểm tra tình trạng bên ngoài của gói hàng</li>
            <li>Kiểm tra nội dung: Khách hàng được mở gói hàng để kiểm tra số lượng và tình trạng sản phẩm</li>
            <li>Thời gian kiểm tra: Tối đa 5 phút tại thời điểm giao hàng (tuân thủ quy định của đơn vị vận chuyển)</li>
        </ul>

        <h3>Quy trình kiểm hàng khi nhận hàng</h3>
        <ol>
            <li>Kiểm tra tình trạng bên ngoài gói hàng, đảm bảo không bị móp méo, rách</li>
            <li>Kiểm tra thông tin người nhận, mã đơn hàng trên gói hàng</li>
            <li>Mở gói hàng và kiểm tra số lượng sản phẩm theo đơn hàng</li>
            <li>Kiểm tra tình trạng sản phẩm, đảm bảo không bị hư hỏng, trầy xước</li>
            <li>Kiểm tra tính năng cơ bản của sản phẩm nếu có thể</li>
            <li>Ký xác nhận vào biên bản giao nhận hàng</li>
        </ol>

        <h3>Xử lý khi phát hiện vấn đề</h3>
        <ul>
            <li>Nếu phát hiện sản phẩm không đúng, bị hư hỏng hoặc khiếm khuyết, khách hàng có quyền từ chối nhận hàng</li>
            <li>Yêu cầu nhân viên giao hàng ghi nhận vấn đề vào biên bản</li>
            <li>Liên hệ ngay với bộ phận Chăm sóc Khách hàng theo số 0123.456.789</li>
            <li>Chúng tôi sẽ xử lý khiếu nại trong vòng 24 giờ làm việc</li>
        </ul>

        <h3>Lưu ý quan trọng</h3>
        <ul>
            <li>Khách hàng vui lòng kiểm tra kỹ trước khi ký nhận hàng</li>
            <li>Sau khi đã ký nhận, nếu phát hiện sản phẩm bị lỗi, vui lòng liên hệ trong vòng 24 giờ</li>
            <li>Đối với sản phẩm điện tử, thời gian kiểm tra có thể kéo dài hơn, vui lòng thông báo trước với nhân viên giao hàng</li>
            <li>Trong trường hợp không thể kiểm tra ngay, khách hàng vui lòng ghi chú "Chưa kiểm tra hàng" khi ký nhận</li>
        </ul>

        <p>Nếu có bất kỳ thắc mắc nào về chính sách kiểm hàng, vui lòng liên hệ với chúng tôi qua số điện thoại 0123.456.789 hoặc email support@example.com.</p>';
    }

    private function getPrivacyPolicyContent(): string
    {
        return '<h2>Chính sách bảo mật</h2>
        <p>Chúng tôi tôn trọng và cam kết bảo vệ thông tin cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

        <h3>Thông tin chúng tôi thu thập</h3>
        <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
        <ul>
            <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng/thanh toán</li>
            <li><strong>Thông tin giao dịch:</strong> Chi tiết về sản phẩm bạn mua, phương thức thanh toán (chúng tôi không lưu trữ thông tin thẻ tín dụng)</li>
            <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị, thời gian truy cập</li>
            <li><strong>Thông tin sử dụng:</strong> Cách bạn sử dụng trang web, sản phẩm bạn xem, trang bạn truy cập</li>
        </ul>

        <h3>Cách chúng tôi thu thập thông tin</h3>
        <ul>
            <li>Thông tin bạn cung cấp khi đăng ký tài khoản, mua hàng hoặc liên hệ với chúng tôi</li>
            <li>Thông tin được thu thập tự động thông qua cookies và công nghệ theo dõi tương tự</li>
            <li>Thông tin từ các nguồn bên thứ ba như đối tác kinh doanh, mạng xã hội (nếu bạn kết nối tài khoản)</li>
        </ul>

        <h3>Mục đích sử dụng thông tin</h3>
        <p>Chúng tôi sử dụng thông tin của bạn để:</p>
        <ul>
            <li>Xử lý và giao đơn hàng của bạn</li>
            <li>Quản lý tài khoản của bạn</li>
            <li>Gửi thông báo về đơn hàng hoặc thay đổi trong điều khoản dịch vụ</li>
            <li>Cải thiện sản phẩm và dịch vụ của chúng tôi</li>
            <li>Cá nhân hóa trải nghiệm mua sắm của bạn</li>
            <li>Gửi thông tin quảng cáo, khuyến mãi (nếu bạn đồng ý)</li>
            <li>Phân tích xu hướng và thống kê người dùng</li>
            <li>Ngăn chặn gian lận và bảo vệ an ninh trang web</li>
        </ul>

        <h3>Chia sẻ thông tin</h3>
        <p>Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</p>
        <ul>
            <li><strong>Đối tác dịch vụ:</strong> Đơn vị vận chuyển, xử lý thanh toán, hỗ trợ khách hàng</li>
            <li><strong>Đối tác kinh doanh:</strong> Nhà cung cấp sản phẩm, đối tác marketing (chỉ khi cần thiết)</li>
            <li><strong>Yêu cầu pháp lý:</strong> Tuân thủ luật pháp, quy định hoặc quy trình pháp lý</li>
            <li><strong>Bảo vệ quyền lợi:</strong> Bảo vệ quyền, tài sản hoặc an toàn của chúng tôi, khách hàng hoặc người khác</li>
        </ul>
        <p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba cho mục đích tiếp thị mà không có sự đồng ý của bạn.</p>

        <h3>Bảo mật thông tin</h3>
        <p>Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn:</p>
        <ul>
            <li>Sử dụng mã hóa SSL để bảo vệ thông tin trong quá trình truyền tải</li>
            <li>Giới hạn quyền truy cập vào thông tin cá nhân chỉ cho nhân viên có nhu cầu công việc</li>
            <li>Duy trì các hệ thống bảo mật và phòng chống xâm nhập</li>
            <li>Thường xuyên đánh giá và cập nhật các biện pháp bảo mật</li>
        </ul>

        <h3>Quyền của khách hàng</h3>
        <p>Theo quy định của pháp luật, bạn có các quyền sau đối với thông tin cá nhân:</p>
        <ul>
            <li>Quyền truy cập và nhận bản sao thông tin của bạn</li>
            <li>Quyền yêu cầu chỉnh sửa thông tin không chính xác</li>
            <li>Quyền yêu cầu xóa thông tin trong một số trường hợp</li>
            <li>Quyền hạn chế hoặc phản đối việc xử lý thông tin</li>
            <li>Quyền rút lại sự đồng ý bất kỳ lúc nào</li>
            <li>Quyền khiếu nại với cơ quan bảo vệ dữ liệu</li>
        </ul>

        <h3>Cookies và công nghệ theo dõi</h3>
        <p>Chúng tôi sử dụng cookies và công nghệ tương tự để cải thiện trải nghiệm của bạn. Bạn có thể kiểm soát cookies thông qua cài đặt trình duyệt.</p>

        <h3>Thay đổi chính sách bảo mật</h3>
        <p>Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Bất kỳ thay đổi nào sẽ được đăng trên trang này với ngày cập nhật mới.</p>

        <h3>Liên hệ</h3>
        <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ:</p>
        <ul>
            <li>Email: privacy@example.com</li>
            <li>Điện thoại: 0123.456.789</li>
            <li>Địa chỉ: 123 Nguyễn Văn A, Quận 1, TP.HCM</li>
        </ul>

        <p><em>Cập nhật lần cuối: Ngày 01 tháng 04 năm 2025</em></p>';
    }

    private function getGeneralPolicyContent(): string
    {
        return '<h2>Chính sách và quy định chung</h2>
        <p>Chào mừng quý khách đến với website của chúng tôi. Khi sử dụng dịch vụ trên website này, quý khách đồng ý tuân thủ các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.</p>

        <h3>1. Giới thiệu</h3>
        <p>Website này thuộc sở hữu và vận hành bởi Công ty TNHH Thương mại. Các điều khoản này quy định việc sử dụng website và tất cả các dịch vụ có liên quan.</p>

        <h3>2. Quyền sử dụng</h3>
        <ul>
            <li>Quý khách có thể truy cập và sử dụng website này cho mục đích cá nhân và không vi phạm pháp luật</li>
            <li>Quý khách không được sao chép, sửa đổi, phân phối, xuất bản nội dung của website mà không có sự cho phép bằng văn bản của chúng tôi</li>
            <li>Quý khách không được can thiệp vào hệ thống hoặc cố gắng truy cập trái phép vào hệ thống của chúng tôi</li>
        </ul>

        <h3>3. Tài khoản khách hàng</h3>
        <ul>
            <li>Khi đăng ký tài khoản, quý khách phải cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
            <li>Quý khách chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu</li>
            <li>Quý khách chịu trách nhiệm về tất cả hoạt động diễn ra dưới tài khoản của mình</li>
            <li>Chúng tôi có quyền từ chối phục vụ, đóng tài khoản hoặc hủy đơn hàng nếu phát hiện vi phạm điều khoản</li>
        </ul>

        <h3>4. Đặt hàng và thanh toán</h3>
        <ul>
            <li>Khi đặt hàng, quý khách cam kết có đủ năng lực hành vi dân sự để thực hiện giao dịch</li>
            <li>Chúng tôi có quyền từ chối hoặc hủy đơn hàng vì bất kỳ lý do gì, bao gồm nhưng không giới hạn: sản phẩm hết hàng, phát hiện gian lận, lỗi giá cả</li>
            <li>Quý khách phải thanh toán đầy đủ cho sản phẩm theo phương thức và thời hạn đã chọn</li>
            <li>Chúng tôi có quyền thay đổi giá cả, khuyến mãi vào bất kỳ lúc nào mà không cần thông báo trước</li>
        </ul>

        <h3>5. Sản phẩm và dịch vụ</h3>
        <ul>
            <li>Chúng tôi nỗ lực cung cấp thông tin chính xác về sản phẩm, tuy nhiên không đảm bảo tất cả thông tin đều hoàn toàn chính xác</li>
            <li>Hình ảnh sản phẩm có thể khác biệt nhỏ so với sản phẩm thực tế do điều kiện chụp ảnh, hiệu ứng màu sắc</li>
            <li>Chúng tôi có quyền thay đổi thông tin sản phẩm, dịch vụ mà không cần thông báo trước</li>
            <li>Chúng tôi không chịu trách nhiệm nếu sản phẩm hết hàng hoặc ngừng kinh doanh</li>
        </ul>

        <h3>6. Bảo hành sản phẩm</h3>
        <ul>
            <li>Thời hạn bảo hành và điều kiện bảo hành được nêu rõ trong phiếu bảo hành đi kèm với từng sản phẩm</li>
            <li>Chúng tôi không chịu trách nhiệm bảo hành trong các trường hợp: sản phẩm bị hư hỏng do sử dụng không đúng cách, tai nạn, tự ý sửa chữa</li>
            <li>Khách hàng cần giữ hóa đơn và phiếu bảo hành để được hỗ trợ khi cần thiết</li>
        </ul>

        <h3>7. Quyền sở hữu trí tuệ</h3>
        <ul>
            <li>Tất cả nội dung trên website bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, biểu tượng, âm thanh, phần mềm... đều thuộc quyền sở hữu của chúng tôi hoặc các đối tác cung cấp nội dung</li>
            <li>Quý khách không được sử dụng bất kỳ nội dung nào từ website mà không có sự cho phép bằng văn bản của chúng tôi</li>
        </ul>

        <h3>8. Giới hạn trách nhiệm</h3>
        <ul>
            <li>Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website và dịch vụ của chúng tôi</li>
            <li>Chúng tôi không đảm bảo website hoạt động liên tục, không bị gián đoạn hoặc không có lỗi</li>
            <li>Chúng tôi không chịu trách nhiệm về nội dung, sản phẩm hoặc dịch vụ của bên thứ ba được liên kết trên website của chúng tôi</li>
        </ul>

        <h3>9. Thay đổi điều khoản</h3>
        <p>Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Quý khách có trách nhiệm thường xuyên kiểm tra các điều khoản để cập nhật những thay đổi. Việc tiếp tục sử dụng website sau khi thay đổi được đăng tải đồng nghĩa với việc quý khách chấp nhận những thay đổi đó.</p>

        <h3>10. Luật áp dụng</h3>
        <p>Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.</p>

        <h3>Liên hệ</h3>
        <p>Nếu quý khách có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua:</p>
        <ul>
            <li>Email: support@example.com</li>
            <li>Điện thoại: 0123.456.789</li>
            <li>Địa chỉ: 123 Nguyễn Văn A, Quận 1, TP.HCM</li>
        </ul>

        <p><em>Cập nhật lần cuối: Ngày 01 tháng 04 năm 2025</em></p>';
    }
}
