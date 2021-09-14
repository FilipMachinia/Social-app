import React, {Component} from 'react';
import Identicon from 'identicon.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome} from '@fortawesome/free-solid-svg-icons'
import './Navbar.css';

class Navbar extends Component {
    identiconSize = 38;

    render() {
        return (
            <nav id="navBar" className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow">

                <FontAwesomeIcon id="homeIcon" icon={faHome} color='white' size="2x" onClick={() => window.location.reload()}/>

                <div id="navBarRight">
                    {/*<FontAwesomeIcon id="settingsIcon" icon={faCog} color='white' size="2x" onClick={() => window.location.reload()}/>*/}
                    <small id="account">{this.props.account}</small>
                    {this.props.account
                        ? <img className='ml-2' width={this.identiconSize} height={this.identiconSize}
                               src={`data:image/png;base64,${new Identicon(this.props.account, this.identiconSize).toString()}`}
                               alt="identicon"/>
                        : <span>No account found</span>
                    }
                </div>
            </nav>
        );
    }
}

export default Navbar;