export const hasLevel = (level:string) =>{
    const levels = JSON.parse(localStorage.getItem('level')??"[]")
    return levels.includes(level)
}