import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  setPage  from "../store/actions";
import { Card, Spinner } from 'react-bootstrap';
import styles from '../style/styles.css'
import { useHistory } from "react-router-dom";
import capitalize from "../services/Capitalize"
import colors from "../services/Colors";
import types from "../services/Types";
import Request from "../services/Request";
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { FaSearch } from "react-icons/fa";
import { styled } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";

const List = () => { 

    const dispatch = useDispatch();
    const result  = useSelector((s) => s.common);
    const history = useHistory();
    const [pokemonList, setPokemonList] = useState([]);
    const [load, setLoad] = useState(true);
    const [type, setType] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [currentPage, setCurrentPage] = useState(0)
    const {register, handleSubmit} = useForm();
    const [all, setAll] = useState([]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        paddingTop: 1,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        fontSize: 5
        },
    },
    };

    useEffect(() => {
        createAll();
        loading();
        console.log(all)
    }, [load]);

    async function createAll(){
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=384`)
        console.log(response.data.results)
        var array = response.data.results
        console.log(array)
        setAll(array)
        console.log(all)
        getList(0, 24);
    }

    async function getList(beginning, ending) {
        console.log(all)
        const sliced = all
        var list = sliced.slice(beginning, ending)
        console.log(all)
        var array = []

        for (var item in list){
            console.log(item)
            let pokemon = await axios.get(list[item].url);
            array.push(pokemon.data)
        }

        console.log(array)
        setPokemonList(array);
        console.log(all)
        //const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=24&offset=${page}`);
        //createList(response)
    };

    async function createList(request){
        var array = [];
        console.log(request)
        for(var item in request.data.results){
            let pokemon = await axios.get(request.data.results[item].url);
            array.push(pokemon.data)
            //console.log(pokemon.data)
        }

        console.log(array)
        setPokemonList(array);
    }

    function pokemonInfo(item){
        window.scrollTo({top: 0})
        history.push(`/${item.name}`, {pokemon: item})
    }

    function loading(){
        setTimeout(() => {
            setLoad(false)
        }, 1000);
    }

    function changePage(page){
        
        console.log(page);
        dispatch(setPage(page))
        console.log(all[0])
 
        let beginning = pokemonNumber(page)
        let ending = beginning + 24

        console.log(beginning)
        console.log(ending)
        getList(beginning, ending);
        window.scrollTo(0, 0)
    }

    const handleChange = (event, value) => {
        changePage(value)
      };
    
    function pokemonNumber(number){
        return (number-1)*24;
    }

    const filter = ((pokemonName) => {
        const temp = pokemonName.name.toLowerCase();
        //console.log(name)
        createFilteredList(temp)
    })


    function createFilteredList(temp){
        dispatch(setPage(0));
        console.log(type)
        if(temp !== '' && type !== []){
            getFilteredPokemonByNameAndTypes(temp)
        }
        else if(temp !== '' && type === []){
            getFilteredPokemonByName(temp)
        }
        else if(temp === '' && type !== []){
            getFilteredPokemonByType();
        }
        else{
            createAll()
        }
    }

    async function getFilteredPokemonByNameAndTypes(temp){
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${temp}`);
        console.log(response.data);

        let pokemonTypes = getTypes(response);

        console.log(pokemonTypes)

        if(pokemonTypes.length === 0){
            alert("Nenhum resultado encontrado!")
        }else{
            var array = [];
            array.push(response.data)
            setPokemonList(array);
        }

    }

    async function getFilteredPokemonByType(){
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=384`);
        console.log(response)
        getPokemonsByType(response)
    }

    async function getPokemonsByType(request){
        console.log(currentPage)
        var array = []

        for(var item in request.data.results){
            let pokemon = await axios.get(request.data.results[item].url);
            
            let pokemonTypes = getTypes(pokemon)
            if(pokemonTypes.length > 0){
                console.log("ENTROU")
                array.push(request.data.results[item])
            }
        }
        console.log(array)
        setAll(array)
        console.log(all)
        getList(0, 24);

    }

    function getTypes(request){
        var array = []
        var match = true;

        for(var i in request.data.types){
            var pokeType = request.data.types[i].type.name.capitalize()
            array.push(pokeType)
        }

        for(var i in type){
            if(array.includes(type[i]) === false){
                match = false
            }
        }

        if(match){
            return array
        }else{
            return []
        }
        
    }

    async function getFilteredPokemonByName(temp){
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${temp}`);
        console.log(response.data);
        var array = [];
        array.push(response.data)
        setPokemonList(array);
    }

    function countPages(){
        var number = all.length/24;
        console.log(number)
        console.log(Math.round(number))

        var result = Math.round(number) - number
        console.log(result)
        if(result < 0){
            return Math.round(number) + 1
        }else{
            return Math.round(number)
        }
    }

    const handleSelectChange = (event) => {
        const {
          target: { value },
        } = event;

        if(value.length < 3){
            setType(
                typeof value === 'string' ? value.split(',') : value,
            );
        }
      };
    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText('#ce4b4b'),
        backgroundColor: '#ce4b4b',
        '&:hover': {
            backgroundColor: '#e02f2f',
        },
        height: 45,
        marginLeft: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 0
    }));

    function list(){
        return (<div>
                    <div className="head">
                        <h1>Pokedex</h1>
                    </div>
                    <form style={{width: '100%'}} className="form" onSubmit={handleSubmit((data) => filter(data))}> 
                        <div className="filter">   
                                <TextField {...register('name')} style={{width: 250, fontSize: 50}} label="Name" id="outlined-size-normal"/>
                                <div className="select">
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={type}
                                        onChange={handleSelectChange}
                                        label="Type"
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        style={{color: '#000', width: '100%', height: 40}}
                                        name="type"
                                        >
                                        {types.map((name) => (
                                            <MenuItem key={name} value={name} style={{backgroundColor: '#555555'}}>
                                                <Checkbox checked={type.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <ColorButton variant="contained" type="submit"><FaSearch/></ColorButton>
                        </div>
                    </form>
                    <div className="list-holder">
                        <ul id="list">
                            {pokemonList.map((item, index)=> (
                                <li key={index} onClick={() => {pokemonInfo(item)}}>
                                    <Card style={{ width: '10rem', marginBottom: 15, borderStyle: 'none'}}>
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
                    <div className="pagination">
                        <Pagination disabled={pokemonList.length < 24 && currentPage > 1 ? true : false} count={countPages()} page={result.page} onChange={handleChange}/>
                    </div>
                </div>
            )
    }

    function screenLoading(){
        if(load){
            return (
                <div className="load">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        }else{
            return list()
        }
    }

    return(
        <div className="content">
            {screenLoading()}
        </div>
    );
};

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