export function objectsAreEqual(obj1, obj2) {

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 두 객체의 키의 수가 다르면 false를 반환
    if (keys1.length !== keys2.length) {
        return false;
    }

    // 모든 키가 일치하는지 확인
    for (let key of keys1) {
        // 키가 존재하지 않거나 값이 다르면 false를 반환
        if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
            return false;
        }
    }

    // 모든 키와 값이 일치하면 true를 반환
    return true;
}

export function objectsAreUser(obj1, obj2) {

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 두 객체의 키의 수가 다르면 false를 반환
    if (keys1.uid === keys2.uid) {
        return true;
    }
    // 모든 키와 값이 일치하면 true를 반환
    return false;
}



export function arrayContainsObject(array, targetObject) {
    // 배열의 각 요소를 반복하여 targetObject와 동일한지를 비교
    for (let obj of array) {
        // targetObject와 obj가 동일한지를 확인
        if (objectsAreEqual(obj, targetObject)) {
            return true; // 동일한 객체가 발견되면 true 반환
        }
    }
    // 배열 안에 동일한 객체가 없으면 false 반환
    return false;
}


export function arrayContainsUser(array, targetObject) {
    // 배열의 각 요소를 반복하여 targetObject와 동일한지를 비교
    for (let obj of array) {

        // targetObject와 obj가 동일한지를 확인
        if (objectsAreUser(obj, targetObject)) {
            return true; // 동일한 객체가 발견되면 true 반환
        }
    }
    // 배열 안에 동일한 객체가 없으면 false 반환
    return false;
}

export function arrayContainsUserReturnObj(array, targetObject) {

    // 배열의 각 요소를 반복하여 targetObject와 동일한지를 비교
    for (let obj of array) {
        // targetObject와 obj가 동일한지를 확인
        if (objectsAreUser(obj, targetObject)) {
            return obj; // 동일한 객체가 발견되면 true 반환
        }
    }
    // 배열 안에 동일한 객체가 없으면 false 반환
    return false;
}

export function removeObjectFromArray(array, targetObject) {
    // 배열을 반복하면서 targetObject와 동일한 객체를 찾음
    for (let i = 0; i < array.length; i++) {
        if (objectsAreUser(array[i], targetObject)) {
            // 동일한 객체를 발견하면 해당 인덱스의 요소를 삭제
            array.splice(i, 1);

            // 한 번에 하나의 요소만 삭제하기 위해 바로 종료
            return array;
        }
    }
    return array;
}