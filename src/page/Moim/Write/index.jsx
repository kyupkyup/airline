import { useState, useCallback } from 'react'
import { addDoc, collection } from "firebase/firestore";
import { useFirebaseContext } from "../../../context/Firebase";
import { useUserContext } from "../../../context/User";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import useOnChange from '../../../hooks/useChange'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const Write = () => {
    const { db } = useFirebaseContext();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [name, handleNameChange] = useOnChange();
    const [date, handleDateChange] = useOnChange();
    const [targetDate, handleTargetDateChange] = useState(dayjs(new Date()));
    const [place, handlePlaceChange] = useOnChange();
    const [price, handlePriceChange] = useOnChange();
    const [attendanceLimit, handleLimitChange] = useOnChange();

    const write = useCallback(async () => {
        if (!name || !place || !price || !targetDate || !attendanceLimit) {
            alert('빈칸이 있습니다.')
            return;
        }
        try {
            const newMoim = collection(db, 'moim'); // 'items' 컬렉션 내의 'new-item-id' 문서에 대한 참조 생성

            const newData = {
                name,
                date: dayjs().valueOf(),
                place,
                price: price,
                targetDate: targetDate.valueOf(),
                user: user,
                attendanceLimit: Number(attendanceLimit),
                attendance: [],
                host: user.uid,
                isPrizedOut: false,
                rank: {
                    first: {},
                    second: {},
                    third: {},
                    fourth: {}
                }
            };

            // 'items' 컬렉션 내의 'new-item-id' 문서에 데이터를 설정하여 새로운 문서 생성
            await addDoc(newMoim, newData);
            navigate('/')
            alert('모임 생성 완료')
        }
        catch (e) {
            console.log(e)
            alert('모임 생성 실패')
        }
    }, [user, name, date, targetDate, place, price, attendanceLimit])

    return <div className="route-container write-container">
        <div>
            <input className='input-write' type="text" value={name} onChange={handleNameChange} placeholder='모임 이름' />
            <div className='calendar'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker label="Controlled picker" value={targetDate} onChange={(newValue) => handleTargetDateChange(newValue)} />
                    </DemoContainer>
                </LocalizationProvider>
            </div>

            <input className='input-write' type="text" value={place} onChange={handlePlaceChange} placeholder='모임 장소' />
            <input className='input-write' type="text" value={price} onChange={handlePriceChange} placeholder='비용' />
            <input className='input-write' type="number" value={attendanceLimit} onChange={handleLimitChange} placeholder='제한인원' />
        </div>
        <button className="btn-active" onClick={write}>
            모임 만들기
        </button>
    </div>

}

export default Write;
