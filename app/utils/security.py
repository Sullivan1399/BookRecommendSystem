from passlib.context import CryptContext

# Tạo context cho việc hash/verify password
pwd_context = CryptContext(
    schemes=["bcrypt"],  # thuật toán mã hóa
    deprecated="auto"    # auto upgrade nếu có thuật toán cũ
)

def hash_password(password: str) -> str:
    """Mã hóa mật khẩu"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu khi login"""
    return pwd_context.verify(plain_password, hashed_password)
