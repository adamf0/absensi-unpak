import axiosInstance from "@/module/axiosInstance";

export const GetListSPPD = async (page: number, nidn: string|null = null, nip: string|null = null, search: string|null = null) => {
    try {
        const response = await axiosInstance.get(page==null? `/sppd`:`/sppd?nidn=${nidn}&nip=${nip}&search=${search}&page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};