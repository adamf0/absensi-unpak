import axiosInstance from "../axiosInstance";

export const GetListJenisIzin = async (page:number|null = null) => {
    try {
        const response = await axiosInstance.get(page==null? `/jenis_izin`:`/jenis_izin?page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};