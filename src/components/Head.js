import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Head = () => { 

    const [list, setList] = useState([]);
    const dispatch = useDispatch();
    const result  = useSelector((s) => s.common);

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const response = await await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=800`);
        console.log(response);
    };

    function setPokemons(data) {
        console.log(data)
    };

    return(
        <div className="head">
            {list}
        </div>
    );
};

export default Head;