import { useState } from "react"

const useDropdown = (list) => {
    const [selected, setSelected] = useState()
    const [isOpen, setOpen] = useState(false)

    const openDropdown = () => {
        setOpen(true)
    }

    const closeDropdown = () => {
        setOpen(false)
    }

    const List = ({ children }) => {
        return <ul>
            {list.map(item => {
                return <li onClick={() => {
                    setSelected(item)
                    closeDropdown()
                }}>
                    {children(item)}
                </li>
            })}
        </ul>
    }

    return { isOpen, openDropdown, selected, closeDropdown, List }
}

export default useDropdown