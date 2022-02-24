import React, { Component } from "react";
import { Button, Modal, Table, Card, CardBody, CardTitle, CardText, Alert } from 'reactstrap';
import {Wallets, Wallet, Transactions, Transact, CreateWallet } from "../../service/WalletService";
import {WalletDescription, WalletCreate} from "./WalletDescription";
import LoadingOverlay from 'react-loading-overlay';
import Edit from '../../images/Edit.svg';
import momentTimezone from "moment-timezone";
export default class WalletComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallets: [],
            loadSpinner: true,
            showTransaction: false,
            createWalletFlag: false,
            walletName: "",
            credit: 0,
            transactions: [],
            pageCount: 0,
            pageNumber:1,
            error: ""
        };
    }

    createWallet = (walletInfo) => {
        try {
            if(isNaN(parseFloat(walletInfo.balance))){
                throw new Error("Only Numeric Values are allowed")
            }
            if(walletInfo.balance.split(".")[1] && walletInfo.balance.split(".")[1].length > 4){
                throw new Error("Only 4 digit decimal values are allowed")
            }
            walletInfo.balance = parseFloat(walletInfo.balance);
            this.setState({
                loadSpinner: true
            }, () => {
                CreateWallet(walletInfo).then((res) => {
                    Wallets().then((data) => {this.setState({
                        wallets: data.data || [],
                        loadSpinner: false,
                        error: data.error || "",
                        createWalletFlag: false
                    })});
                })
            })
        } catch (error) {
            this.setState({
                error: error.message
            })
        }
    }

    toggleWallet = (flag) => {
        this.setState({
            createWalletFlag: flag
        })
    }

    showTransaction = (id) => {
       this.setState({
            showTransaction: true,
            loadSpinner: true
        }, () => {
            Wallet(id).then((data) => {
                Transactions(id, 0, 5).then((res) => {
                    this.setState({
                        walletName: data.data.name,
                        walletId: data.data.id,
                        credit: data.data.credit,
                        transactions: res.data.records,
                        pageCount: Math.ceil(res.data.count/5),
                        error: data.error || res.error || "",
                        loadSpinner: false
                    })
                })
            }) 
        })
    }

    handlePageClick = (data) =>{
        this.setState({
            showTransaction: true,
            loadSpinner: true
        }, () => {
            console.log(data)
            Transactions(this.state.walletId, data*5, 5).then((res) => {
                this.setState({
                    transactions: res.data.records,
                    pageCount: Math.ceil(res.data.count/5),
                    error: data.error || res.error || "",
                    loadSpinner: false
                })
            })
        })
    }

    closeWallet = () => {
        this.setState({showTransaction: false,
            createWalletFlag: false,
            walletName: "",
            credit: 0,
            transactions: [],
            pageCount: 0,
            pageNumber:1,
            error: ""})
    }

    createTransaction = (data) => {
        try {
            const {walletId} = this.state;
            if(isNaN(parseFloat(data.amount))){
                throw new Error("Only Numeric Values are allowed")
            }
            if(data.amount.split(".")[1] && data.amount.split(".")[1].length > 4){
                throw new Error("Only 4 digit decimal values are allowed")
            }
            data.amount = parseFloat(data.amount);
            this.setState({
                loadSpinner: true
            }, () => {
                Transact(data, walletId).then((data) => {
                    Transactions(walletId, 0, 10).then((res) => {
                        this.setState({
                            credit: data.data.balance,
                            transactions: res.data.records,
                            pageCount: Math.ceil(res.data.count/5),
                            error: data.error || res.error || "",
                            loadSpinner: false
                        })
                    })
                })
            })  
        } catch (error) {
            this.setState({
                error: error.message
            })
        }
    }

    componentDidMount = async () => {
        Wallets().then((data) => {this.setState({
            wallets: data.data || [],
            loadSpinner: false,
            error: data.error || ""
        })});
    }

    render() {
        const {wallets, loadSpinner, showTransaction, createWalletFlag, error, transactions, walletName, credit, pageCount, pageNumber } = this.state;
        console.log(this.state);
        const wallet = wallets.map((x, index)=> {
            return <tr key={x.id} index={index} className={(index + 1) % 2 === 0 ? "even-row m-0" : "odd-row m-0"}>
                <td className="text-truncate" title={x.name}>{x.name}</td>
                <td className="text-truncate" style={{ maxWidth:"600px" }} title={x.credit}>{x.credit}</td>
                <td className="text-truncate" title={momentTimezone(x.createdOn).tz('IST').format('DD/MM/yy hh:mm:ss a')}>{momentTimezone(x.createdOn).tz('IST').format('DD/MM/yy hh:mm:ss a')}</td>
                <td className="text-center">
                    <img src={Edit} alt="Edit" className={"Edit"} style={{ cursor: "pointer" }} onClick={this.showTransaction.bind(this, x.id)} />
                </td>
            </tr>
        })
        return (
            <LoadingOverlay
                active={loadSpinner}
                spinner={<img src="/static/img/loading.gif" alt="loading" />}
                text="Please wait"
                styles={{
                    overlay: (base) => ({
                        ...base,
                        backgroundColor: "#fff",
                        opacity: 0.8,
                        zIndex: 10000,
                    }),
                }}
            >
                <div className="h-100" style={{minHeight: "800px"}}>
                {createWalletFlag?<Modal isOpen={createWalletFlag} size="lg" >
                    <WalletCreate
                        close={this.toggleWallet}
                        create={this.createWallet}
                        error={error}
                    />
                </Modal>: null}
                {showTransaction?<Modal isOpen={showTransaction} size="lg" >
                    <WalletDescription
                        walletName={walletName}
                        transactions={transactions}
                        credit={credit}
                        pageCount={pageCount}
                        pageNumber={pageNumber}
                        create={this.createTransaction}
                        closeWallet={this.closeWallet}
                        error={error}
                        handlePageClick={this.handlePageClick}
                    />
                </Modal>: null}
                <Card body color="light" outline>
                    <CardBody>
                        <CardTitle tag="h5">Wallet Management</CardTitle>
                        <CardText>Manage Wallets and Transactions in the wallet</CardText>
                        <Button onClick={this.toggleWallet.bind(this, true)}>Create Wallet</Button>
                    </CardBody>
                </Card>
                <Table borderless hover striped>
                    <thead>
                        <tr>
                            <th>Wallet Name</th>
                            <th>Wallet Credit</th>
                            <th>Wallet Created On</th>
                            <th className="text-center">Wallet Action</th>
                        </tr>
                    </thead>
                    <tbody>{wallet}</tbody>
                </Table>
                </div>
            </LoadingOverlay>
        );
    }
}