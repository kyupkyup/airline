import { useEffect } from "react";
import { useUserContext } from "../context/User";

const Account = () => {
    const { user, refreshUser } = useUserContext();

    useEffect(() => {
        if (!user) {
            refreshUser()
        }
    }, [user])

    return user && <div class="route-container side-container">
        <div class="profile-container">
            <img src={user.photoUrl} class="profile-pic" referrerpolicy="no-referrer" />
            <div class="user-name">{user.userName}</div>
            <div class="user-email">{user.email}</div>
        </div>
        <div class="profile-container">
            <div className="profile-specific">
                <p>보유 티켓</p> <p>{user.buyIn}</p>
            </div>
            <div className="profile-specific">
                <p>총 바이인한 티켓 </p><p>{user.usedBuyIn}</p>
            </div>
            <div className="profile-specific">

                <p>총 프라이즈</p><p>{user.earnedBuyIn}</p>
            </div>
            <div className="profile-specific">

                <p>1등 횟수 </p><p>{user.rank.first}</p>
            </div>
            <div className="profile-specific">

                <p>2등 횟수</p><p>{user.rank.second}</p>
            </div>
            <div className="profile-specific">

                <p>3등 횟수</p><p>{user.rank.third}</p>
            </div>
            <div className="profile-specific">

                <p>4등 횟수</p><p> {user.rank.fourth}</p>
            </div>
            <div className="profile-specific">

                <p>참석 횟수</p><p>{user.attend}</p>
            </div>

        </div>
    </div>
}

export default Account;