import axiosInstance from "@/module/axiosInstance";

export const UpdatePengguna = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/pengguna/update', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};