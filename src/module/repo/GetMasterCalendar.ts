import axiosInstance from "@/module/axiosInstance";

export const GetMasterCalendar = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/master_calendar/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};