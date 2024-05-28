import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useFirebaseContext } from "../../context/Firebase";
import MoimItem from '../../component/moim/Item'
import { useUserContext } from "../../context/User";

const Moim = () => {
    const [list, setList] = useState([]);
    const { db } = useFirebaseContext()
    const { user, refreshUser} = useUserContext();
    const navigate = useNavigate()

    const navigateWrite = () => {
        navigate('/moim/write')
    }

    const getDocsFromDb = async () => {
        let docs = [];
        const moimCollection = collection(db, "moim")
        const moimQuery = query(moimCollection, orderBy('isPrizedOut', 'asc'), orderBy('targetDate', 'desc'));

        const querySnapshot = await getDocs(moimQuery);
        querySnapshot.forEach((doc) => {
            docs = [...docs, { id: doc.id, data: doc.data() }]
        });
        setList(docs)
    }


    useEffect(() => {
        if(!user) {
            navigate('/Auth')
        }
        (async () => {
            await getDocsFromDb();
        })()
    }, [])

    return <div className="route-container side-container">
        <ul className="moim-container">
            {
                list.map(item => {
                    return <MoimItem idProps={item.id} moimDataProps={item.data} />
                })
            }
        </ul>


        <button class="create-btn" onClick={navigateWrite}>모임 만들기</button>
    </div>
}

export default Moim;
