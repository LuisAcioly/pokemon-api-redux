import api from './api';

export default function loadList(pokemon){
    console.log(api);
    const response = api.get(`/pokemon/${pokemon}`).then(data => {console.log(data)}).catch((erro) => { console.log(erro); });
    console.log(response);
    return response;
};