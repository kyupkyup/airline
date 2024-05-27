import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, updateDoc, increment } from "firebase/firestore";
import { useFirebaseContext } from "../../../context/Firebase";
import dayjs from 'dayjs';
import useOnChange from '../../../hooks/useChange'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useUserContext } from "../../../context/User";
import { useNavigate } from "react-router-dom";

const MoimUpdate = () => {
    const { id: moimId } = useParams()
    const [moim, setMoim] = useState()
    const { db } = useFirebaseContext()
    const { user } = useUserContext();
    const navigate = useNavigate();

    const [name, handleNameChange] = useOnChange(moim?.name);
    console.log(moim?.targetDate, 'asdfasdfasdfasdf')
    const [targetDate, handleTargetDateChange] = useState(moim?.targetDate);
    const [place, handlePlaceChange] = useOnChange(moim?.place);
    const [price, handlePriceChange] = useOnChange(moim?.price);
    const [attendanceLimit, handleLimitChange] = useOnChange(moim?.attendanceLimit);
    console.log(name)
    console.log(moim?.name, 'moim')

    const update = useCallback(async () => {
        if (!name || !place || !price || !targetDate || !attendanceLimit) {
            alert('빈칸이 있습니다.')
            return;
        }
        try {
            const dbRef = collection(db, "moim");
            const moimRef = doc(dbRef, moimId)

            const newData = {
                name,
                place,
                price: price,
                targetDate: targetDate.valueOf(),
                attendanceLimit: Number(attendanceLimit),
            };

            // 'items' 컬렉션 내의 'new-item-id' 문서에 데이터를 설정하여 새로운 문서 생성
            await updateDoc(moimRef, newData, { merge: true });
            navigate(`/moim/${moimId}`)
            alert('모임 수정 완료')
        }
        catch (e) {
            console.log(e)
            alert('모임 수정 실패')
        }
    }, [user, name, targetDate, place, price, attendanceLimit])

    const getMoimDoc = async () => {
        const docRef = doc(db, "moim", moimId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const result = await docSnap.data();
            setMoim(result)
            handleTargetDateChange(result.targetDate)
        }
        else {
            alert('오류 발생')
            navigate('/moim')
        }
    }

    useEffect(() => {
        if (!moim) {
            getMoimDoc();
        }
    }, [moim])

    return <div className="route-container write-container">
        <div>
            <input className='input-write' type="text" value={name} onChange={handleNameChange} />
            <div className='calendar'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker label="Controlled picker" defaultValue={dayjs(targetDate)} value={dayjs(targetDate)} onChange={(newValue) => handleTargetDateChange(newValue)} />
                    </DemoContainer>
                </LocalizationProvider>
            </div>
            <input className='input-write' type="text" value={place} onChange={handlePlaceChange} />
            <input className='input-write' type="text" value={price} onChange={handlePriceChange} />
            <input className='input-write' type="number" value={attendanceLimit} onChange={handleLimitChange} />
        </div>
        <button className="btn-active" onClick={update}>
            모임 수정하기
        </button>

    </div>
}

export default MoimUpdate
