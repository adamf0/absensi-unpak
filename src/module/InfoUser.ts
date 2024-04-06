export const getInfoUser = (key:string) =>{
    const infoUser = JSON.parse(localStorage.getItem('infoUser')??"[]")
    return infoUser[key]
}