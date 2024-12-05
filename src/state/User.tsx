import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    address: string;
    balance: number;
    setBalance: (balance: number) => void;
}

const UserContext = createContext<UserContextType>({
    address: "",
    balance: 0,
    setBalance: () => {},
});

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState(0);

    async function onCheckUserAddress() {
        const storedAddress = localStorage.getItem("address") || "";
        if (storedAddress && storedAddress !== "undefined") {
            setAddress(storedAddress);
            return;
        }

        const response = await fetch("/api/auth", {
            method: "GET",
        });
        const data = await response.json();

        if (response.ok) {
            setAddress(data.address);
            localStorage.setItem("address", data.address);
        }
    }

    useEffect(() => {
        onCheckUserAddress();
    }, []);

    return (
        <UserContext.Provider value={{ address, balance, setBalance }}>
            {children}
        </UserContext.Provider>
    );
};
