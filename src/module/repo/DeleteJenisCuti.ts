import axiosInstance from "@/module/axiosInstance";

export const DeleteJenisCuti = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/jenis_cuti/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};