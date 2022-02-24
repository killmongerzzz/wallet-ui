import React, { useState } from "react";
import { Button, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Alert, Card, CardBody, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import ReactPaginate from 'react-paginate';
const momentTimezone = require("moment-timezone")
export const WalletCreate = (props) => {
    const [inputs, setInputs] = useState({});
    return (
        <React.Fragment>
            <ModalHeader toggle={({target}) => props.close(false)}>Create Wallet:</ModalHeader>
            <ModalBody className="pb-2">
                {props.error?<Alert color="danger">{props.error}</Alert>: null}
                <Card>
                <CardBody>
                    <Form>
                        <FormGroup row>
                            <Label sm={2}>Balance</Label>
                            <Col sm={10}>
                                <Input id="balance" name="balance" placeholder="20.0432" onChange={({target}) => setInputs(state => ({...state,balance:target.value}))} value={inputs.balance || ""}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Wallet Name</Label>
                            <Col sm={10}>
                                <Input id="name" name="name" placeholder="Test Wallet" onChange={({target}) => setInputs(state => ({...state,name:target.value}))} value={inputs.name || ""}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </CardBody>
                </Card>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={({target}) => props.create(inputs)}>Done</Button>
            </ModalFooter>
        </React.Fragment>
    )
}
export const WalletDescription = (props) => {
    const [inputs, setInputs] = useState({});
    const transactionList = props.transactions.map((x,index)=> {
            return <tr key={index} index={index} className={(index + 1) % 2 === 0 ? "even-row m-0" : "odd-row m-0"}>
                <td className="text-truncate" title={x.description}>{x.description}</td>
                <td className="text-truncate" title={x.type}>{x.type}</td>
                <td className="text-truncate" title={momentTimezone(x.createdOn).tz('IST').format('DD/MM/yy hh:mm:ss a')}>{momentTimezone(x.createdOn).tz('IST').format('DD/MM/yy hh:mm:ss a')}</td>
                <td className="text-truncate" title={x.credit}>{x.credit}</td>
                <td className="text-truncate" title={x.balance}>{x.balance}</td>
            </tr>
        })
    const handlePageClick = ({ selected: selectedPage }) =>{
        props.handlePageClick(selectedPage);
    }
    return (
        <React.Fragment>
            <ModalHeader toggle={({target}) => props.closeWallet()}>Wallet Descriptions:</ModalHeader>
            <ModalBody className="pb-0">
                {props.error?<Alert color="danger">{props.error}</Alert>: null}
                <Alert className="w-100">
                    <Container>
                        <Row><p className="text-capitalize font-weight-bold">Wallet:</p></Row>
                        <Row xs="2">
                            <Col className="bg-light">{props.walletName}</Col>
                            <Col className="bg-light">{props.credit}</Col>
                        </Row>
                    </Container>
                </Alert>
                <br/>
                <p className="text-capitalize font-weight-bold">CREDIT/WITHDRAW</p>
                <Card>
                <CardBody>
                    <Form>
                        <FormGroup row>
                            <Label sm={2}>Amount</Label>
                            <Col sm={10}>
                                <Input id="amount" name="amount" placeholder="20.0432" onChange={({target}) => setInputs(state => ({...state,amount:target.value}))} value={inputs.amount || ""}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Description</Label>
                            <Col sm={10}>
                                <Input id="description" name="description" placeholder="Credit/Withdraw" onChange={({target}) => setInputs(state => ({...state,description:target.value}))} value={inputs.description || ""}/>
                            </Col>
                        </FormGroup>
                        <Button color="primary" onClick={({target}) => props.create(inputs)}>Done</Button>
                    </Form>
                </CardBody>
                </Card>
                <br/>
                <Table borderless hover striped>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>{transactionList}</tbody>
                </Table>
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={0}
                    pageCount={props.pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </ModalBody>
        </React.Fragment>
    )
}
