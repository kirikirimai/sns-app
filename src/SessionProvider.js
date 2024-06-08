import { createContext, useEffect, useState } from 'react';
import { authRepository } from './repositories/auth';

const SessinContext =createContext();

const SessionProvider = (props)=>{
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setSession();
    },[]);

    const setSession = async () => {
        const user = await authRepository.getCurrentUser();
        setCurrentUser(user);
        setIsLoading(false);
    }   

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <SessinContext.Provider value={{currentUser, setCurrentUser}}>
            {props.children}
        </SessinContext.Provider>
    )
}

export {SessinContext, SessionProvider}