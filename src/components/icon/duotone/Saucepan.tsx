import React, { SVGProps } from 'react';

const SvgSaucepan = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M2 9h10a1 1 0 011 1v3a4 4 0 01-4 4H5a4 4 0 01-4-4v-3a1 1 0 011-1z'
					fill='currentColor'
				/>
				<path
					d='M14.998 9.445l6.504-.362A1.419 1.419 0 0123 10.5a1.419 1.419 0 01-1.498 1.417l-6.504-.362a1.057 1.057 0 010-2.11z'
					fill='currentColor'
					opacity={0.3}
				/>
			</g>
		</svg>
	);
};

export default SvgSaucepan;
