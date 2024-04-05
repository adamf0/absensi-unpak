import axiosInstance from "../axiosInstance";

export const CreateCuti = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/cuti/create', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};