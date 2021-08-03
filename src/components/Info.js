import { useLocation } from "react-router-dom";
import info_style from '../style/info_style.css'
import capitalize from "../services/Capitalize"
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import colors from "../services/Colors";
import axios from 'axios';
import { Card, Header } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { RiArrowRightSFill } from 'react-icons/ri';

const Info = () => {
    const location = useLocation();
    const params = location.state.pokemon;
    const history = useHistory();
    const [statsData, setStatsData] = useState({});
    const [statsOptions, setStatsOption] = useState({});
    const [abilities, setAbilities] = useState([]);
    const [chain, setChain] = useState([]);

    function chartConfig() {
        const config = {
            labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
            datasets: [{
                label: '',
                data: [params.stats[0].base_stat, params.stats[1].base_stat, params.stats[2].base_stat, params.stats[3].base_stat, params.stats[4].base_stat, params.stats[5].base_stat],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }

        return config;
    }

    function optionConfig(){
        const option = {
            plugins: {
                legend: {
                    display: false,
                }
            }, 
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 200,
                }
            }
        }

        return option;
    }

    function createAbilities(){
        var array = [];

        for(var ability in params.abilities){
            if(params.abilities[ability].is_hidden === false){
                array.push((params.abilities[ability].ability.name).capitalize())
            }
        }

        return array;
    }

    async function getEvolutionChain(){
        const evolutions = await axios.get(params.species.url);

        const response = await axios.get(evolutions.data.evolution_chain.url);

        console.log(response)
        
        var array = []

        var pokemon = response.data.chain;

        var reading = true;

        while(reading){
            const item = await axios.get(pokemon.species.url);
            const obj = await axios.get(`https://pokeapi.co/api/v2/pokemon/${item.data.name}`)
            array.push(obj.data)
            if(pokemon.evolves_to.length !== 0){
                pokemon = pokemon.evolves_to[0];
            }
            else{
                reading = false;
            }
        }

        setEvolutions(array)
    }

    function setEvolutions(array){
        switch(array.length){
            case 1:
                setChain([array[0]]);
                console.log(chain)
                break;
            case 2:
                setChain([array[0], array[1]]);
                console.log(chain)
                break;
            case 3:
                setChain([array[0], array[1], array[2]]);
                console.log(chain)
                break;
            default:
                setChain([]);
                console.log(chain)
        }

        
    }

    function printEvolutions(){
        return chain.map((pokemon, index) => (
            <Card key={index} style={{ width: '18rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div className="circle">
                    <Card.Img style={{ width: '4.5rem', backgroundColor: 'rgb(138, 138, 138)', borderRadius: '50%', padding: '1em', borderColor: '#fff', borderWidth: '5%'}} variant="top" src={chain[index].sprites.other["official-artwork"].front_default} />
                </div>
                <Card.Body>
                    <Card.Title>{params.name.capitalize()} N°{pokemon.id}</Card.Title>
                    <Card.Text>
                            <div className="types">
                                {pokemon.types.map((type, index) => (
                                    <span key={index} style={{backgroundColor: colors[type.type.name]}}>{type.type.name.capitalize()}</span>
                                ))}
                            </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        ))
    }

    function pokemonInfo(item){
        console.log("it works");
        history.push(`/${item.name}`, {pokemon: item})
    }

    function Arrow(index){
        if(index < chain.length-1){
            return <div className="arrow"><RiArrowRightSFill/></div>
        }
    }

    useEffect(() => {
        setChain([]);
        getEvolutionChain();
        setStatsData(chartConfig());
        setStatsOption(optionConfig());
        setAbilities(createAbilities());

    }, [])

    return (
        <div className="info-holder">
            <div className="info">
                <h1>{params.name.capitalize()} N°{params.id}</h1>
                <div className="content_holder">
                    <div className="info_content">
                        <div className="img_holder">
                            <img src={params.sprites.other["official-artwork"].front_default}/>
                        </div>
                        <div className="chart_holder">
                            <h1>Stats</h1>
                            <Bar data={statsData} height={400} width={600} options={statsOptions}/>
                        </div>
                    </div>
                    <div className="info_content">
                        <div className="extras">
                            <div className="text_holder">
                                <div className="text">
                                    <h1>Height</h1>
                                    <p>{params.height/10} m</p>
                                </div>
                                <div className="text">
                                    <h1>Weight</h1>
                                    <p>{params.weight/10} kg</p>
                                </div>
                            </div>
                            <div className="text">
                                <h1>Ability</h1>
                                {abilities.map((item, index) => (
                                    <p key={index}>{item}</p>
                                    ))}
                            </div>
                            <div className="text">
                                <h1>Types</h1>
                                <div className="text_holder">
                                    {params.types.map((type, index) => (
                                        <span key={index} style={{backgroundColor: colors[type.type.name]}}>{type.type.name.capitalize()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="extras_2"></div>
                    </div>
                </div>
                <div className="text_field">
                    <h1>Evolutions</h1>
                </div>
                <div className="evolution_chain"> 
                    <ul className="evolutions">
                    {chain.map((pokemon, index) => (
                        <li key={index} onClick={() => {pokemonInfo(pokemon)}}>
                            <Card style={{ width: '18rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                <div className="circle">
                                    <Card.Img style={{ width: '4.5rem', backgroundColor: 'rgb(138, 138, 138)', borderRadius: '50%', padding: '1em', borderColor: '#fff', borderWidth: '5%'}} variant="top" src={pokemon.sprites.other["official-artwork"].front_default} />
                                </div>
                                <Card.Body>
                                    <Card.Title style={{ fontFamily: 'Roboto', color: '#fff', textAlign: 'center'}}>{pokemon.name.capitalize()}<span style={{marginLeft: 0, color: '#949494'}}>N°{pokemon.id}</span></Card.Title>
                                    <Card.Text>
                                            <div className="types">
                                                {pokemon.types.map((type, pIndex) => (
                                                    <span key={pIndex} style={{backgroundColor: colors[type.type.name]}}>{type.type.name.capitalize()}</span>
                                                ))}
                                            </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            {Arrow(index)}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Info;