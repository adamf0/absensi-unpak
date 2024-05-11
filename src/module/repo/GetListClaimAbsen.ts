import axiosInstance from "@/module/axiosInstance";

export const GetListClaimAbsen = async (page: number, nidn: string|null = null, nip: string|null = null, search: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/claim_absen?search=${search}&nidn=${nidn}&nip=${nip}&page=${page}&pageSize=10`);
        return response;
    } catch (error) {
        throw error;
    }
};