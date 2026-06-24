import { createContext, useContext, useState, ReactNode, use, useEffect } from "react"

type AuthContextType = {
    isLoggedIn: boolean
    login: (nome:string) => void
    logout: () => void
    userName: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem("loggedIn") === "true"
    )
    const [userName, setUserName] = useState(
        () => ""
    )
    useEffect( ()=>{

        const loggedHandler = async ()=>{
            const response = await fetch(`http://localhost:3000/auth`,{credentials:"include"})
            const data = await response.json()
            
            if(data.logged){
                localStorage.setItem("loggedIn", "true")
                setIsLoggedIn(true);
                setUserName(data.nome);
            }
            else{
                localStorage.setItem("loggedIn", "false")
                setIsLoggedIn(false)
                setUserName("")
            }
        }
        
        loggedHandler()
    });

    function login(nome:string) {
        setIsLoggedIn(true)
        setUserName(nome);
    }

    function logout() {
        
        const logoutHandler = async () =>{
            const response = await fetch(`http://localhost:3000/logout`,{credentials:"include"})
            const data = await response.json()

            if(!data.logged){
                localStorage.removeItem("loggedIn");
                setIsLoggedIn(false);
                setUserName("")
            }
        }
        logoutHandler()
        localStorage.removeItem("loggedIn")
        setIsLoggedIn(false)
        setUserName("")
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout,userName }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
    return ctx
}