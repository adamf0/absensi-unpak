import axiosInstance from "../axiosInstance";

export const CreateJenisCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/jenis_cuti/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};