import { useEffect, useState } from "react"
import {
    doc, getDoc, updateDoc,
    increment
} from "firebase/firestore"
import { useFirebaseContext } from "../../context/Firebase"
import { distribute } from '../../utils/prize'
import useOnChange from '../../hooks/useChange'
import useDropdown from "../../hooks/useDropDown"

const Rank = ({ moimId, moim }) => {
    console.log(moim)
    const [tickets, setTickets] = useState(null)
    const { db } = useFirebaseContext()
    const [dealer, handleChange] = useOnChange();
    const { selected: firstSelected, List: FirstList, openDropdown: openFirstDropDown, isOpen: isFirstOpen } = useDropdown(moim.attendance);
    const { selected: secondSelected, List: SecondList, openDropdown: openSecondDropDown, isOpen: isSecondOpen } = useDropdown(moim.attendance);
    const { selected: thirdSelected, List: ThirdList, openDropdown: openThirdDropDown, isOpen: isThirdOpen } = useDropdown(moim.attendance);
    const { selected: fourthSelected, List: FourthList, openDropdown: openFourthDropDown, isOpen: isFourthOpen } = useDropdown(moim.attendance);
    const [prize, setPrize] = useState({
        first: 0,
        second: 0,
        third: 0,
        fourth: 0
    })
    const [isPrizedOut, setPrizeOut] = useState();

    const checkPrizedOut = async () => {
        const moimRef = doc(db, "moim", moimId);
        const moimDocSnap = await getDoc(moimRef)
        try {
            const docSnap = await getDoc(moimDocSnap)
            if (docSnap.exists()) {
                setPrizeOut(docSnap.data().isPrizedOut)
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
        const [first, second, third, fourth] = distribute(tickets / 2, dealer)
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
            if (!thirdSelected) alert('3등 유저를 선택해주세요. 상금이 없어도 아무나 선택해주세요.')
            if (!fourthSelected) alert('4등 유저를 선택해주세요. 상금이 없어도 아무나 선택해주세요.')

            const result = window.confirm(`
            정말 지급 하시겠습니까?
            1등 : ${firstSelected.displayName} 에게 ${prize.first}
            2등 : ${secondSelected.displayName} 에게 ${prize.second}
            3등 : ${thirdSelected.displayName} 에게 ${prize.third}
            4등 : ${fourthSelected.displayName} 에게 ${prize.fourth}
        `)
            if (!result) {
                alert('상금 지급을 취소했습니다.')
                return;
            }

            let userDocRef = doc(db, 'users', firstSelected.uid)
            const moimDocRef = doc(db, 'moim', moimId)

            await updateDoc(userDocRef, { buyIn: increment(prize.first) })
            userDocRef = doc(db, 'users', secondSelected.uid)
            await updateDoc(userDocRef, { buyIn: increment(prize.second) })
            userDocRef = doc(db, 'users', thirdSelected.uid)
            await updateDoc(userDocRef, { buyIn: increment(prize.third) })
            userDocRef = doc(db, 'users', fourthSelected.uid)
            await updateDoc(userDocRef, { buyIn: increment(prize.fourth) })

            alert('상금 지급이 완료되었습니다.')
            await updateDoc(moimDocRef, { isPrizedOut: true })

            setPrizeOut(true)
        }
        catch (e) {
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
        <div>entry : {tickets}</div>
        <button onClick={refresh}>새로고침</button>
        <button onClick={prizeCalculate}>상금 계산</button>
        <input type="text" value={dealer} onChange={handleChange} placeholder="딜러비" />

        <div>
            <button onClick={openFirstDropDown}>멤버 보기</button>
            {isFirstOpen && <FirstList>
                {(item) => <span>{item.displayName}</span>}
            </FirstList>}
            1등 : {prize.first} {firstSelected?.displayName}
        </div>
        <div>
            <button onClick={openSecondDropDown}>멤버 보기</button>
            {isSecondOpen && <SecondList>
                {(item) => <span>{item.displayName}</span>}
            </SecondList>}
            2등 : {prize.second} {secondSelected?.displayName}
        </div>
        <div>
            <button onClick={openThirdDropDown}>멤버 보기</button>
            {isThirdOpen && <ThirdList>
                {(item) => <span>{item.displayName}</span>}
            </ThirdList>}
            3등 : {prize.third}  {thirdSelected?.displayName}
        </div>
        <div>
            <button onClick={openFourthDropDown}>멤버 보기</button>
            {isFourthOpen && <FourthList>
                {(item) => <span>{item.displayName}</span>}
            </FourthList>}
            4등 : {prize.fourth}  {fourthSelected?.displayName}
        </div>

        {!isPrizedOut && <button onClick={prizeout}>프라이즈 지급</button>}
        {isPrizedOut && <p onClick={prizeout}>프라이즈 지급 완료</p>}
    </>
}

export default Rank