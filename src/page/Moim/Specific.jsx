import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebaseContext } from "../../context/Firebase";
import { useUserContext } from "../../context/User";
import { arrayContainsUser, removeObjectFromArray, arrayContainsUserReturnObj } from '../../utils/string'
import Rank from '../../component/moim/Rank'
import dayjs from "dayjs";
import 'dayjs/locale/ko'

const MoimSpecific = () => {
    const { id: moimId } = useParams()
    const { db } = useFirebaseContext()
    const navigate = useNavigate();
    const [moim, setMoim] = useState()
    const { user, usageBuyIn, setUser } = useUserContext();
    const [isAttend, setAttend] = useState(false);
    const [isHost, setHost] = useState(false)

    const getMoimDoc = async () => {
        const docRef = doc(db, "moim", moimId);
        const docSnap = await getDoc(docRef);

        if (await docSnap.exists()) {
            setMoim(docSnap.data())
        }
        else {
            setMoim({
                name: '',
                date: null,
                attendanceLimit: 0,
                host: '',
                place: '',
                price: '',
                user: null,
                targetDate: null,
                attendance: [],
                isPrizedOut: false,
                rank: {
                    first: null,
                    second: null,
                    third: null,
                    fourth: null
                }
            })
        }
    }

    const buyIn = async () => {
        try {
            const userDocRef = doc(db, 'users', user.uid)
            const moimDocRef = doc(db, 'moim', moimId)
            const userDocSnap = await getDoc(userDocRef)
            const tickets = Number(prompt('바이인할 티켓을 입력해주세요.'))

            if (typeof tickets !== 'number' || isNaN(tickets) || tickets < 0) {
                alert('양수인 숫자만 입력해주세요.')
                return;
            }
            if (!tickets) return;

            if (userDocSnap.data().buyIn < tickets) {
                alert('바이인권이 모자랍니다.')
                return;
            }

            await updateDoc(userDocRef, { buyIn: increment(-tickets), usedBuyIn: increment(tickets) })
            const attendance = arrayContainsUserReturnObj(moim.attendance, user)
            const newAttendance = removeObjectFromArray(moim.attendance, user)
            newAttendance.push({ user, buyIn: attendance.buyIn + tickets })

            await updateDoc(moimDocRef, {
                attendance: newAttendance
            })
            setMoim({
                ...moim, attendance: newAttendance
            })
            usageBuyIn(tickets)

            alert('바이인이 완료되었습니다.')
        }
        catch (e) {
            console.log(e)
        }
    }

    const provideTicket = async (attenderId) => {
        if (moim.isPrizedOut) {
            alert('이미 프라이즈아웃된 모임입니다.')
            return;
        }
        if (!isHost) {
            alert('호스트만 티켓을 지급할 수 있습니다.')
            return;
        }
        const tickets = prompt('지급할 티켓을 입력해주세요. 티켓을 회수할 경우 음수를 입력해주세요.')
        if (!tickets) return;
        if (typeof Number(tickets) !== 'number' || isNaN(Number(tickets))) {
            alert('숫자만 입력해주세요.')
            return;
        }
        const userDocRef = doc(db, 'users', attenderId)
        const userDocSnap = await getDoc(userDocRef)

        if (Number(tickets) < 0 && userDocSnap.data().buyIn < Number(tickets)) {
            alert('회수할 바이인권이 모자랍니다.')
            return;
        }

        await updateDoc(userDocRef, {
            buyIn: increment(Number(tickets))
        })
        setUser({ ...user, buyIn: user.buyIn + Number(tickets) })
        alert(`지급/회수가 완료되었습니다. ${tickets} 장`)
    }

    const pageToUpdate = (moimId) => {
        navigate(`/moim/update/${moimId}`)
    }

    useEffect(() => {
        if (!moim) {
            getMoimDoc();
        }

        if (user && moim) {
            setAttend(arrayContainsUser(moim.attendance, user))
            setHost(moim.host === user.uid)
        }
    }, [moim, user])

    return <div className="route-container moim-container">
        {moim && <div className="moim-box">
            <div>
                <div>{String(dayjs(moim.targetDate).locale('ko').format('YY.MM.DD ddd HH:mm'))}</div>
                <div className="title">{moim.name}</div>
                <div><p>장소</p>    {moim.place}</div>
                <div><p>비용</p>      {moim.price}</div>
                <div className="attenders">참석자</div>
                <div className="attenders-container">
                {moim.attendance.map(attender =>{
                    console.log(attender)
                    return  <div className="attender"><img src={attender.user.photoUrl} referrerPolicy="no-referrer" className="profile"
                        onClick={() => provideTicket(attender.user.uid)}
                    />
                        <p className="profile-name" >{attender.user.userName}</p>
                        <p className="profile-buyin">{attender.buyIn}</p>
                    </div>}
                )}
                </div>
            </div>
        </div>
        }

        {isAttend && <button disabled={moim.isPrizedOut} onClick={buyIn} className="btn-active">바이인 하기</button>}
        {moim && <Rank moimId={moimId} moim={moim} isHost={isHost} />}
        {isHost && <button disabled={moim.isPrizedOut} className="btn-unactive" onClick={() => pageToUpdate(moimId)}>모임 수정하기</button>}
    </div>
}

export default MoimSpecific
