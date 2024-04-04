import axiosInstance from "../axiosInstance";

export const DeleteCuti = async (id:any) => {
    try {
        const response = await axiosInstance.get(`/cuti/delete/${id}`, {});
        return response;
    } catch (error) {
        throw error;
    }
};