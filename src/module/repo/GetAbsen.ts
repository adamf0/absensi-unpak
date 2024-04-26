import axiosInstance from "@/module/axiosInstance";

export const GetAbsen = async (tanggal:string, nidn: string|null = null, nip: string|null = null) => {
    try {
        const response = await axiosInstance.get(`/absen/check/${nidn!=null? "nidn":"nip"}/${nidn??nip}/${tanggal}`);
        return response;
    } catch (error) {
        throw error;
    }
};