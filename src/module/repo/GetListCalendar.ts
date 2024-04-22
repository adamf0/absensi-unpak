import axiosInstance from "@/module/axiosInstance";

export const GetListCalendar = async (yearMonthEvent:string) => {
    try {
        const response = await axiosInstance.get(`/calendar/${localStorage.getItem('authData')}/${yearMonthEvent}`);
        return response;
    } catch (error) {
        throw error;
    }
};