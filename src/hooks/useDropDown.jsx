import { useState } from "react"

const useDropdown = (list, initialValue) => {
    const [selected, setSelected] = useState(initialValue)
    const [isOpen, setOpen] = useState(false)

    const clickDropDown = () => {
        if (isOpen) {
            setOpen(false)
        }
        else {
            setOpen(true)
        }
    }

    const openDropdown = () => {
        setOpen(true)
    }

    const closeDropdown = () => {
        setOpen(false)
    }

    const List = ({ FirstItem, children }) => {
        return <ul className='rank-select-list'>
            <FirstItem onClick={() => {
                closeDropdown()
                setSelected(null)
            }} />
            {list.map((item) => {
                return <li onClick={() => {
                    setSelected(item)
                    closeDropdown()
                }}>
                    {children(item)}
                </li>
            })}
        </ul>
    }

    return { isOpen, openDropdown, selected, closeDropdown, List, clickDropDown }
}

export default useDropdown