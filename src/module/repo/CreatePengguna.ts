import axiosInstance from "../axiosInstance";

export const CreatePengguna = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/pengguna/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};