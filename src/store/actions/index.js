export function setlist(request){    
    
    return { 
        type: 'SET',
        pokemonList: request,
    }
}