import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export default forwardRef(function TextInput(
  {
    type = 'text',
    className = '',
    isFocused = false,
    errorMessage = 'Vui lòng nhập thông tin này', // Thêm prop errorMessage
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & {
    isFocused?: boolean,
    errorMessage?: string // Thêm type cho errorMessage
  },
  ref,
) {
  const localRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }

    // Thêm đoạn code xử lý thông báo lỗi tùy chỉnh
    if (localRef.current) {
      localRef.current.setAttribute('oninvalid', `this.setCustomValidity('${errorMessage}')`);
      localRef.current.setAttribute('oninput', `this.setCustomValidity('')`);
    }
  }, [isFocused, errorMessage]); // Thêm errorMessage vào dependency

  return (
    <input
      {...props}
      type={type}
      className={
        `input input-bordered ` + className }
      ref={localRef}
    />
  );
});
