import axiosInstance from "@/module/axiosInstance";

export const GetListJenisCuti = async (page:number|null = null) => {
    try {
        const response = await axiosInstance.get(page==null? `/jenis_cuti`:`/jenis_cuti?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};