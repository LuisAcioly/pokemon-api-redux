import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from 'react';
import axios from 'axios';
import { setlist } from "../store/actions";
import { Card } from 'react-bootstrap';
import styles from '../style/styles.css'
import { useHistory } from "react-router-dom";
import capitalize from "../services/Capitalize"
import colors from "../services/Colors";

const List = () => { 

    const dispatch = useDispatch();
    const result  = useSelector((s) => s.common);
    const history = useHistory();

    useEffect(() => {
        getList();
    }, []);

    async function getList() {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=24`);
        console.log(response.data.results[0].url)
        createList(response)
    };

    async function createList(request){
        let array = [];

        for(var item in request.data.results){
            let pokemon = await axios.get(request.data.results[item].url);
            array.push(pokemon.data)
        }

        setPokemons(array)
    }

    function pokemonInfo(item){
        console.log("it works");
        history.push(`/${item.name}`, {pokemon: item})
    }

    function setPokemons(array) {
        dispatch(setlist(array));
        console.log(result.pokemonList)
        console.log(colors['grass'])
    };

    return(
        <div className="content">
            <div className="head">
                <h1>Lista</h1>
            </div>
            <div className="list-holder">
                <ul id="list">
                    {result.pokemonList.map((item, index)=> (
                        <li key={index} onClick={() => {pokemonInfo(item)}}>
                            <Card style={{ width: '10rem', marginBottom: 15}}>
                                <Card.Img variant="top" style={{backgroundColor: '#E8EBE9', borderRadius: 5}} src={item.sprites.other["official-artwork"].front_default} />
                                <Card.Body style={{paddingLeft: 10, paddingTop: 10}}>
                                    <Card.Title style={{ fontFamily: 'Roboto', color: '#949494'}}>N° {item.id}</Card.Title>
                                    <Card.Text style={{fontSize: 25, fontWeight: 'bold', fontFamily: 'Source Sans Pro', marginBottom: 15, marginTop: 10}}>
                                        {item.name.capitalize()}
                                    </Card.Text>
                                    <div className="types">
                                        {item.types.map((type, index) => (
                                            <span key={index} style={{backgroundColor: colors[type.type.name]}}>{type.type.name.capitalize()}</span>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default List;