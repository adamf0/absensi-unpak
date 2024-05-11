import axiosInstance from "@/module/axiosInstance";

export const DeleteMasterCalendar = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/master_calendar/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};