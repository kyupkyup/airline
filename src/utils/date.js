import dayjs from "dayjs";

export const convertMillisToDateAndTime = (millis) => {
    // dayjs 인스턴스 생성
    const date = dayjs(millis);

    // 날짜와 시간 포맷
    const formattedDate = date.format('YYYY-MM-DD'); // 현재 날짜
    const formattedTime = date.format('HH:mm:ss');  // 현재 시간

    return {
        date: formattedDate,
        time: formattedTime,
    };
};