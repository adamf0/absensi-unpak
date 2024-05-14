import axiosInstance from "@/module/axiosInstance";

export const GetListJenisSPPD = async (page:number|null = null) => {
    try {
        const response = await axiosInstance.get(page==null? `/jenis_sppd`:`/jenis_sppd?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};