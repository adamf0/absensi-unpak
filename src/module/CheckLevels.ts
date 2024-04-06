export const hasLevel = (level:string) =>{
    const levels = JSON.parse(localStorage.getItem('level')??"[]")
    return levels.includes(level)
}
export const getLevel = () =>{
    return JSON.parse(localStorage.getItem('level')??"[]")
}