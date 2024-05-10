import axiosInstance from "@/module/axiosInstance";

export const GetListMasterCalendar = async (page:number|null = null) => {
    try {
        const response = await axiosInstance.get(page==null? `/master_calendar`:`/master_calendar?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};