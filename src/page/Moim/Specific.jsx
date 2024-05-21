import { useParams } from "react-router-dom"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebaseContext } from "../../context/Firebase";
import { useUserContext } from "../../context/User";
import { arrayContainsUser, removeObjectFromArray, arrayContainsUserReturnObj } from '../../utils/string'
import Rank from '../../component/moim/Rank'

const MoimSpecific = () => {
    const { id: moimId } = useParams()
    const { db } = useFirebaseContext()
    const [moim, setMoim] = useState()
    const { user, usageBuyIn, refreshUser } = useUserContext();
    const [isAttend, setAttend] = useState(false);
    const [isHost, setHost] = useState(false)

    const getMoimDoc = async () => {
        const docRef = doc(db, "moim", moimId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
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
                isPrizedOut: false
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

            await updateDoc(userDocRef, { buyIn: increment(tickets) })
            const attendance = arrayContainsUserReturnObj(moim.attendance, user)
            const newAttendance = removeObjectFromArray(moim.attendance, user)
            newAttendance.push({ ...user, buyIn: attendance.buyIn + tickets })

            await updateDoc(moimDocRef, {
                attendance: newAttendance
            })
            setMoim({
                ...moim, attendance: newAttendance
            })
            usageBuyIn(moim.price)

            alert('바이인이 완료되었습니다.')
        }
        catch (e) {
            console.log(e)
        }
    }

    const provideTicket = async (attenderId) => {
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
        alert(`지급/회수가 완료되었습니다. ${tickets} 장`)
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

    return <>
        {`${moimId}모임 상세내용`}
        {moim && <>
            이름 : {moim.name}
            시간 : {moim.targetDate}
            장소 : {moim.place}
            비용 : {moim.price}
            참석인원 : {moim.attendance.map(attender => attender && <div>
                <img src={attender.photoUrl} />
                <p>현재 바이인 수: {attender.buyIn}</p>
                {isHost && <button onClick={() => provideTicket(attender.uid)}>바이인권 지급</button>}
            </div>)}
        </>
            // buyin 이 PRICE 과 같을 경우 바이인완료 보여주기
        }

        {isAttend && <button onClick={buyIn}>바이인 하기</button>}
        {moim && <Rank moimId={moimId} moim={moim} />}

    </>
}

export default MoimSpecific