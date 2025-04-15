<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    /**
     * Hiển thị trang giới thiệu
     */
    public function index()
    {
        $team = $this->getTeamMembers();
        $testimonials = $this->getTestimonials();
        $milestones = $this->getMilestones();

        return Inertia::render('About/Index', [
            'team' => $team,
            'testimonials' => $testimonials,
            'milestones' => $milestones,
        ]);
    }

    /**
     * Lấy danh sách thành viên đội ngũ
     */
    private function getTeamMembers()
    {
        return [
            [
                'id' => 1,
                'name' => 'Ông Nguyễn Xuân Mạnh',
                'position' => 'Nhà sáng lập & Giám đốc điều hành',
                'image' => '/images/team/founder.jpg',
                'bio' => 'Với hơn 15 năm kinh nghiệm trong ngành yến sào, ông Mạnh đã xây dựng Yến sào Xuân Mạnh trở thành thương hiệu uy tín hàng đầu.',
            ],
            [
                'id' => 2,
                'name' => 'Bà Trần Thị Minh',
                'position' => 'Giám đốc sản xuất',
                'image' => '/images/team/production-director.jpg',
                'bio' => 'Chuyên gia về quy trình sản xuất, kiểm soát chất lượng và phát triển sản phẩm mới.',
            ],
            [
                'id' => 3,
                'name' => 'Ông Lê Văn Hùng',
                'position' => 'Giám đốc kinh doanh',
                'image' => '/images/team/business-director.jpg',
                'bio' => 'Phụ trách mở rộng thị trường và phát triển kênh phân phối trong nước và quốc tế.',
            ],
            [
                'id' => 4,
                'name' => 'Bà Phạm Thu Hà',
                'position' => 'Trưởng phòng R&D',
                'image' => '/images/team/rd-manager.jpg',
                'bio' => 'Dẫn dắt đội ngũ nghiên cứu và phát triển sản phẩm mới, tối ưu hóa công thức.',
            ],
        ];
    }

    /**
     * Lấy danh sách đánh giá từ khách hàng
     */
    private function getTestimonials()
    {
        return [
            [
                'id' => 1,
                'name' => 'Chị Nguyễn Thị Lan',
                'title' => 'Khách hàng thân thiết',
                'content' => 'Yến sào Xuân Mạnh là sản phẩm tôi tin dùng hơn 5 năm qua. Chất lượng luôn ổn định, dịch vụ tuyệt vời và tôi cảm nhận được sự khác biệt rõ rệt về sức khỏe.',
                'avatar' => '/images/testimonials/customer1.jpg',
                'rating' => 5,
            ],
            [
                'id' => 2,
                'name' => 'Anh Trần Minh Đức',
                'title' => 'CEO công ty ABC',
                'content' => 'Sản phẩm yến sào Xuân Mạnh là lựa chọn hàng đầu của tôi khi tìm kiếm quà tặng cho đối tác và khách hàng. Bao bì sang trọng, chất lượng đảm bảo.',
                'avatar' => '/images/testimonials/customer2.jpg',
                'rating' => 5,
            ],
            [
                'id' => 3,
                'name' => 'Bác sĩ Lê Minh Tuấn',
                'title' => 'Chuyên gia dinh dưỡng',
                'content' => 'Với kinh nghiệm 20 năm trong lĩnh vực dinh dưỡng, tôi đánh giá cao chất lượng và độ tinh khiết của yến sào Xuân Mạnh. Sản phẩm đạt tiêu chuẩn cao về giá trị dinh dưỡng.',
                'avatar' => '/images/testimonials/doctor.jpg',
                'rating' => 5,
            ],
        ];
    }

    /**
     * Lấy các cột mốc quan trọng của công ty
     */
    private function getMilestones()
    {
        return [
            [
                'year' => '2010',
                'title' => 'Thành lập công ty',
                'description' => 'Yến sào Xuân Mạnh được thành lập với tầm nhìn mang đến sản phẩm yến sào chất lượng cao cho người tiêu dùng Việt Nam.',
            ],
            [
                'year' => '2013',
                'title' => 'Khai trương nhà yến đầu tiên',
                'description' => 'Xây dựng thành công nhà nuôi yến đầu tiên tại tỉnh Khánh Hòa, áp dụng công nghệ hiện đại.',
            ],
            [
                'year' => '2015',
                'title' => 'Mở rộng quy mô',
                'description' => 'Phát triển thêm 5 nhà yến mới tại các tỉnh miền Trung, nâng cao năng lực sản xuất.',
            ],
            [
                'year' => '2017',
                'title' => 'Xuất khẩu quốc tế',
                'description' => 'Sản phẩm yến sào Xuân Mạnh chính thức được xuất khẩu sang thị trường châu Á.',
            ],
            [
                'year' => '2019',
                'title' => 'Công nghệ hiện đại',
                'description' => 'Đầu tư hệ thống chế biến và đóng gói hiện đại, đạt chuẩn ISO 22000 và HACCP.',
            ],
            [
                'year' => '2021',
                'title' => 'Đa dạng sản phẩm',
                'description' => 'Phát triển dòng sản phẩm yến sào cao cấp kết hợp với các dược liệu quý từ thiên nhiên.',
            ],
            [
                'year' => '2023',
                'title' => 'Thương hiệu hàng đầu',
                'description' => 'Yến sào Xuân Mạnh được vinh danh trong Top 10 thương hiệu yến sào uy tín tại Việt Nam.',
            ],
        ];
    }
}
