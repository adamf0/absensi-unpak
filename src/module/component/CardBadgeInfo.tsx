import classNames from "classnames";
import { FC, ReactNode } from "react";
import { TRounded } from "@/types/rounded.type";

interface ICardBadgeInfoProps {
    children?: ReactNode;
	className?: string;
	status?: string;
	value?: number | string;
	rounded?: TRounded;
}

const CardBadgeInfo: FC<ICardBadgeInfoProps> = (props) => {
	const { children, className, status, value, rounded, ...rest } = props;

	return (
		<div
        data-component-name='Balance'
        className={classNames(
            'flex items-center gap-2 bg-zinc-950/5 p-2 dark:bg-zinc-950/50',
            className
        )}
        {...rest}>
        <span
            className={classNames({
                'text-amber-600': status === 'waiting',
                'text-red-700': status === 'reject',
                'text-lime-700': status === 'success',
            })}>
            {value}
        </span>
        {children && <span className='text-zinc-500'>{children}</span>}
    </div>
	);
};
export default CardBadgeInfo