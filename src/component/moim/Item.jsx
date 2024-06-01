import { useUserContext } from "../../context/User";
import { useFirebaseContext } from "../../context/Firebase";
import { arrayContainsUser, removeObjectFromArray } from '../../utils/string'
import {doc, updateDoc, arrayUnion, getDoc} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import 'dayjs/locale/ko'

const MoimItem = ({ idProps, moimDataProps }) => {
    const [moim, setMoim] = useState(moimDataProps);
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isAttend, setAttend] = useState();
    const { db } = useFirebaseContext()


    const attend = useCallback(async (id) => {
        const moimRef = doc(db, "moim", id);
        const moimSnapShot = await getDoc(moimRef)
        const moimData = await moimSnapShot.data()
        if(moimSnapShot.exists()){
            console.log(moimData)
            if (moimData.attendanceLimit <= moimData.attendance.length + 1) {
                alert('정원 초과')
                return;
            }

            await updateDoc(moimRef, {
                attendance: arrayUnion({ user, buyIn: 0})
            });
            setMoim({
                ...moim, attendance: [...moimData.attendance, {user, buyIn: 0}]
            })
            setAttend(true)
        }
    }, [db, moim, user])

    const cancelAttend = useCallback(async (id) => {

        const confirmed = window.confirm('참석 취소를 하실 경우, 바이인을 환불 받을 수 없습니다. 그래도 진행하시겠습니까?')
        if (!confirmed) return;
        const moimRef = doc(db, "moim", id);
        const moimSnapShot = await getDoc(moimRef)
        const moimData = await moimSnapShot.data()
        if(moimSnapShot.exists()){
            const newAttendance = removeObjectFromArray(moimData.attendance, user)

            console.log(newAttendance)
            await updateDoc(moimRef, {
                attendance: newAttendance
            });
            setMoim({
                ...moimData, attendance: newAttendance
            })
            setAttend(false)
        }
    }, [db, moim, user])

    const navigateSpecific = () => {
        navigate(`/moim/${idProps}`)
    }

    useEffect(() => {
        if (moim && user) {
            setAttend(arrayContainsUser(moim.attendance, user))
        }
    }, [user, moim])

    return <>
        <li key={idProps} style={{ position: "relative" }}>
            {moim.isPrizedOut && <div className="prized-out" onClick={navigateSpecific}>
                프라이즈 아웃 완료
            </div>}
            <div onClick={navigateSpecific} className="moim-specific">
                <div>{String(dayjs(moim.targetDate).locale('ko').format('YY.MM.DD ddd HH:mm'))}</div>
                <div className="title">{moim.name}</div>
                <div><p>장소</p>    {moim.place}</div>
                <div><p>비용</p>      {moim.price}</div>
                <div className="attenders">참석자</div>
                <div className="attenders-container">
                {moim.attendance.map(attender => attender &&
                    <div className="attender">
                        <><img src={attender?.user?.photoUrl} className="profile" referrerPolicy="no-referrer"/><b
                            className="profile-name">{(attender?.user?.userName)}</b></>
                    </div>
                )}
                </div>
            </div>

            {
                isAttend ? <button disabled={moim.isPrizedOut} className="attend-btn cancel" onClick={() => cancelAttend(idProps, moim)}>취소</button> : <button className="attend-btn" disabled={moim.isPrizedOut} onClick={() => attend(idProps, moim)}>참석</button>
            }
        </li >
    </>
}

export default MoimItem
