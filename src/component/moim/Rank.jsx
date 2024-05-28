import { useEffect, useState } from "react"
import {
    doc, getDoc, updateDoc,
    increment, writeBatch,
    collection
} from "firebase/firestore"
import { useFirebaseContext } from "../../context/Firebase"
import { distribute } from '../../utils/prize'
import useOnChange from '../../hooks/useChange'
import useDropdown from "../../hooks/useDropDown"

const Rank = ({ moimId, moim, isHost }) => {
    const [tickets, setTickets] = useState(null)
    const { db } = useFirebaseContext()
    const [dealer, handleChange] = useOnChange();
    const { selected: firstSelected, List: FirstList, clickDropDown: openFirstDropDown, isOpen: isFirstOpen } = useDropdown(moim.attendance, moim?.rank.first.user);
    const { selected: secondSelected, List: SecondList, clickDropDown: openSecondDropDown, isOpen: isSecondOpen } = useDropdown(moim.attendance, moim?.rank.second.user);
    const { selected: thirdSelected, List: ThirdList, clickDropDown: openThirdDropDown, isOpen: isThirdOpen } = useDropdown(moim.attendance, moim?.rank.third.user);
    const { selected: fourthSelected, List: FourthList, clickDropDown: openFourthDropDown, isOpen: isFourthOpen } = useDropdown(moim.attendance, moim?.rank.fourth.user);
    const [prize, setPrize] = useState({
        first: moim?.rank.first.prize,
        second: moim?.rank.second.prize,
        third: moim?.rank.third.prize,
        fourth: moim?.rank.fourth.prize
    })
    const [isPrizedOut, setPrizeOut] = useState();

    const checkPrizedOut = async () => {
        const moimRef = doc(db, "moim", moimId);
        const moimDocSnap = await getDoc(moimRef)
        try {
            if (moimDocSnap.exists()) {
                setPrizeOut(moimDocSnap.data().isPrizedOut, { merge: true })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const refresh = async () => {
        const moimRef = doc(db, "moim", moimId);
        const moimDocSnap = await getDoc(moimRef)
        const ticketsFromDb = await moimDocSnap.data().attendance.reduce((acc, cv) => acc + cv.buyIn, 0)
        setTickets(ticketsFromDb)
        checkPrizedOut();
    }

    const prizeCalculate = () => {
        if (typeof Number(dealer) !== 'number') {
            alert('숫자만 입력해주세요.')
            return;
        }
        const [first, second, third, fourth] = distribute(tickets, dealer)
        setPrize({
            first,
            second,
            third,
            fourth
        })
    }

    const prizeout = async () => {
        try {
            if (!firstSelected) alert('1등 유저를 선택해주세요.')
            if (!secondSelected) alert('2등 유저를 선택해주세요.')

            const result = window.confirm(`
            정말 지급 하시겠습니까?
            1등 : ${firstSelected?.user?.userName || ''} 에게 ${prize.first}
            2등 : ${secondSelected?.user?.userName || ''} 에게 ${prize.second}
            3등 : ${thirdSelected?.user?.userName || ''} 에게 ${prize.third}
            4등 : ${fourthSelected?.user?.userName || ''} 에게 ${prize.fourth}
        `)
            if (!result) {
                alert('상금 지급을 취소했습니다.')
                return;
            }

            const batch = writeBatch(db)
            const dbRef = collection(db, 'users')

            const firstUserDocRef = doc(dbRef, firstSelected.user.uid)

            moim.attendance.forEach((attender) => {
                const userRef = doc(dbRef, attender.user.uid)
                batch.update(userRef, {
                    attend: increment(1)
                })
            })

            const moimDocRef = doc(db, 'moim', moimId)

            batch.update(firstUserDocRef, {
                buyIn: increment(prize.first),
                'rank.first': increment(1),
                earnedBuyIn: increment(prize.first)
            }, { merge: true })
            if (secondSelected) {
                const secondUserDocRef = doc(dbRef, secondSelected.user.uid)
                batch.update(secondUserDocRef, {
                    buyIn: increment(prize.second),
                    'rank.second': increment(1),
                    earnedBuyIn: increment(prize.second)
                }, { merge: true })
            }
            if (thirdSelected) {
                const thirdUserDocRef = doc(dbRef, thirdSelected.user.uid)
                batch.update(thirdUserDocRef, {
                    buyIn: increment(prize.third),
                    'rank.third': increment(1),
                    earnedBuyIn: increment(prize.third)
                }, { merge: true })
            }
            if (fourthSelected) {
                const fourthUserDocRef = doc(dbRef, fourthSelected.user.uid)
                batch.update(fourthUserDocRef, {
                    buyIn: increment(prize.fourth),
                    'rank.fourth': increment(1),
                    earnedBuyIn: increment(prize.fourth)
                }, { merge: true })
            }

            batch.update(moimDocRef, {
                'rank.first.user': firstSelected,
                'rank.second.user': secondSelected || {},
                'rank.third.user': thirdSelected || {},
                'rank.fourth.user': fourthSelected || {},
                'rank.first.prize': prize.first,
                'rank.second.prize': prize.second,
                'rank.third.prize': prize.third,
                'rank.fourth.prize': prize.fourth,
                isPrizedOut: true
            })

            await batch.commit()

            alert('상금 지급이 완료되었습니다.')
            // await updateDoc(moimDocRef, { isPrizedOut: true }, { merge: true })

            setPrizeOut(true)
        }
        catch (e) {
            console.log(e)
            alert('상금 지급에 실패했습니다.')
        }
    }

    useEffect(() => {
        if (tickets === null) {
            refresh()
        }
    })
    // 티켓 수 계산 (전체 - 인원)

    return <>
        <div className="bold">entry : {tickets}</div>
        {
            isHost && <>
                <button onClick={refresh} className="btn-unactive">새로고침</button>
                <input type="text" className="input-dealer" value={dealer} onChange={handleChange} placeholder="딜러비" />
                <button onClick={prizeCalculate} className="btn-unactive">상금 계산</button>
            </>
        }

        <div>
            {isHost && <button className="btn-active color-light" onClick={openFirstDropDown}>1등 선택</button>}
            {isFirstOpen && <FirstList FirstItem={({ onClick }) => <div onClick={onClick}>없음</div>}>
                {(item) => <div>{item?.user?.userName}</div>}
            </FirstList>}
            1등 : {prize.first} {firstSelected?.user?.userName || '선택 안함'}
        </div >
        <div>
            {isHost && <button className="btn-active color-light" onClick={openSecondDropDown}>2등 선택</button>}
            {isSecondOpen && <SecondList FirstItem={({ onClick }) => <div onClick={onClick}>없음</div>}>
                {(item) => <div>{item?.user?.userName}</div>}
            </SecondList>}
            2등 : {prize.second} {secondSelected?.user?.userName || '선택 안함'}
        </div>
        <div>
            {isHost && <button className="btn-active color-light" onClick={openThirdDropDown}>3등 선택</button>}
            {isThirdOpen && <ThirdList FirstItem={({ onClick }) => <div onClick={onClick}>없음</div>}>
                {(item) => <div>{item?.user?.userName}</div>}
            </ThirdList>}
            3등 : {prize.third}  {thirdSelected?.user?.userName || '선택 안함'}
        </div>
        <div>
            {isHost && < button className="btn-active color-light" onClick={openFourthDropDown}>4등 선택</button>}
            {isFourthOpen && <FourthList FirstItem={({ onClick }) => <div onClick={onClick}>없음</div>}>
                {(item) => <div>{item?.user?.userName}</div>}
            </FourthList>}
            4등 : {prize.fourth}  {fourthSelected?.user?.userName || '선택 안함'}
        </div >

        {
            !isPrizedOut && isHost && <button onClick={prizeout} className="btn-active important">프라이즈 지급</button>
        }
        {isPrizedOut && <p>프라이즈 지급 완료</p>}
    </>
}

export default Rank
