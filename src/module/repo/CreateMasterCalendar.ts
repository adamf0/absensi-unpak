import axiosInstance from "@/module/axiosInstance";

export const CreateMasterCalendar = async (formData:any) => {
    try {
        const response = await axiosInstance.postForm('/master_calendar/create', formData, {
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};