$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('d:\HocDiThangDauBuoi\TTTN\BaoCao_TTTN_NguyenAnhViet_2123110288.docx')
$text = $doc.Content.Text
$doc.Close()
$word.Quit()
$text | Out-File -FilePath 'd:\HocDiThangDauBuoi\TTTN\hotel-booking\baocao_text.txt' -Encoding UTF8
Write-Host "Done"
