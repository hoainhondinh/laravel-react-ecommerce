<tr>
    <td>
        <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="content-cell" align="center">
                    {{ Illuminate\Mail\Markdown::parse($slot) }}
                    <p style="margin-top: 15px; color: #9E7A47;">© {{ date('Y') }} {{ config('app.name') }}. Tất cả các quyền được bảo lưu.</p>
                </td>
            </tr>
        </table>
    </td>
</tr>
