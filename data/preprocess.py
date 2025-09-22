import pandas as pd
import sys
import os

currect_dir = os.getcwd()
file_path = 'D:/University/Nam4HK1/AdvancedDatabase/FinalProject/data/BX_Books.csv'
output_path = 'D:/University/Nam4HK1/AdvancedDatabase/FinalProject/data/BX-Books_cleaned.csv'

# Xác định các tham số đọc CSV phù hợp với định dạng của tệp Book-Crossing
# sep=";": Sử dụng dấu chấm phẩy làm ký tự phân cách.
# encoding='ISO-8859-1' hoặc 'CP1252': Tệp này không được mã hóa bằng UTF-8,
# nên ta cần chỉ định mã hóa chính xác để tránh lỗi UnicodeDecodeError.
# escapechar='\\': Xử lý các ký tự đặc biệt được thoát hiểm, như dấu " trong tiêu đề.
# on_bad_lines='warn': Báo lỗi nhưng vẫn tiếp tục xử lý, và in ra dòng bị lỗi.
try:
    print("Bắt đầu xử lý file dữ liệu...")
    
    # Đọc tệp CSV với các tham số xử lý lỗi
    df = pd.read_csv(
        file_path, 
        sep=';', 
        encoding='ISO-8859-1', 
        escapechar='\\',
        on_bad_lines='warn'
    )
    
    print("\nQuá trình làm sạch dữ liệu hoàn tất.")
    print(f"Tổng số dòng dữ liệu đã được làm sạch: {len(df)}")
    
    # Ghi DataFrame đã làm sạch vào một tệp CSV mới với mã hóa UTF-8
    df.to_csv(output_path, index=False, encoding='utf-8')
    
    print(f"Tệp đã làm sạch được lưu tại: {output_path}")

except FileNotFoundError:
    print(f"Lỗi: Không tìm thấy tệp tại đường dẫn: {file_path}")
except UnicodeDecodeError as e:
    print(f"Lỗi mã hóa dữ liệu: {e}")
    print("Vui lòng thử các mã hóa khác như 'latin1' hoặc 'CP1252'.")
except Exception as e:
    print(f"Đã xảy ra lỗi không xác định: {e}")