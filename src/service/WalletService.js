import axios from 'axios';
const headers = {
    "X-APP-TOKEN":"d9ac63d48fc3b1213699b58375899051f37b5449b258540a0c331bd8b3747823"
}
export const Wallets = () => {
    return new Promise((resolve, reject) => {
        axios.get('https://f5522a0rmc.execute-api.us-east-1.amazonaws.com/dev/walletService/wallets',{headers}).then((response) => {
            if (response.data && response.data.status === "SUCCESS") {
                resolve({data: response.data.data})
            }
            throw new Error("Data not Found")
        }).catch((error) => {
            // handle error
            resolve({error: error || "Api Failed"})
        });
    })
}

export const Wallet = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://f5522a0rmc.execute-api.us-east-1.amazonaws.com/dev/walletService/wallet?id=${id}`,{headers}).then((response) => {
            if (response.data && response.data.status === "SUCCESS") {
                resolve({data: response.data.data})
            }
            throw new Error("Data not Found")
        }).catch((error) => {
            // handle error
            resolve({error: error || "Api Failed"})
        });
    })
}

export const Transactions = (id, index, pageSize) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://f5522a0rmc.execute-api.us-east-1.amazonaws.com/dev/walletService/transactions?id=${id}&skip=${index}&limit=${pageSize}`, {headers}).then((response) => {
            if (response.data && response.data.status === "SUCCESS") {
                resolve({data: response.data.data})
            }
            throw new Error("Data not Found")
        }).catch((error) => {
            // handle error
            resolve({error: error || "Api Failed"})
        });
    })
}

export const Transact = (data,id) => {
    return new Promise((resolve, reject) => {
        axios.post(`https://f5522a0rmc.execute-api.us-east-1.amazonaws.com/dev/walletService/transact?id=${id}`, data, {headers} ).then((response) => {
            if (response.data && response.data.status === "SUCCESS") {
                resolve({data: response.data.data})
            }
            throw new Error("Data not Found")
        }).catch((error) => {
            // handle error
            resolve({error: error || "Api Failed"})
        });
    })
}

export const CreateWallet = (data) => {
    return new Promise((resolve, reject) => {
        axios.post(`https://f5522a0rmc.execute-api.us-east-1.amazonaws.com/dev/walletService/setup`, data, {headers} ).then((response) => {
            if (response.data && response.data.status === "SUCCESS") {
                resolve({data: response.data.data})
            }
            throw new Error("Data not Found")
        }).catch((error) => {
            // handle error
            resolve({error: error || "Api Failed"})
        });
    })
}