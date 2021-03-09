
import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { PangeaUserType } from '../../services/api/models/user';

interface UserContextInterface {
    user: PangeaUserType | undefined;
    handleFetchUserProfile: (newUser: PangeaUserType) => void
}

const UserContext = createContext<UserContextInterface>({
    user: undefined,
    handleFetchUserProfile: () => undefined,
})

interface UserContextProviderProps {
    children?: React.ReactNode | React.ReactNode[];
}

export const useUserContext = () => {
    return useContext(UserContext);
}

export const UserContextProvider = ({
    children,
}: UserContextProviderProps): React.ReactElement => {
    const [user, setUser] = useState<UserContextInterface['user']>(undefined);

    const handleFetchUserProfile = useCallback((newUser: PangeaUserType) => {
        setUser(newUser);
    }, [setUser])
    const value = useMemo(() => ({
        user, handleFetchUserProfile,
    }), [user, handleFetchUserProfile]);

    return (
        <UserContext.Provider value={value} >
            {children}
        </UserContext.Provider>
    )
} 

export default UserContext;

