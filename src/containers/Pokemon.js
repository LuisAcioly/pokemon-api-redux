import React, { Component } from 'react';
import Info from '../components/Info';
import 'antd/dist/antd.css';

class Pokemon extends Component {
    render(){
        return (
            <div className="home">
                <Info />
            </div>
        );
    }
}

export default Pokemon;