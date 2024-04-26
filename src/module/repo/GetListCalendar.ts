import axiosInstance from "@/module/axiosInstance";

export const GetListCalendar = async (type:any, nidn_nip:any, yearMonthEvent:any) => {
    try {
        const response = await axiosInstance.get(`/calendar/${type}/${nidn_nip}/${yearMonthEvent}`);
        return response;
    } catch (error) {
        throw error;
    }
};