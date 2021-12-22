import React, { Component } from 'react';
import List from '../components/List';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

class Home extends Component {
    render(){
        return (
            <div className="home">
                <List/>
            </div>
        );
    }
}

export default Home;