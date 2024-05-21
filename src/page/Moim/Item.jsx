import { useUserContext } from "../../context/User";
import { useFirebaseContext } from "../../context/Firebase";
import { arrayContainsUser, removeObjectFromArray } from '../../utils/string'
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MoimItem = ({ idProps, moimDataProps }) => {
    const [moim, setMoim] = useState(moimDataProps);
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isAttend, setAttend] = useState();
    const { db } = useFirebaseContext()


    const attend = useCallback(async (id, moimObj) => {
        const moimRef = doc(db, "moim", id);
        if (moimObj.attendanceLimit <= moimObj.attendance.length) {
            alert('정원 초과')
            return;
        }

        await updateDoc(moimRef, {
            attendance: [...moimObj.attendance, { ...user, buyIn: 0 }]
        });
        setMoim({
            ...moim, attendance: [...moimObj.attendance, user]
        })
        setAttend(true)
    }, [db, moim, user])

    const cancelAttend = useCallback(async (id, moimObj) => {
        const confirmed = window.confirm('참석 취소를 하실 경우, 바이인을 환불 받을 수 없습니다. 그래도 진행하시겠습니까?')
        if (!confirmed) return;
        const moimRef = doc(db, "moim", id);
        const newAttendance = removeObjectFromArray(moimObj.attendance, user)

        await updateDoc(moimRef, {
            attendance: newAttendance
        });
        setMoim({
            ...moim, attendance: newAttendance
        })
        setAttend(false)
    }, [db, moim, user])

    const navigateSpecific = () => {
        navigate(`/moim/${idProps}`)
    }

    useEffect(() => {
        if (moim && user) {
            setAttend(arrayContainsUser(moim.attendance, user))
        }
    }, [user, moim])

    return <li key={idProps}>
        <div onClick={navigateSpecific}>
            이름 : {moim.name}
            시간 : {moim.date.seconds}
            장소 : {moim.place}
            비용 : {moim.price}
            참석인원 : {moim.attendance.map(attender => attender && <img src={attender.photoUrl} />)}
        </div>

        {isAttend ? <button onClick={() => cancelAttend(idProps, moim)}>취소</button> : <button onClick={() => attend(idProps, moim)}>참석</button>
        }
    </li >
}

export default MoimItem