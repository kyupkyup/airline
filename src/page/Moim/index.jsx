import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useFirebaseContext } from "../../context/Firebase";


import MoimItem from './Item'

const Moim = () => {
    const [list, setList] = useState([]);
    const { db } = useFirebaseContext()
    const navigate = useNavigate()

    const navigateWrite = () => {
        navigate('/moim/write')
    }

    const getDocsFromDb = async () => {
        let docs = [];
        const querySnapshot = await getDocs(collection(db, "moim"));
        querySnapshot.forEach((doc) => {
            docs = [...docs, { id: doc.id, data: doc.data() }]
        });
        setList(docs)
    }


    useEffect(() => {
        (async () => {
            await getDocsFromDb();
        })()
    }, [])

    return <>
        <ul>
            {
                list.map(item => {
                    return <MoimItem idProps={item.id} moimDataProps={item.data} />
                })
            }
        </ul>


        <button onClick={navigateWrite}>모임 만들기</button>
    </>
}

export default Moim;