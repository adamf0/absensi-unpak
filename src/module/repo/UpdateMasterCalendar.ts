import axiosInstance from "@/module/axiosInstance";

export const UpdateMasterCalendar = async (formData:any) => {
    try {
        const response = await axiosInstance.post('/master_calendar/update', formData,{
            headers: {
              "Content-Type": "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};