import { MouseEventHandler } from "react";
import { CutiModel } from "./CutiModel";

interface UserProps {
    data: CutiModel,
    toggleDialog: MouseEventHandler<HTMLSpanElement>,
    boxRef: React.RefObject<HTMLSpanElement>,
    tooltipRef: React.RefObject<HTMLDivElement>,
    styleDialog: any, 
    attributes: any
}
export default UserProps;