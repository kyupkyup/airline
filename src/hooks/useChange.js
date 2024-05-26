import { useState, useCallback, useEffect } from 'react';

const useOnChange = (initialValue = '') => {
    const [value, setValue] = useState(initialValue);

    // useCallback을 사용하여 핸들러 함수를 최적화
    const handleChange = useCallback((event) => {
        setValue(event.target.value);
    }, [setValue]);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    // 값을 반환하는 대신, handleChange 함수를 반환하여 필요에 따라 컴포넌트에서 사용할 수 있도록 함
    return [value, handleChange];
};

export default useOnChange;