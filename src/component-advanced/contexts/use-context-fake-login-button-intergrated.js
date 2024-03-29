import React, { useState, useContext, createContext } from "react"
import ReactDOM from "react-dom"

const LoginUserContext = createContext(null)

const UserButton = function(props){
    function LoginButton(props) {
        // 비구조화 할당시, loginUser 정보가 필요하지 않으면 생략 가능 (세터 함수만 받기)
        const { setLoginUser } = useContext(LoginUserContext) // user 정보가 null이기 때문에 setLoginUser만 갖고옴
        const [fetching, setFetching] = useState(false)

        const handleLogin = () => {
            setFetching(true)
            fetch('https://randomuser.me/api/', { headers: { 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then(data => {
                    const login = data.results[0].login

                    setLoginUser({
                        picture: data.results[0].picture.large,
                        username: login.username,  // 이름
                        email: data.results[0].email, // 이메일
                    });
                    // setFetching(false) fetching이 끝났으므로 false로 바꿔주는 게 맞지만 밑에서 amount되니까 의미 X
                    // 이미 amount되어있는 컴포넌트 상태를 왜 바꾸려해?
                })
        }

        return (
            fetching ?
                <button disabled>...</button> : //누를 수 없는 상태
                <button onClick={handleLogin}>Login</button>
        )
    }

    function LogoutButton(props) {
        const { setLoginUser } = useContext(LoginUserContext)

        const handleLogout = () => {
            setLoginUser(null) //user 정보를 null로 바꿔줌
        }

        return (
            <button onClick={handleLogout}>Logout</button>
        )
    }

    function UserInfo(props) {
        const { loginUser } = useContext(LoginUserContext) // 로그인한 user정보에만 useContext를 통해 접근

        return (
            <div>
                <img src={loginUser.picture} style={{ borderRadius: '50%' }} /> {/*전역 정보에 저장*/}
                <p>username: {loginUser.username}</p>
                <p>email: {loginUser.email}</p>
            </div>
        )
    }
    return (
        <div>
            loginUser === null ?
            <div>
                <LoginButton />
                <h2>"방문자"님 환영합니다.</h2>
            </div>
            :
            <div>
                <LogoutButton />
                <h2>"{loginUser.username}"님 환영합니다.</h2>
                <UserInfo />
            </div>
        </div>
    )
}



function App() {
    const [ loginUser, setLoginUser ] = useState(null)

    return (
        <LoginUserContext.Provider value={ { loginUser, setLoginUser } }>
            <UserButton/>
        </LoginUserContext.Provider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))