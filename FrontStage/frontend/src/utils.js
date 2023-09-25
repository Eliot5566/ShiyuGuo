export function validateEmail(email) {
  // 使用正則表達式檢查電子郵件地址格式
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
