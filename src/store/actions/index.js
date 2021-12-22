export default function setPage(request){    
    return { 
        type: 'SET',
        page: request.page,
    }
}