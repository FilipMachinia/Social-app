import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
import SocialNetwork from '../abis/SocialNetwork.json';
import Main from "./Main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

class App extends Component {
    myPost = {
        id: 'd3b07384d113edec49eaa6238ad5ff00',
        content: 'test post',
        tipAmount: 0,
        author: '3d6d12f73e1db06e18cd7472432d4509292f6457'
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.ethereum)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId();
        const networkData = SocialNetwork.networks[networkId];

        if (networkData) {
            const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address);
            this.setState({socialNetwork});
            const postCount = await socialNetwork.methods.postCount().call();
            this.setState({postCount});

            for (let i = 1; i <= postCount; i++) {
                const post = await socialNetwork.methods.posts(i).call();
                this.setState({
                    posts: [...this.state.posts, post]
                })
            }
            this.sortPostsByAmount();
            this.setState({loading: false});

            // uncomment below to see post without Ganache
            // this.setState({posts: [...this.state.posts, this.myPost]});
        } else {
            window.alert("Not supported");
        }
    }

    sortPostsByAmount(){
        this.setState({
            posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount)
        })
    }

    createPost = (content) => {
        this.setState({loading: true});
        this.state.socialNetwork.methods.createPost(content).send({from: this.state.account}).once('done', () => {
            this.setState({loading: false});
        }).on('confirmation', function (confirmationNumber, receipt) {
            window.location.reload();
        });
    }

    tipPost = (id, tipAmount) => {
        this.setState({loading: true})
        this.state.socialNetwork.methods.tipPost(id).send({from: this.state.account, value: tipAmount.toString()})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            }).on('confirmation', function (confirmationNumber, receipt) {
            window.location.reload();
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            socialNetwork: null,
            postCount: 0,
            posts: [],
            loading: true,
            defaultTipAmount: '0.1'
        }
    }

    render() {
        return (
            <div id="mainPage">
                <Navbar account={this.state.account}/>
                {this.state.loading ? <div id="loader" className="text-center mt-5 pt-5">
                        <FontAwesomeIcon icon={faSpinner} color='white' size="3x" pulse/>
                    </div>
                    : <Main posts={this.state.posts} createPost={this.createPost}
                            tipPost={this.tipPost} defaultTipAmount={this.state.defaultTipAmount}/>
                }
            </div>
        );
    }
}

export default App;
