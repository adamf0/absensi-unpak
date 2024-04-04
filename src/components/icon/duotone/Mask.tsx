import React, { SVGProps } from 'react';

const SvgMask = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M7.675 18.731A7.493 7.493 0 0011 12.5a7.5 7.5 0 00-4.083-6.678 8 8 0 11.758 12.91z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M6.393 17.706A7.976 7.976 0 014 12c0-1.932.685-3.704 1.825-5.086A6.497 6.497 0 019 12.5a6.49 6.49 0 01-2.607 5.206z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgMask;
